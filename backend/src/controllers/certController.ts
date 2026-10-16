import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Verify Enrollment & Course
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
      include: { course: true, student: true }
    });

    if (!enrollment) {
      res.status(403).json({ message: 'Not enrolled in this course.' });
      return;
    }

    // 2. In a real app, verify LessonProgress == 100% here before generating

    // 3. Check if certificate already exists in DB
    let certificate = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId: studentId, courseId } }
    });

    if (!certificate) {
      // Create new certificate record
      certificate = await prisma.certificate.create({
        data: { userId: studentId, courseId }
      });
    }

    // 4. Generate the PDF Dynamically using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();

    // Draw Border
    page.drawRectangle({
      x: 20, y: 20, width: width - 40, height: height - 40,
      borderColor: rgb(0.13, 0.25, 0.46), // KDCourses Brand Blue
      borderWidth: 10,
    });

    // Draw Title
    page.drawText('Certificate of Completion', {
      x: width / 2 - 190, y: height - 120,
      size: 32, font, color: rgb(0, 0, 0),
    });

    // Draw Student Name
    page.drawText('This certifies that', {
      x: width / 2 - 60, y: height - 200,
      size: 16, font: fontRegular,
    });

    page.drawText(enrollment.student.name.toUpperCase(), {
      x: width / 2 - (enrollment.student.name.length * 7), y: height - 260,
      size: 28, font, color: rgb(0.13, 0.25, 0.46),
    });

    // Draw Course Name
    page.drawText('has successfully completed the course', {
      x: width / 2 - 120, y: height - 320,
      size: 16, font: fontRegular,
    });

    page.drawText(enrollment.course.title, {
      x: width / 2 - (enrollment.course.title.length * 6), y: height - 380,
      size: 24, font,
    });

    // Draw Date
    page.drawText(`Date of Issue: ${certificate.issueDate.toLocaleDateString()}`, {
      x: 100, y: 100, size: 14, font: fontRegular,
    });

    // Output PDF as Base64 to send to client
    const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

    res.json({ pdfUrl: pdfBytes });
  } catch (error) {
    console.error('Certificate Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
};

// Public: Verify a Certificate by its unique ID
export const verifyCertificate = async (req: any, res: Response): Promise<void> => {
  try {
    const { certId } = req.params;

    const cert = await prisma.certificate.findUnique({
      where: { id: certId },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, description: true } }
      }
    });

    if (!cert) {
      res.status(404).json({ valid: false, message: 'Certificate not found or invalid' });
      return;
    }

    res.json({
      valid: true,
      certificateId: cert.id,
      studentName: cert.user.name,
      courseTitle: cert.course.title,
      issueDate: cert.issueDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying certificate' });
  }
};

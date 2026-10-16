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

    // 2. Strict Verification: Check that ALL lessons have been completed (Bug 3)
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } }
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: studentId,
        completed: true,
        lesson: { module: { courseId } }
      }
    });

    if (totalLessons === 0 || completedLessons < totalLessons) {
      // If enrollment status was mistakenly marked COMPLETED, revert to ACTIVE
      if (enrollment.status === 'COMPLETED') {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'ACTIVE' }
        });
      }

      res.status(403).json({
        message: `Course incomplete. You have completed ${completedLessons} of ${totalLessons} lessons. Complete all lessons and checkpoint quizzes to earn your certificate!`,
        completedLessons,
        totalLessons,
        isCompleted: false
      });
      return;
    }

    // Update enrollment status to COMPLETED if not already set
    if (enrollment.status !== 'COMPLETED') {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: 'COMPLETED' }
      });
    }

    // 3. Check if certificate already exists in DB
    let certificate = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId: studentId, courseId } }
    });

    if (!certificate) {
      certificate = await prisma.certificate.create({
        data: { userId: studentId, courseId }
      });
    }

    // 4. Generate Joyful & Professional PDF Certificate (Bug 8)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Standard A4 Landscape
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const { width, height } = page.getSize();

    // Elegant & Joyful Palette
    const deepNavy = rgb(0.06, 0.12, 0.28);     // #0F1F47 Deep Academic Navy
    const primaryBlue = rgb(0.18, 0.38, 0.93);  // #2E61ED KLZ Brand Royal Blue
    const richGold = rgb(0.85, 0.65, 0.13);     // #D9A621 Regal Gold
    const warmGold = rgb(0.96, 0.77, 0.22);     // #F5C438 Sun Gold
    const softCream = rgb(0.995, 0.992, 0.98);  // Parchment Ivory
    const slateDark = rgb(0.2, 0.25, 0.32);     // Slate 700
    const slateLight = rgb(0.48, 0.53, 0.60);   // Slate 500

    // Canvas Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: softCream,
    });

    // Outer Navy Border
    page.drawRectangle({
      x: 18,
      y: 18,
      width: width - 36,
      height: height - 36,
      borderColor: deepNavy,
      borderWidth: 5,
    });

    // Inner Radiant Gold Border
    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: richGold,
      borderWidth: 1.5,
    });

    // Thin Accent Pinstripe Border
    page.drawRectangle({
      x: 34,
      y: 34,
      width: width - 68,
      height: height - 68,
      borderColor: primaryBlue,
      borderWidth: 0.5,
    });

    // Corner Geometric Flourishes
    const cornerSize = 16;
    const corners = [
      { x: 26, y: height - 44 },
      { x: width - 42, y: height - 44 },
      { x: 26, y: 28 },
      { x: width - 42, y: 28 },
    ];
    corners.forEach(c => {
      page.drawRectangle({
        x: c.x,
        y: c.y,
        width: cornerSize,
        height: cornerSize,
        color: richGold,
      });
      page.drawRectangle({
        x: c.x + 3,
        y: c.y + 3,
        width: cornerSize - 6,
        height: cornerSize - 6,
        color: deepNavy,
      });
    });

    // Centered text helper
    const drawCenteredText = (text: string, y: number, size: number, font: any, color: any) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size,
        font,
        color,
      });
    };

    // Header Branding
    drawCenteredText('K L Z   A C A D E M Y', height - 74, 15, fontBold, primaryBlue);
    drawCenteredText('CERTIFICATE OF ACADEMIC EXCELLENCE', height - 108, 25, fontBold, deepNavy);
    drawCenteredText('HONOR ROLL & PROFESSIONAL MASTERY DISTINCTION', height - 128, 10, fontBold, richGold);

    // Decorative Header Divider
    const dividerHalfWidth = 150;
    page.drawLine({
      start: { x: width / 2 - dividerHalfWidth, y: height - 138 },
      end: { x: width / 2 + dividerHalfWidth, y: height - 138 },
      thickness: 1.5,
      color: richGold,
    });
    // Center diamond accent on divider
    page.drawSquare({
      x: width / 2 - 4,
      y: height - 142,
      size: 8,
      color: warmGold,
    });

    // Presentation Subtitle
    drawCenteredText('This certificate is joyfully and officially awarded to', height - 176, 13, fontOblique, slateLight);

    // Dynamic Student Name
    const rawStudentName = enrollment.student.name || 'Valued Scholar';
    const studentName = rawStudentName.toUpperCase();
    let nameSize = 28;
    if (fontBold.widthOfTextAtSize(studentName, nameSize) > (width - 180)) {
      nameSize = 22;
    }
    drawCenteredText(studentName, height - 218, nameSize, fontBold, deepNavy);

    // Underline beneath Student Name
    const nameWidth = fontBold.widthOfTextAtSize(studentName, nameSize);
    page.drawLine({
      start: { x: (width - nameWidth) / 2 - 25, y: height - 228 },
      end: { x: (width + nameWidth) / 2 + 25, y: height - 228 },
      thickness: 1,
      color: richGold,
    });

    // Achievement Statement
    drawCenteredText(
      'for extraordinary dedication, completing 100% of coursework, practical labs, and checkpoints in',
      height - 268,
      12,
      fontRegular,
      slateDark
    );

    // Dynamic Course Title
    const courseTitle = `"${enrollment.course.title}"`;
    let titleSize = 22;
    if (fontBold.widthOfTextAtSize(courseTitle, titleSize) > (width - 160)) {
      titleSize = 18;
    }
    if (fontBold.widthOfTextAtSize(courseTitle, titleSize) > (width - 160)) {
      titleSize = 14;
    }
    drawCenteredText(courseTitle, height - 308, titleSize, fontBold, primaryBlue);

    // Golden Rosette / Honor Seal (Centered in bottom quadrant)
    const sealX = width / 2;
    const sealY = 118;

    // Outer Radiant Gold Ring
    page.drawCircle({
      x: sealX,
      y: sealY,
      size: 40,
      borderColor: richGold,
      borderWidth: 2.5,
      color: rgb(0.99, 0.95, 0.84),
    });
    // Inner Navy Ring
    page.drawCircle({
      x: sealX,
      y: sealY,
      size: 33,
      borderColor: deepNavy,
      borderWidth: 1.2,
    });

    // Seal Text
    const starText = '★ VERIFIED ★';
    const starWidth = fontBold.widthOfTextAtSize(starText, 8);
    page.drawText(starText, {
      x: sealX - starWidth / 2,
      y: sealY + 5,
      size: 8,
      font: fontBold,
      color: deepNavy,
    });
    const masteryText = 'EXCELLENCE';
    const masteryWidth = fontBold.widthOfTextAtSize(masteryText, 6.5);
    page.drawText(masteryText, {
      x: sealX - masteryWidth / 2,
      y: sealY - 7,
      size: 6.5,
      font: fontBold,
      color: richGold,
    });

    // Left Footer: Issue Details & Credential ID
    const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    page.drawText(`Date of Award: ${formattedDate}`, {
      x: 64,
      y: 128,
      size: 11,
      font: fontBold,
      color: slateDark,
    });
    page.drawText(`Certificate ID: ${certificate.id}`, {
      x: 64,
      y: 111,
      size: 9,
      font: fontRegular,
      color: slateLight,
    });
    page.drawText('Status: Verified Authentic Credential', {
      x: 64,
      y: 95,
      size: 9,
      font: fontBold,
      color: richGold,
    });

    // Right Footer: Signatory Block
    page.drawLine({
      start: { x: width - 264, y: 132 },
      end: { x: width - 64, y: 132 },
      thickness: 1,
      color: slateDark,
    });
    page.drawText('Academic Board & Instructors', {
      x: width - 244,
      y: 114,
      size: 10,
      font: fontBold,
      color: deepNavy,
    });
    page.drawText('KLZ Academy Learning Council', {
      x: width - 239,
      y: 99,
      size: 8,
      font: fontRegular,
      color: slateLight,
    });

    // Bottom Public Verification URL
    const verifyNote = `Verify authenticity online at: http://84.235.239.86/verify/${certificate.id}`;
    drawCenteredText(verifyNote, 44, 8.5, fontRegular, slateLight);

    // Output Base64 Data URI
    const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

    res.json({
      pdfUrl: pdfBytes,
      certificateId: certificate.id,
      issueDate: certificate.issueDate
    });
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

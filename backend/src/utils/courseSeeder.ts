import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';

export async function seedTourCourse(customPrisma?: PrismaClient) {
  const db = customPrisma || prisma;

  const courseTitle = 'Welcome to KLZ Academy: Platform Tour & Mastery Guide';

  // 1. Check if course already exists
  const existingCourse = await db.course.findFirst({
    where: { title: courseTitle },
    include: {
      modules: {
        include: { lessons: true, quizzes: true }
      }
    }
  });

  if (existingCourse && existingCourse.modules.length > 0) {
    console.log(`[CourseSeeder] Course "${courseTitle}" already exists with ${existingCourse.modules.length} modules.`);
    return existingCourse;
  }

  // 2. Resolve Instructor
  let instructor = await db.user.findFirst({
    where: {
      OR: [
        { role: Role.INSTRUCTOR },
        { role: Role.ADMIN },
      ],
    },
  });

  if (!instructor) {
    console.log('[CourseSeeder] No existing instructor found. Creating official KLZ Academy Instructor...');
    const passwordHash = await bcrypt.hash('KlzAcademy2026!', 10);
    instructor = await db.user.create({
      data: {
        name: 'KLZ Academy Team',
        email: 'team@klzacademy.com',
        passwordHash,
        role: Role.INSTRUCTOR,
        bio: 'Official instructional team and platform architects at KLZ Academy.',
      },
    });
  }

  // 3. Define Modules, Lessons, and Quizzes
  const modulesData = [
    {
      title: 'Platform Overview & Course Discovery',
      order: 1,
      lessons: [
        {
          title: 'Welcome to KLZ Academy: Platform Overview & Architecture',
          order: 1,
          content: `Welcome to KLZ Academy! 🎓

KLZ Academy is a modern, production-grade interactive learning platform inspired by leading academic portals like Coursera and DeepLearning.AI. Whether you are here to advance your software engineering skills, dive into data science, or prepare for cloud and cybersecurity certifications, KLZ Academy provides a structured, hands-on environment.

Key Platform Highlights:
• Top Navigation Bar: Seamlessly switch between the Course Catalog, "My Learning" Student Hub, and your account settings.
• Responsive Design: Optimized for seamless studying across mobile phones, tablets, and high-resolution desktop displays.
• Role-Based Access: Dedicated portals for both curious learners (Students) and content creators (Instructors & Admins).
• Verifiable Achievements: Real-time progress tracking, checkpoint assessments, and cryptographically verifiable PDF certificates of completion.

Take a moment to explore the top header. You can click on the KLZ Academy logo at any time to return to the catalog homepage.`,
        },
        {
          title: 'Mastering the Catalog: Search, Filters & Wishlist',
          order: 2,
          content: `Finding the right course on KLZ Academy is fast and intuitive.

Here is how to get the most out of the Course Catalog:

1. Real-Time Search Bar
Located prominently in the hero section of the homepage, the search input allows you to search across course titles, topics, and instructor names with instant debounced results.

2. Category Filtering Tabs
Quickly filter the catalog by your domain of interest:
• Development: Modern web frameworks, APIs, and backend architectures.
• Data Science: Machine learning, analytics, and AI engineering.
• Business: Product management, leadership, and entrepreneurship.
• Design: UI/UX, design systems, and responsive styling.
• Cybersecurity: Application security, network defense, and compliance.

3. Price Toggle (All, Free Only, Paid)
Looking for complimentary tutorials? Toggle the "Free Only" filter to view zero-cost programs like this onboarding guide. Paid courses feature transparent pricing and one-click Stripe checkout.

4. Saved Wishlist
Found a course you would like to take in the future? Click the heart icon on any course card to bookmark it to your personal Wishlist, accessible anytime from your Student Dashboard.`,
        },
        {
          title: '[Quiz] Catalog & Search Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'How can you instantly view only courses that require no payment on the KLZ Academy catalog?',
            correct: 'Select the "Free Only" filter toggle on the catalog page',
            wrong: 'Send an email to support asking for free access'
          })}`,
          quizInfo: {
            title: 'Catalog & Discovery Quiz',
            question: 'How can you instantly view only courses that require no payment on the KLZ Academy catalog?',
            correct: 'Select the "Free Only" filter toggle on the catalog page',
            wrong: 'Send an email to support asking for free access'
          }
        }
      ]
    },
    {
      title: 'The Interactive Classroom Experience',
      order: 2,
      lessons: [
        {
          title: 'Classroom Layout, Video Player & Reading Labs',
          order: 1,
          content: `Welcome to the KLZ Academy Interactive Classroom (/courses/[id]/learn)!

The classroom has been meticulously designed for focused, distraction-free study.

Key Classroom Areas:
1. Collapsible Curriculum Sidebar (Left):
• Displays all course modules and their sequential lessons.
• Automatically displays checkmarks beside lessons you have completed.
• On mobile devices, click the menu toggle icon to open or close the syllabus.

2. Dynamic Content Area (Center):
• Video Lectures: If a lesson features video content, an embedded high-definition player will load with controls for speed adjustment, seeking, and full-screen viewing.
• Reading Labs: In-depth technical guides, code snippets, and architecture diagrams formatted for crisp readability.
• Checkpoint Assessments: Embedded quizzes that test your understanding before you proceed.

3. Top Navigation:
• Click the "← Back to Dashboard" link at any time to return to your enrolled courses overview.`,
        },
        {
          title: 'Tracking Progress, Checkmarks & Lesson Discussions',
          order: 2,
          content: `Maintaining momentum is key to mastering new skills. KLZ Academy makes it effortless to monitor your progress.

How Lesson Completion Works:
• Reading Labs: Review the material thoroughly, then click the blue "Mark as Complete" button at the bottom of the page.
• Video Lectures: The lesson is automatically recorded as completed as soon as you finish watching the video stream.
• Quizzes: Answering a checkpoint quiz correctly immediately marks that assessment as passed and completed.
• Sidebar Checkmarks: Completed lessons display a vibrant green checkmark icon in the curriculum list, while pending lessons show an outline circle.

Lesson Q&A & Discussion:
Stuck on a tricky concept or want to share insight? Every lesson includes an active Q&A discussion board at the bottom of the classroom:
• Post questions directly to the instructor and fellow peers.
• View real-time community responses and tips.
• Collaborate and grow together as a cohort!`,
        },
        {
          title: '[Quiz] Classroom Navigation & Progress Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'What visual indicator appears in the classroom sidebar when you successfully finish a lesson or checkpoint?',
            correct: 'A green checkmark icon next to the lesson title',
            wrong: 'A red lock icon indicating the lesson is closed'
          })}`,
          quizInfo: {
            title: 'Classroom Navigation Quiz',
            question: 'What visual indicator appears in the classroom sidebar when you successfully finish a lesson or checkpoint?',
            correct: 'A green checkmark icon next to the lesson title',
            wrong: 'A red lock icon indicating the lesson is closed'
          }
        }
      ]
    },
    {
      title: 'Student Hub, Profile & Verifiable Certificates',
      order: 3,
      lessons: [
        {
          title: 'Student Learning Hub: Enrolled Courses & Wishlist',
          order: 1,
          content: `Your central base of operations on KLZ Academy is the Student Learning Hub (/dashboard).

Key Features of the Student Hub:
1. "My Enrolled Courses" Tab:
• View all programs you have joined.
• Track your calculated completion percentage per course.
• Click "Continue Learning" to resume directly from where you left off.

2. "Saved Wishlist" Tab:
• Browse bookmarked programs that you saved while exploring the catalog.
• Jump straight into course syllabi and enroll when you are ready.
• Easily remove courses from your wishlist with the delete button.

3. Quick Profile Access:
• The top header includes a direct shortcut to your Public Profile & Certificates trophy case.`,
        },
        {
          title: 'Profile Customization & Dynamic Verifiable PDF Certificates',
          order: 2,
          content: `Celebrate your achievements and share your credentials with the world!

1. Customizing Your Public Profile (/dashboard/profile):
• Update your display name, professional headline, and biographical summary.
• Upload a custom avatar photo to personalize your presence in the course discussion boards.

2. Generating Dynamic Certificates:
• As soon as you complete 100% of the lessons and pass the checkpoint assessments in an enrolled course, you unlock the official KLZ Academy Certificate of Completion.
• Generated on the fly with cryptographic precision using pdf-lib, your certificate includes your full name, the course title, completion date, and official KLZ Academy styling.
• Download high-resolution PDF copies directly to your device for LinkedIn or your portfolio.

3. Public Verification Link (/verify/[certId]):
• Every certificate is minted with a unique identifier.
• Employers, clients, and academic institutions can verify your credentials online without needing an account.`,
        },
        {
          title: '[Quiz] Dashboard & Certificate Verification Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'Where can you update your student profile bio and download your earned certificates?',
            correct: 'Under the "Public Profile & Certificates" page (/dashboard/profile)',
            wrong: 'In the course catalog search bar'
          })}`,
          quizInfo: {
            title: 'Dashboard & Certificates Quiz',
            question: 'Where can you update your student profile bio and download your earned certificates?',
            correct: 'Under the "Public Profile & Certificates" page (/dashboard/profile)',
            wrong: 'In the course catalog search bar'
          }
        }
      ]
    },
    {
      title: 'Community Feedback & Instructor Studio',
      order: 4,
      lessons: [
        {
          title: 'Submitting Course Reviews & Leaving Star Ratings',
          order: 1,
          content: `Peer feedback fuels high quality education on KLZ Academy!

How Student Reviews Work:
• Once enrolled in a course, visit the Course Details page (/courses/[id]) to submit your review.
• Choose a rating from 1 to 5 stars to reflect your satisfaction with the curriculum, pacing, and clarity.
• Write an honest, constructive review detailing the skills you gained and tips for future students.
• Reviews immediately update the course's public average rating and review counter on the catalog grid, helping fellow learners choose the best courses.`,
        },
        {
          title: 'Instructor Portal, Course Wizard & Analytics',
          order: 2,
          content: `KLZ Academy is also an authoring platform for subject matter experts!

If you are an Instructor or Administrator, you have access to the Instructor Studio:

1. Instructor Dashboard (/admin/dashboard):
• Overview of all courses you have authored.
• Real-time count of active student enrollments.

2. Course Creation Wizard (/admin/courses/new):
• Publish a new course in minutes: specify the title, description, category, price, and initial syllabus.

3. Curriculum & Syllabus Builder (/admin/courses/[id]/edit):
• Add sequential modules (e.g., Week 1, Week 2).
• Add Video lectures (with URL streaming) or rich text Reading Labs.
• Create interactive Checkpoint Quizzes with correct and incorrect answer choices.

4. Instructor Analytics (/admin/analytics):
• View detailed enrollment trends, average review metrics, and student engagement across your published programs.`,
        },
        {
          title: '[Quiz] Community & Instructor Studio Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'Which interface allows course instructors to build modules, add lessons, and configure multiple-choice quizzes?',
            correct: 'The Curriculum & Syllabus Builder (/admin/courses/[id]/edit)',
            wrong: 'The student login page'
          })}`,
          quizInfo: {
            title: 'Community & Instructor Studio Quiz',
            question: 'Which interface allows course instructors to build modules, add lessons, and configure multiple-choice quizzes?',
            correct: 'The Curriculum & Syllabus Builder (/admin/courses/[id]/edit)',
            wrong: 'The student login page'
          }
        }
      ]
    }
  ];

  const fullSyllabus = `Module 1: Platform Overview & Course Discovery
- Welcome to KLZ Academy: Platform Overview & Architecture
- Mastering the Catalog: Search, Filters & Wishlist
- [Quiz] Catalog & Search Checkpoint

Module 2: The Interactive Classroom Experience
- Classroom Layout, Video Player & Reading Labs
- Tracking Progress, Checkmarks & Lesson Discussions
- [Quiz] Classroom Navigation & Progress Checkpoint

Module 3: Student Hub, Profile & Verifiable Certificates
- Student Learning Hub: Enrolled Courses & Wishlist
- Profile Customization & Dynamic Verifiable PDF Certificates
- [Quiz] Dashboard & Certificate Verification Checkpoint

Module 4: Community Feedback & Instructor Studio
- Submitting Course Reviews & Leaving Star Ratings
- Instructor Portal, Course Wizard & Analytics
- [Quiz] Community & Instructor Studio Checkpoint`;

  // 4. Create the Course
  console.log(`[CourseSeeder] Creating "${courseTitle}"...`);

  let createdCourse;
  if (existingCourse) {
    createdCourse = existingCourse;
  } else {
    createdCourse = await db.course.create({
      data: {
        title: courseTitle,
        description: 'A comprehensive, hands-on onboarding course to help you navigate KLZ Academy, discover courses, master the interactive classroom, track your learning progress, earn verifiable certificates, and engage with the student community.',
        syllabus: fullSyllabus,
        price: 0.0, // 100% Free course
        category: 'Development',
        instructorId: instructor.id,
      }
    });
  }

  // 5. Populate Modules, Lessons, and Quizzes
  for (const modData of modulesData) {
    const newModule = await db.module.create({
      data: {
        title: modData.title,
        order: modData.order,
        courseId: createdCourse.id,
      }
    });

    for (const lessonData of modData.lessons) {
      await db.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          moduleId: newModule.id,
        }
      });

      // Also create relational Quiz record if quizInfo is present
      if (lessonData.quizInfo) {
        const quizRecord = await db.quiz.create({
          data: {
            title: lessonData.quizInfo.title,
            moduleId: newModule.id,
          }
        });

        const questionRecord = await db.question.create({
          data: {
            text: lessonData.quizInfo.question,
            quizId: quizRecord.id,
          }
        });

        await db.option.createMany({
          data: [
            { text: lessonData.quizInfo.correct, isCorrect: true, questionId: questionRecord.id },
            { text: lessonData.quizInfo.wrong, isCorrect: false, questionId: questionRecord.id },
          ]
        });
      }
    }
  }

  console.log(`[CourseSeeder] Successfully seeded "${courseTitle}" with ${modulesData.length} modules!`);
  return createdCourse;
}

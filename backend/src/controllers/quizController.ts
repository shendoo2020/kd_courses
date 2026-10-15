import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of optionIds selected by user
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    // Calculate score
    quiz.questions.forEach((question) => {
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && answers.includes(correctOption.id)) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= 80; // Hardcoded passing grade of 80%

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: studentId,
        quizId,
        score,
        passed
      }
    });

    res.json({ score, passed, attemptId: attempt.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

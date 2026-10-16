import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';

export async function seedPromptCourse(customPrisma?: PrismaClient) {
  const db = customPrisma || prisma;

  const courseTitle = 'Prompt Engineering Masterclass: From Beginner to AI Whisperer';

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
    console.log(`[PromptCourseSeeder] Course "${courseTitle}" already exists with ${existingCourse.modules.length} modules.`);
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
    console.log('[PromptCourseSeeder] Creating instructor for Prompt Engineering...');
    const passwordHash = await bcrypt.hash('KlzAcademy2026!', 10);
    instructor = await db.user.create({
      data: {
        name: 'Dr. Alex Vance',
        email: 'alex.vance@klzacademy.com',
        passwordHash,
        role: Role.INSTRUCTOR,
        bio: 'AI Researcher and Lead Prompt Engineer specializing in LLM alignment and agent architectures.',
      },
    });
  }

  // 3. Define Modules, Lessons, and Quizzes
  const modulesData = [
    {
      title: 'Module 1: Foundations of Prompt Engineering',
      order: 1,
      lessons: [
        {
          title: 'What is Prompt Engineering & How LLMs Work',
          order: 1,
          content: `Welcome to the Prompt Engineering Masterclass! 🤖

Large Language Models (LLMs) such as GPT-4, Claude 3.5 Sonnet, and Google Gemini do not truly "think" the way humans do. Instead, they are hyper-advanced probabilistic sequence predictors. When you provide text input, the model analyzes the tokens and calculates the most statistically likely sequence of next tokens based on billions of parameters.

### Why Phrasing Matters
Because models predict based on pattern completion:
• A vague question yields a generic, surface-level answer.
• A precise, well-contextualized prompt activates specific subspaces of the model's training knowledge, yielding expert-level insights.

### Key Vocabulary:
1. Tokens: The fundamental chunks of characters that language models read and write (e.g., roughly 4 characters or 0.75 words per token).
2. Context Window: The maximum total tokens (input prompt + output generation) the model can hold in its working memory at one time.
3. Hallucination: When a model confidently asserts false or fabricated facts due to probabilistic completion without factual grounding.

Prompt engineering is the craft of structuring natural language instructions to reliably minimize hallucinations and maximize accuracy, creativity, and analytical depth.`,
        },
        {
          title: 'The Anatomy of a High-Impact Prompt (C.I.C.O. Framework)',
          order: 2,
          content: `To build consistent, high-yield prompts, professional AI engineers rely on structured frameworks. One of the most effective mental models is the **C.I.C.O. Framework**:

1. Context (Where does this take place?)
• Provide background information, audience context, and constraints.
• Example: "We are building an e-commerce platform using Next.js 14 App Router and TypeScript. Our target audience is non-technical shoppers."

2. Instruction (What is the primary action?)
• Use direct action verbs (Explain, Refactor, Analyze, Draft, Summarize).
• Avoid ambiguous phrasing like "Can you maybe talk about X?". Instead use "Generate a step-by-step implementation guide for X."

3. Constraints (What must the AI avoid or adhere to?)
• Set explicit boundaries to reduce fluff and enforce tone.
• Example: "Do not use third-party UI libraries. Write pure Tailwind CSS. Keep total response under 300 words. Never output placeholder comments."

4. Output Format (How should the response be delivered?)
• Dictate the exact structure (JSON schema, markdown table, bullet points, bash script).
• Example: "Return the result as a strict JSON array of objects with keys: { 'id', 'name', 'severity' }."

When you assemble these four pillars together, you transform a mediocre prompt into a deterministic instruction engine.`,
        },
        {
          title: '[Quiz] Prompt Engineering Foundations Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'According to the C.I.C.O. Framework, which element specifies boundaries such as word counts, forbidden libraries, or formatting restrictions?',
            correct: 'Constraints',
            wrong: 'Context'
          })}`,
          quizInfo: {
            title: 'Prompt Foundations Checkpoint',
            question: 'According to the C.I.C.O. Framework, which element specifies boundaries such as word counts, forbidden libraries, or formatting restrictions?',
            correct: 'Constraints',
            wrong: 'Context'
          }
        }
      ]
    },
    {
      title: 'Module 2: Core Prompting Paradigms',
      order: 2,
      lessons: [
        {
          title: 'Zero-Shot vs. Few-Shot In-Context Learning',
          order: 1,
          content: `One of the most powerful discoveries in modern AI is **In-Context Learning**: the model's ability to learn new tasks on the fly simply by observing examples provided inside the prompt itself.

### 1. Zero-Shot Prompting
In Zero-Shot prompting, you present the model with a task description and zero demonstrations.
*Example:*
"Classify the sentiment of the following customer review as Positive, Neutral, or Negative:
Review: The shipping was fast, but the zipper broke after two days."

Zero-shot is ideal for everyday tasks, simple classifications, and general inquiries where the task is standard.

### 2. Few-Shot Prompting
In Few-Shot prompting, you provide 2 to 5 representative input-output pairs before giving the actual query. This establishes the exact pattern, nuance, tone, and formatting.
*Example:*
"Classify the customer review into Sentiment and Action Item:

Review: 'Loved the food, but the waiter was rude.'
Output: { sentiment: 'Mixed', department: 'Service' }

Review: 'App crashed when I clicked checkout.'
Output: { sentiment: 'Negative', department: 'Mobile Engineering' }

Review: 'Great discounts on winter jackets!'
Output: { sentiment: 'Positive', department: 'Marketing' }

Review: 'Battery drains within 2 hours of light usage.'
Output:"

Notice how the model immediately adheres to the exact JSON structure and categorization domain established by your examples without requiring fine-tuning!`,
        },
        {
          title: 'Chain-of-Thought (CoT) & Step-by-Step Reasoning',
          order: 2,
          content: `Language models often struggle with multi-step math, symbolic logic, or complex software architecture when asked to give the final answer immediately. Why? Because without generating intermediate steps, the model only has one forward pass of attention to calculate the solution.

### Chain-of-Thought (CoT) Prompting
Chain-of-Thought prompting directs the model to explicitly verbalize its intermediate reasoning steps before arriving at a final answer.

### The Magic Phrase: "Think Step-by-Step"
Pioneered by Google Brain researchers in 2022, appending "Let's think step by step" or giving explicit instructions to break down the problem into logical phases dramatically increases accuracy on complex tasks:
• Reduces mathematical errors by over 40%.
• Catches edge cases in software algorithms.
• Prevents impulsive hallucinations.

### Best Practice Example:
Instead of asking:
"What is the total price if Alice buys 3 books at $14 with a 15% discount and 8% sales tax?"

Use CoT:
"Solve this problem by following these steps:
1. Calculate the subtotal of the items.
2. Apply the discount and show the discounted subtotal.
3. Compute the exact tax on the discounted subtotal.
4. Add tax to produce the final total.
State the final amount on its own line: Final: $[amount]."`,
        },
        {
          title: '[Quiz] In-Context Learning Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'Why does Chain-of-Thought (CoT) prompting drastically improve LLM performance on complex logic and mathematics?',
            correct: 'It allows the model to produce intermediate reasoning tokens, giving it more compute cycles to reach the correct answer',
            wrong: 'It increases the temperature parameter to maximize randomness'
          })}`,
          quizInfo: {
            title: 'In-Context Learning Checkpoint',
            question: 'Why does Chain-of-Thought (CoT) prompting drastically improve LLM performance on complex logic and mathematics?',
            correct: 'It allows the model to produce intermediate reasoning tokens, giving it more compute cycles to reach the correct answer',
            wrong: 'It increases the temperature parameter to maximize randomness'
          }
        }
      ]
    },
    {
      title: 'Module 3: Advanced Architectures & Production Prompting',
      order: 3,
      lessons: [
        {
          title: 'Role-Playing, Personas & System Prompt Engineering',
          order: 1,
          content: `In modern API architectures (OpenAI, Anthropic Claude, Gemini), messages are split into distinct tiers:
• **System Prompt:** Sets the permanent character, meta-instructions, security guardrails, and role of the assistant.
• **User Prompt:** The end-user's task, question, or request.

### The Power of Role Framing
Assigning a specialized persona primes the model's latent space to retrieve domain-specific vocabulary and best practices.

Compare these two prompts:
1. Generic: "Check this Python code for bugs."
2. Persona Framed: "You are a Principal Security Engineer specializing in OWASP Top 10 vulnerabilities and high-concurrency microservices. Conduct a rigorous static analysis code review on the following snippet. Highlight memory leaks, race conditions, and unauthenticated endpoints."

The second prompt triggers a much more rigorous, defensive, and production-ready analysis.

### Boundary Delimiters & XML Tags
To prevent "prompt injection" (where malicious user data confuses the AI's instructions), use explicit delimiters such as triple backticks or XML tags:
\`\`\`xml
<system_instructions>
Summarize the text below in 3 bullet points.
</system_instructions>

<untrusted_document>
\${userText}
</untrusted_document>
\`\`\`
This creates an unmistakable boundary between your code instructions and external dynamic data.`,
        },
        {
          title: 'Self-Consistency, Directional Stimulus & Meta-Prompting',
          order: 2,
          content: `As you advance to production-grade AI pipelines and multi-agent workflows, you will combine multiple prompting strategies:

### 1. Self-Consistency (Ensemble Reasoning)
Sample multiple Chain-of-Thought completions from the model at a higher temperature (e.g. temperature=0.7), and select the majority consensus answer across the runs. This is exceptionally effective for medical diagnosis, financial calculations, and mission-critical classification.

### 2. Meta-Prompting (Prompt the AI to Write Prompts)
One of the most underutilized techniques is asking the model to refine your own prompts:
"I want to accomplish [Goal X]. Act as an expert prompt engineer. Analyze my draft prompt below, identify ambiguities or missing constraints, and provide an optimized revision."

### 3. Summary of Gold Standards:
• Be specific and direct.
• Use structured delimiters (<context>, <data>, <output>).
• Provide positive instructions ("Do X") rather than only negative constraints ("Don't do Y").
• Include few-shot examples for non-trivial formats.
• Guide the reasoning path with Chain-of-Thought prompts.

Congratulations on completing the curriculum! Complete the final checkpoint quiz below to verify your mastery and earn your official Certificate of Completion! 🎓`,
        },
        {
          title: '[Quiz] Production Prompting Checkpoint',
          order: 3,
          content: `QUIZ_DATA:::${JSON.stringify({
            question: 'What is the recommended best practice for safely separating system instructions from untrusted user inputs to prevent prompt injection?',
            correct: 'Use clear structural delimiters or XML tags like <system_instructions> and <user_data>',
            wrong: 'Mix instructions and user data freely in a single unquoted paragraph'
          })}`,
          quizInfo: {
            title: 'Production Prompting Checkpoint',
            question: 'What is the recommended best practice for safely separating system instructions from untrusted user inputs to prevent prompt injection?',
            correct: 'Use clear structural delimiters or XML tags like <system_instructions> and <user_data>',
            wrong: 'Mix instructions and user data freely in a single unquoted paragraph'
          }
        }
      ]
    }
  ];

  const fullSyllabus = `Module 1: Foundations of Prompt Engineering
- What is Prompt Engineering & How LLMs Work
- The Anatomy of a High-Impact Prompt (C.I.C.O. Framework)
- [Quiz] Prompt Engineering Foundations Checkpoint

Module 2: Core Prompting Paradigms
- Zero-Shot vs. Few-Shot In-Context Learning
- Chain-of-Thought (CoT) & Step-by-Step Reasoning
- [Quiz] In-Context Learning Checkpoint

Module 3: Advanced Architectures & Production Prompting
- Role-Playing, Personas & System Prompt Engineering
- Self-Consistency, Directional Stimulus & Meta-Prompting
- [Quiz] Production Prompting Checkpoint`;

  // 4. Create Course
  console.log(`[PromptCourseSeeder] Creating course: "${courseTitle}"...`);
  const course = await db.course.create({
    data: {
      title: courseTitle,
      description: 'Master the art and science of communicating effectively with Large Language Models. Learn the C.I.C.O. framework, zero-shot and few-shot in-context learning, Chain-of-Thought reasoning, system prompts, delimiters, and production-grade prompt security.',
      syllabus: fullSyllabus,
      price: 0.00,
      category: 'Data Science',
      instructorId: instructor.id,
    },
  });

  // 5. Populate Modules, Lessons, and Quizzes
  for (const modData of modulesData) {
    const module = await db.module.create({
      data: {
        title: modData.title,
        order: modData.order,
        courseId: course.id,
      },
    });

    for (const lesData of modData.lessons) {
      const lesson = await db.lesson.create({
        data: {
          title: lesData.title,
          content: lesData.content,
          order: lesData.order,
          moduleId: module.id,
        },
      });

      // If lesson contains quizInfo, create relational Quiz entities
      if (lesData.quizInfo) {
        const quiz = await db.quiz.create({
          data: {
            title: lesData.quizInfo.title,
            moduleId: module.id,
          },
        });

        const question = await db.question.create({
          data: {
            text: lesData.quizInfo.question,
            quizId: quiz.id,
          },
        });

        await db.option.createMany({
          data: [
            { text: lesData.quizInfo.correct, isCorrect: true, questionId: question.id },
            { text: lesData.quizInfo.wrong, isCorrect: false, questionId: question.id },
          ],
        });
      }
    }
  }

  console.log(`[PromptCourseSeeder] Successfully seeded "${courseTitle}" with ${modulesData.length} modules!`);
  return course;
}

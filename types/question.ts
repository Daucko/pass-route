// Shared TypeScript types for questions

export interface Question {
  id: string;
  subject: string;
  text: string;
  options: QuestionOption[];
  year?: number;
  examType?: string;
}

export interface QuestionOption {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
  correct: boolean;
}

// Database question format (from Prisma)
export interface DBQuestion {
  id: string;
  subject: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string; // 'a', 'b', 'c', 'd'
  year: number | null;
  examType: string | null;
  createdAt: Date;
}

// Transform database question to frontend format
export function transformQuestion(dbQuestion: DBQuestion): Question {
  return {
    id: dbQuestion.id,
    subject: dbQuestion.subject,
    text: dbQuestion.questionText,
    options: [
      {
        id: 'a',
        text: dbQuestion.optionA,
        correct: dbQuestion.correctOption === 'a',
      },
      {
        id: 'b',
        text: dbQuestion.optionB,
        correct: dbQuestion.correctOption === 'b',
      },
      {
        id: 'c',
        text: dbQuestion.optionC,
        correct: dbQuestion.correctOption === 'c',
      },
      {
        id: 'd',
        text: dbQuestion.optionD,
        correct: dbQuestion.correctOption === 'd',
      },
    ],
    year: dbQuestion.year ?? undefined,
    examType: dbQuestion.examType ?? undefined,
  };
}

// QBoard API response types
export interface QBoardQuestion {
  id: number;
  question: string;
  option: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string; // 'a', 'b', 'c', or 'd'
  section: string; // subject name
  year?: number;
  examtype?: string;
}

export interface QBoardResponse {
  data: QBoardQuestion | QBoardQuestion[];
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateExplanation } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  let parsedBody: any = null;
  try {
    const body = await request.json();
    parsedBody = body;
    const {
      questionId,
      questionText,
      options,
      correctAnswer,
      subject,
      userLevel,
    } = body;

    if (!questionId || !questionText || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Check cache in database
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        explanation: true,
        explanationImage: true,
        keyConcepts: true,
        commonMistakes: true,
      },
    });

    if (existingQuestion?.explanation) {
      return NextResponse.json({
        explanation: existingQuestion.explanation,
        explanationImage: existingQuestion.explanationImage,
        keyConcepts: existingQuestion.keyConcepts,
        commonMistakes: existingQuestion.commonMistakes,
      });
    }

    // 2. Generate AI explanation
    const aiResponse = await generateExplanation({
      questionId,
      questionText,
      options: options || [],
      correctAnswer,
      subject: subject || 'General',
      userLevel: userLevel || 'Intermediate',
    });

    // 3. Save to database for caching
    await prisma.question.update({
      where: { id: questionId },
      data: {
        explanation: aiResponse.explanation,
        explanationImage: aiResponse.explanationImage,
        keyConcepts: aiResponse.keyConcepts,
        commonMistakes: aiResponse.commonMistakes,
        lastExplainedAt: new Date(),
      },
    });

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error generating explanation:', error);

    // Fallback response
    return NextResponse.json(
      {
        explanation: `
        The correct answer is **${
          parsedBody?.correctAnswer?.toUpperCase() || 'Unknown'
        }**.
        <br/><br/>
        While we're experiencing technical difficulties generating a detailed explanation, 
        this option aligns with the fundamental principles of the subject. 
        Review your textbook or notes for similar examples.
      `,
        explanationImage: '',
        keyConcepts: [],
        commonMistakes: [],
      },
      { status: 500 }
    );
  }
}

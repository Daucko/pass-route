import Groq from 'groq-sdk';

// Initialize Groq client (free tier available)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '', // Optional for some free endpoints
});

export interface ExplanationRequest {
  questionId: string;
  questionText: string;
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
  correctAnswer: string;
  subject?: string;
  userLevel?: string;
}

export interface ExplanationResponse {
  explanation: string;
  explanationImage?: string;
  keyConcepts?: string[];
  commonMistakes?: string[];
  relatedQuestions?: string[];
}

export async function generateExplanation(
  request: ExplanationRequest
): Promise<ExplanationResponse> {
  const {
    questionText,
    options,
    correctAnswer,
    subject = 'General',
    userLevel = 'Intermediate',
  } = request;

  try {
    // Generate text explanation using Groq
    const explanation = await generateTextExplanation({
      questionText,
      options,
      correctAnswer,
      subject,
      userLevel,
    });

    // Generate image using free Pollinations
    const imageUrl = await generateExplanationImage({
      questionText,
      subject,
    });

    // Extract key concepts
    const keyConcepts = await extractKeyConcepts(explanation);

    return {
      explanation,
      explanationImage: imageUrl,
      keyConcepts,
      commonMistakes: generateCommonMistakes(options, correctAnswer),
    };
  } catch (error) {
    console.error('Error generating explanation:', error);
    // Fallback to mock response
    return getMockExplanation(request);
  }
}

console.log('=== AI-SERVICE LOADING ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GROQ_API_KEY exists in ai-service:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length);

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is NOT loaded in ai-service.ts');
  console.log('Available env vars:', Object.keys(process.env).join(', '));
}

interface TextExplanationParams {
  questionText: string;
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
  correctAnswer: string;
  subject: string;
  userLevel: string;
}

async function generateTextExplanation(
  params: TextExplanationParams
): Promise<string> {
  const { questionText, options, correctAnswer, subject, userLevel } = params;

  const systemPrompt = `You are an expert ${subject} tutor with 20 years of experience. Explain why the correct answer is correct in a clear, educational way suitable for a ${userLevel} level student. Break down the reasoning step by step. Use simple language and provide examples if helpful.`;

  const userPrompt = `
QUESTION: ${questionText}

OPTIONS:
${options
      .map(
        (opt) => `${opt.id}. ${opt.text} ${opt.correct ? '(Correct Answer)' : ''}`
      )
      .join('\n')}

CORRECT ANSWER: ${correctAnswer}

Please provide a detailed explanation that:
1. Clearly states why option ${correctAnswer} is correct
2. Explains why each of the other options is incorrect
3. Includes relevant formulas, rules, or concepts
4. Provides step-by-step reasoning
5. Offers tips for solving similar questions
6. Format with <br/> for line breaks and <b> for important terms

Make it SHORT and CONCISE. Avoid lengthy paragraphs. Get straight to the point. Target level: ${userLevel}.
`;

  try {
    // Groq offers free access to certain models like llama-3.2-3b-preview
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Free model from Groq
      // Other free models you can try:
      // - 'llama-3.2-1b-preview' (fastest)
      // - 'llama-3.2-3b-preview' (good balance)
      // - 'gemma2-9b-it' (if available for free)
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
    });

    const explanation = completion.choices[0]?.message?.content || '';

    // Ensure we have valid HTML formatting
    return formatExplanation(explanation, correctAnswer);
  } catch (error) {
    console.error('Groq API error:', error);

    // Try with a simpler model if the first fails
    try {
      const fallbackCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // Simpler model
        messages: [
          { role: 'system', content: 'Explain why the answer is correct.' },
          {
            role: 'user',
            content: `Question: ${questionText}. Correct answer: ${correctAnswer}. Explain briefly.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      const fallbackText =
        fallbackCompletion.choices[0]?.message?.content || '';
      return `<b>Explanation:</b><br/><br/>${fallbackText}`;
    } catch {
      console.error('Fallback also failed');
      throw error;
    }
  }
}

function formatExplanation(text: string, correctAnswer: string): string {
  // Clean up and format the response
  let formatted = text
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>');

  // Ensure it starts with correct answer
  if (!formatted.includes(correctAnswer.toUpperCase())) {
    formatted = `<b>The correct answer is ${correctAnswer.toUpperCase()}.</b><br/><br/>${formatted}`;
  }

  return formatted;
}

interface ImageGenerationParams {
  questionText: string;
  subject: string;
}

async function generateExplanationImage(
  params: ImageGenerationParams
): Promise<string> {
  const { questionText, subject } = params;

  try {
    // Clean up text for image prompt
    const cleanText = questionText
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s.,?]/g, ' ')
      .substring(0, 60)
      .trim();

    // Using Pollinations AI (completely free, no API key needed)
    const prompt = `Educational diagram for ${subject}: ${cleanText}. Clean, simple, textbook style, white background, informative labels, no complex details.`;

    // Pollinations free image generation
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=600&height=400&seed=${Math.floor(
      Math.random() * 1000
    )}&model=flux&nologo=true`;

    return imageUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    // Return a placeholder image
    return `https://placehold.co/600x400/0a0a0f/ffffff?text=${encodeURIComponent(
      subject + ' Diagram'
    )}`;
  }
}

async function extractKeyConcepts(explanation: string): Promise<string[]> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Extract 2-4 key educational concepts. Return ONLY a JSON array: ["concept1", "concept2"]',
        },
        {
          role: 'user',
          content: `From this explanation, list key concepts:\n${explanation.substring(
            0,
            300
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '[]';

    // Try to parse JSON
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 4);
      }
    } catch {
      // If not JSON, extract concepts manually
      return extractConceptsManually(explanation);
    }

    return extractConceptsManually(explanation);
  } catch (error) {
    console.error('Key concepts extraction error:', error);
    return extractConceptsManually(explanation);
  }
}

function extractConceptsManually(text: string): string[] {
  // Simple keyword extraction
  const concepts: string[] = [];

  const conceptKeywords = [
    'formula',
    'theorem',
    'principle',
    'law',
    'rule',
    'concept',
    'method',
    'technique',
    'property',
    'theory',
    'hypothesis',
    'equation',
    'derivative',
    'integral',
    'function',
    'variable',
  ];

  // Find sentences with concept keywords
  const sentences = text.split(/[.!?]+/);
  sentences.forEach((sentence) => {
    conceptKeywords.forEach((keyword) => {
      if (sentence.toLowerCase().includes(keyword) && sentence.length < 100) {
        concepts.push(sentence.trim());
      }
    });
  });

  // Return unique concepts, max 3
  return [...new Set(concepts)].slice(0, 3);
}

function generateCommonMistakes(
  options: Array<{ id: string; text: string; correct: boolean }>,
  correctAnswer: string
): string[] {
  const incorrectOptions = options.filter((opt) => !opt.correct);
  const mistakes: string[] = [];

  incorrectOptions.forEach((opt) => {
    const mistakeReasons = [
      `Misunderstanding the question and choosing ${opt.id}`,
      `Confusing ${opt.id} with the correct answer ${correctAnswer}`,
      `Selecting ${opt.id} due to calculation error`,
      `${opt.id} is a common distractor in this type of question`,
    ];

    mistakes.push(
      mistakeReasons[Math.floor(Math.random() * mistakeReasons.length)]
    );
  });

  return mistakes.slice(0, 3); // Max 3 mistakes
}

function getMockExplanation(request: ExplanationRequest): ExplanationResponse {
  const { correctAnswer, questionText, subject } = request;

  const cleanText = questionText.replace(/<[^>]*>/g, '').substring(0, 50);

  return {
    explanation: `
      <b>The correct answer is ${correctAnswer.toUpperCase()}.</b>
      <br/><br/>
      This option correctly applies the fundamental ${subject} principles involved. 
      When analyzing the question, ${correctAnswer.toUpperCase()} aligns with established rules 
      and provides the most accurate solution.
      <br/><br/>
      <b>Key Insight:</b>
      <br/>
      Always verify each option against the core concepts before selecting an answer. 
      This type of question frequently tests understanding of basic principles.
      <br/><br/>
      <b>Quick Check:</b>
      <br/>
      Review similar examples in your textbook to reinforce this concept.
    `,
    explanationImage: `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `Educational ${subject} diagram: ${cleanText}`
    )}?width=600&height=400`,
    keyConcepts: ['Core Principle', 'Fundamental Rule', 'Basic Application'],
    commonMistakes: [
      'Rushing through the question without careful reading',
      'Confusing similar-looking options',
      'Forgetting to apply basic rules',
    ],
  };
}

// Additional helper function for simple questions
export async function quickExplain(
  question: string,
  answer: string
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `In one sentence, why is this answer correct? Question: ${question}. Answer: ${answer}.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    return (
      completion.choices[0]?.message?.content || 'This is the correct answer.'
    );
  } catch {
    return 'This answer follows the correct principles.';
  }
}

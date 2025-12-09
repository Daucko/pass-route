import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    groqKeyExists: !!process.env.GROQ_API_KEY,
    groqKeyFirstChars: process.env.GROQ_API_KEY?.substring(0, 10) + '...',
    groqKeyLength: process.env.GROQ_API_KEY?.length,
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env)
      .filter((key) => key.includes('GROQ') || key.includes('API'))
      .reduce((acc, key) => {
        acc[key] = process.env[key]?.substring(0, 5) + '...';
        return acc;
      }, {} as Record<string, string>),
    // Check if we're in server context
    isServer: typeof window === 'undefined',
  });
}

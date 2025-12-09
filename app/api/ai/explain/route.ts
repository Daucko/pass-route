import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateExplanation } from '@/lib/ai-service';

console.log('GROQ_API_KEY present:', Boolean(process.env.GROQ_API_KEY));


// Simple in-memory rate limiter
class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 10; // 10 requests per minute per IP

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    // Get existing requests for this IP
    const timestamps = this.requests.get(ip) || [];

    // Filter requests within current window
    const recentRequests = timestamps.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false;
    }

    // Add current request and update storage
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to cleanup
      this.cleanup();
    }

    return true;
  }

  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    for (const [ip, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter((time) => time > windowStart);
      if (recent.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, recent);
      }
    }
  }

  getRemaining(ip: string): number {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;
    const timestamps = this.requests.get(ip) || [];
    const recentRequests = timestamps.filter((time) => time > windowStart);
    return Math.max(0, this.MAX_REQUESTS - recentRequests.length);
  }

  getResetTime(ip: string): number {
    const timestamps = this.requests.get(ip) || [];
    if (timestamps.length === 0) return 0;

    const oldest = Math.min(...timestamps);
    return oldest + this.WINDOW_MS;
  }
}

const rateLimiter = new RateLimiter();

// Helper to get client IP - CORRECTED VERSION
function getClientIP(request: NextRequest): string {
  // Get IP from headers (standard headers used by proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  // Try x-forwarded-for first (comma-separated list of IPs)
  if (forwardedFor) {
    // Get the first IP in the list (client's original IP)
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    return ips[0] || 'unknown';
  }

  // Try x-real-ip
  if (realIp) {
    return realIp;
  }

  // Try cf-connecting-ip (Cloudflare)
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // For development/localhost, use a placeholder
  // In production with multiple servers, you might want to use a session ID
  return 'local-' + Math.random().toString(36).substr(2, 9);
}

export async function POST(request: NextRequest) {
  let parsedBody: any = null;

  // Apply rate limiting
  const clientIP = getClientIP(request);

  if (!rateLimiter.isAllowed(clientIP)) {
    const resetTime = new Date(
      rateLimiter.getResetTime(clientIP)
    ).toISOString();
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(
          (rateLimiter.getResetTime(clientIP) - Date.now()) / 1000
        ),
        resetTime: resetTime,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime,
          'Retry-After': Math.ceil(
            (rateLimiter.getResetTime(clientIP) - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const remaining = rateLimiter.getRemaining(clientIP);
  const resetTime = new Date(rateLimiter.getResetTime(clientIP)).toISOString();

  const headers = {
    'X-RateLimit-Limit': '10',
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime,
  };

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
        { status: 400, headers }
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
      return NextResponse.json(
        {
          explanation: existingQuestion.explanation,
          explanationImage: existingQuestion.explanationImage,
          keyConcepts: existingQuestion.keyConcepts,
          commonMistakes: existingQuestion.commonMistakes,
        },
        { headers }
      );
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

    return NextResponse.json(aiResponse, { headers });
  } catch (error) {
    console.error('Error generating explanation:', error);

    // Fallback response (still include rate limit headers)
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
      { status: 500, headers }
    );
  }
}

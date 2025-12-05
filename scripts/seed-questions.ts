// scripts/seed-questions.ts
// Script to fetch questions from QBoard API and seed the database

import { PrismaClient } from '../app/generated-prisma-client';

const prisma = new PrismaClient();

const QBOARD_API_BASE = 'https://questions.aloc.com.ng/api/v2';
const API_TOKEN = process.env.QBOARD_API_TOKEN;

// Subjects to seed
const SUBJECTS = [
    'mathematics',
    'english',
    'physics',
    'chemistry',
    'biology',
    'commerce',
    'accounting',
    'economics',
    'government',
    'literature',
];

// Exam types
const EXAM_TYPES = ['utme', 'wassce'];

interface QBoardQuestion {
    id: number;
    question: string;
    option: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
    answer: string;
    section: string;
    year?: number;
    examtype?: string;
}

interface QBoardResponse {
    data: QBoardQuestion[];
}

async function fetchQuestions(
    subject: string,
    limit: number = 40,
    year?: number,
    examType?: string
): Promise<QBoardQuestion[]> {
    try {
        let url = `${QBOARD_API_BASE}/q/${limit}?subject=${subject}`;

        if (year) url += `&year=${year}`;
        if (examType) url += `&type=${examType}`;

        console.log(`Fetching from: ${url}`);

        const response = await fetch(url, {
            headers: {
                'AccessToken': API_TOKEN || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QBoardResponse = await response.json();

        // Handle both single object and array responses
        return Array.isArray(data.data) ? data.data : [data.data];
    } catch (error) {
        console.error(`Error fetching questions for ${subject}:`, error);
        return [];
    }
}

async function seedSubject(subject: string) {
    console.log(`\n📚 Seeding ${subject}...`);

    let totalAdded = 0;
    let totalSkipped = 0;

    // Fetch questions for different exam types and years
    for (const examType of EXAM_TYPES) {
        console.log(`  Fetching ${examType} questions...`);

        const questions = await fetchQuestions(subject, 40, undefined, examType);

        for (const q of questions) {
            try {
                // Check if question already exists (by checking similar text)
                const existing = await prisma.question.findFirst({
                    where: {
                        questionText: q.question,
                        subject: subject,
                    },
                });

                if (existing) {
                    totalSkipped++;
                    continue;
                }

                // Insert question
                await prisma.question.create({
                    data: {
                        subject: subject,
                        questionText: q.question,
                        optionA: q.option.a,
                        optionB: q.option.b,
                        optionC: q.option.c,
                        optionD: q.option.d,
                        correctOption: q.answer.toLowerCase(),
                        year: q.year || null,
                        examType: q.examtype || examType,
                    },
                });

                totalAdded++;
            } catch (error) {
                console.error(`  Error adding question:`, error);
            }
        }

        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`  ✅ Added ${totalAdded} questions, skipped ${totalSkipped} duplicates`);
    return { added: totalAdded, skipped: totalSkipped };
}

async function main() {
    console.log('🌱 Starting QBoard API seeding...\n');

    if (!API_TOKEN) {
        console.error('❌ QBOARD_API_TOKEN environment variable is not set!');
        console.error('Please set it in your .env file or environment');
        process.exit(1);
    }

    console.log(`Using API token: ${API_TOKEN.substring(0, 10)}...`);

    let grandTotalAdded = 0;
    let grandTotalSkipped = 0;

    for (const subject of SUBJECTS) {
        const { added, skipped } = await seedSubject(subject);
        grandTotalAdded += added;
        grandTotalSkipped += skipped;
    }

    console.log('\n✨ Seeding complete!');
    console.log(`📊 Total questions added: ${grandTotalAdded}`);
    console.log(`⏭️  Total duplicates skipped: ${grandTotalSkipped}`);

    // Show count by subject
    console.log('\n📈 Questions per subject:');
    for (const subject of SUBJECTS) {
        const count = await prisma.question.count({
            where: { subject },
        });
        console.log(`  ${subject}: ${count}`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

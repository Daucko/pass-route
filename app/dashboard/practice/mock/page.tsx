'use client';

import { useSearchParams } from 'next/navigation';
import { QuestionViewPage } from '@/components/features/question-view-page';

export default function MockExamPage() {
    const searchParams = useSearchParams();
    const subjectsParam = searchParams.get('subjects');
    const subjects = subjectsParam ? subjectsParam.split(',') : [];

    return (
        <QuestionViewPage
            subject="Mock Exam"
            mode="mock"
            subjects={subjects}
        />
    );
}

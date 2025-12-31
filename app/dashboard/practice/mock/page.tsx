'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestionViewPage } from '@/components/features/question-view-page';

function MockExamContent() {
  const searchParams = useSearchParams();
  const subjectsParam = searchParams.get('subjects');
  const subjects = subjectsParam ? subjectsParam.split(',') : [];

  return (
    <QuestionViewPage subject="Mock Exam" mode="mock" subjects={subjects} />
  );
}

export default function MockExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-neon-blue border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">Loading exam...</p>
          </div>
        </div>
      }
    >
      <MockExamContent />
    </Suspense>
  );
}

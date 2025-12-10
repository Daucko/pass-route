'use client';

import { useParams } from 'next/navigation';
import { QuestionViewPage } from '@/components/features/question-view-page';

export default function PracticeSubjectPage() {
  const params = useParams();
  const subject = params.subject as string;

  return <QuestionViewPage subject={subject} />;
}

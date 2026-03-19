
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostPropertyFormComponent, FormSkeleton } from '@/components/post-property-form';

// A wrapper component is needed because useSearchParams() will cause suspense.
// The <Suspense> boundary must be defined by a parent component.
function PostPropertyPageContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  return <PostPropertyFormComponent editId={editId} />;
}

export default function PostPropertyPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PostPropertyPageContent />
    </Suspense>
  );
}

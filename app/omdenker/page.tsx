'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Omdenker from '@/components/Omdenker';

function OmdenkerMetParams() {
  const params = useSearchParams();
  return (
    <Omdenker
      initialSituatie={params.get('situatie') ?? ''}
      gevoel={params.get('gevoel') ?? ''}
    />
  );
}

export default function OmdenkerPage() {
  return (
    <Suspense fallback={<Omdenker />}>
      <OmdenkerMetParams />
    </Suspense>
  );
}

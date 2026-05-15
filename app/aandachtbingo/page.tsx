'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AandachtBingo from '@/components/AandachtBingo';

function BingoEmbed() {
  const params = useSearchParams();
  return <AandachtBingo isEmbed={params.get('embed') === 'true'} />;
}

export default function Page() {
  return (
    <Suspense fallback={<AandachtBingo />}>
      <BingoEmbed />
    </Suspense>
  );
}

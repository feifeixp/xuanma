'use client';

import { Suspense } from 'react';
import ChartContent from './ChartContent';

export default function ChartPage() {
  return (
    <Suspense fallback={
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">载入中...</div>
      </main>
    }>
      <ChartContent />
    </Suspense>
  );
}

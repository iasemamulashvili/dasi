'use client';

import { useState, useEffect } from 'react';
import ErrorConcept1 from '@/components/errors/ErrorConcept1';
import ErrorConcept2 from '@/components/errors/ErrorConcept2';
import ErrorConcept3 from '@/components/errors/ErrorConcept3';

export default function NotFound() {
  const [variantIdx, setVariantIdx] = useState<number | null>(null);

  useEffect(() => {
    // Equal 33.3% probability across the 3 sandbox concepts (concept1, concept2, concept3)
    const randomVariant = Math.floor(Math.random() * 3);
    setVariantIdx(randomVariant);
  }, []);

  if (variantIdx === null) {
    // Clean fallback to prevent hydration mismatch
    return (
      <div className="flex-1 min-h-screen bg-carbon-black flex items-center justify-center text-alabaster-grey/40 font-mono text-xs select-none">
        <span>RESOLVING ERROR COORDINATES...</span>
      </div>
    );
  }

  switch (variantIdx) {
    case 0:
      return <ErrorConcept1 />;
    case 1:
      return <ErrorConcept2 />;
    case 2:
      return <ErrorConcept3 />;
    default:
      return <ErrorConcept1 />;
  }
}

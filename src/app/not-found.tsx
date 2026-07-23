'use client';

import { useState, useEffect } from 'react';
import ErrorVariant0Legacy from '@/components/errors/ErrorVariant0Legacy';
import ErrorVariant1Concept1 from '@/components/errors/ErrorVariant1Concept1';
import ErrorVariant2Concept2 from '@/components/errors/ErrorVariant2Concept2';
import ErrorVariant3Concept3 from '@/components/errors/ErrorVariant3Concept3';

export default function NotFound() {
  const [variantIdx, setVariantIdx] = useState<number | null>(null);

  useEffect(() => {
    // Stochastic selection with equal 25% probability across 4 ported variants
    const randomVariant = Math.floor(Math.random() * 4);
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
      return <ErrorVariant0Legacy />;
    case 1:
      return <ErrorVariant1Concept1 />;
    case 2:
      return <ErrorVariant2Concept2 />;
    case 3:
      return <ErrorVariant3Concept3 />;
    default:
      return <ErrorVariant0Legacy />;
  }
}

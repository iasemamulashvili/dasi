'use client';

import { useState, useEffect } from 'react';
import ErrorVariant0Fog from '@/components/errors/ErrorVariant0Fog';
import ErrorVariant1Matrix from '@/components/errors/ErrorVariant1Matrix';
import ErrorVariant2Arcade from '@/components/errors/ErrorVariant2Arcade';
import ErrorVariant3Space from '@/components/errors/ErrorVariant3Space';

export default function NotFound() {
  const [variantIdx, setVariantIdx] = useState<number | null>(null);

  useEffect(() => {
    // Stochastic selection with equal 25% probability across 4 variants
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
      return <ErrorVariant0Fog />;
    case 1:
      return <ErrorVariant1Matrix />;
    case 2:
      return <ErrorVariant2Arcade />;
    case 3:
      return <ErrorVariant3Space />;
    default:
      return <ErrorVariant0Fog />;
  }
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';

function HomeContent() {
  return (
    <div className="h-screen relative bg-gradient-to-br from-[#e4b9d7] via-[#9a5ded] to-[#15128f] text-white overflow-hidden">
      {/* Animated blob gradient background for entire page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob Layer 1 - Large purple blob */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute blob blob-1"></div>
        </div>

        {/* Blob Layer 2 - Medium blue blob */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute blob blob-2"></div>
        </div>

        {/* Blob Layer 3 - Small pink blob */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute blob blob-3"></div>
        </div>
      </div>

      {/* Hero Content - Positioned between center and top */}
      <div className="relative h-full flex items-center justify-center -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-rakkas font-bold mb-2 text-white" style={{fontSize: '48px'}}>
              Turn <span style={{color: '#15128f'}}>Event Ideas</span> into <span style={{color: '#15128f'}}>Real Events</span>
            </h1>
            <p className="mb-8 max-w-2xl mx-auto text-white/95" style={{fontSize: '20px', lineHeight: '1.5'}}>
              Automate your event planning so you can focus on the vibes.
            </p>
            <Link
              href="/create"
              className="inline-block bg-[#15128f] text-white px-10 py-5 rounded-lg font-bold hover:bg-[#0d0a5c] transition-colors shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#15128f]"
              style={{fontSize: '16px', lineHeight: '1.2'}}
            >
              Create Your Event →
            </Link>
            <p className="mt-4 text-white/90" style={{fontSize: '16px', lineHeight: '1.5'}}>
              No login required. Two minutes to create an event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="h-screen relative bg-gradient-to-br from-[#e4b9d7] via-[#9a5ded] to-[#15128f] text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white/90" style={{fontSize: '20px', lineHeight: '1.5'}}>Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

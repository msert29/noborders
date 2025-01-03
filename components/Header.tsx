'use client';
import LanguageDropdown from '@/components/LanguageDropdown';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import React from 'react';

export default function Header({ dictionary }: { dictionary: Dictionary }) {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 py-3">
        <div className="flex justify-center">
          <div className="ml-auto inline-flex items-center px-4 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm text-gray-200">
              {dictionary.landing.scrollTitle}
            </span>
          </div>
          <div className="ml-auto">
            <LanguageDropdown
              pathname={pathname as string}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

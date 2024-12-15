import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 py-3">
        <div className="flex justify-center">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm text-gray-200">
              Powered by advanced AI technology
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

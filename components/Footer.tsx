import { Dictionary } from '@/app/[lang]/dictionaries';
import Link from 'next/link';

export default function Footer({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              NoBorders.ai
            </span>
          </div>
          <nav className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {dictionary.landing.privacy}
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {dictionary.landing.terms}
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {dictionary.landing.contact}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

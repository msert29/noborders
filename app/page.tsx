import VisaVetter from '@/components/ui/visa-vetter';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            <span className="text-green-700">No</span>
            <span className="text-yellow-600">Borders</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Upload your visa documents for instant verification using state of
            the art AI
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <VisaVetter />

          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="mb-4">
                <Image
                  src="/file.svg"
                  alt="Upload icon"
                  width={32}
                  height={32}
                  className="text-blue-500"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Securely upload your visa documents in multiple formats
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="mb-4">
                <Image
                  src="/globe.svg"
                  alt="Verify icon"
                  width={32}
                  height={32}
                  className="text-blue-500"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Instant Verification
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get immediate results using our advanced AI analysis
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <div className="mb-4">
                <Image
                  src="/window.svg"
                  alt="Security icon"
                  width={32}
                  height={32}
                  className="text-blue-500"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Processing</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your documents are processed with enterprise-grade security
              </p>
            </div>
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2024 nobordersai. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

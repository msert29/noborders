import { Dictionary } from '@/app/[lang]/dictionaries';
export default function HowItWorks({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            {dictionary.landing.joinTitle}
          </h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 mb-6">{dictionary.landing.ftaHeader}</p>
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
              {dictionary.landing.requestEarlyAccess}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

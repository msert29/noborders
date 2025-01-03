import { Dictionary, FeatureContent } from '@/app/[lang]/dictionaries';
import { Shield, Zap, CheckCircle, Clock } from 'lucide-react';

// Type the features array to ensure 'dictionaryKey' is a valid key of `Dictionary['landing']`
const features: Array<{
  icon: JSX.Element;
  dictionaryKey: keyof Dictionary['landing']; // Ensuring dictionaryKey is a valid key of 'landing'
}> = [
  {
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    dictionaryKey: 'aiPowered',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-orange-400" />,
    dictionaryKey: 'accuracy',
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    dictionaryKey: 'results',
  },
  {
    icon: <Shield className="w-6 h-6 text-pink-400" />,
    dictionaryKey: 'secure',
  },
];

export default function Features({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const featureContent = dictionary.landing[
              feature.dictionaryKey
            ] as FeatureContent;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {featureContent.title}
                </h3>
                <p className="text-gray-400">{featureContent.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

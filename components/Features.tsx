import { Shield, Zap, CheckCircle, Clock } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    title: 'AI-Powered Analysis',
    description:
      'Advanced machine learning algorithms analyse your application data.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-orange-400" />,
    title: '95% Accuracy',
    description:
      'High prediction accuracy based on extensive historical data. Tips on improving your chances.',
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    title: 'Instant Results',
    description: 'Get your visa application prediction in seconds, not days.',
  },
  {
    icon: <Shield className="w-6 h-6 text-pink-400" />,
    title: 'Secure & Private',
    description:
      'Your data is encrypted and protected with enterprise-grade security.',
  },
];

export default function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Brain,
  Lightbulb,
  PieChart,
  Lock,
  Zap,
} from 'lucide-react';
import { useTypingAnimation } from '@/app/hooks/useTypingAnimation';
import { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';

export interface AIResultProps {
  result: {
    analysis: string;
    issues: string;
    suggestion: string;
    completeness: string;
    decision: string;
    paid: boolean;
  };
}

interface Section {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  free: boolean;
}

const TypingContent = memo(
  ({
    content,
    sectionTitle,
    onComplete,
  }: {
    content: string;
    sectionTitle: string;
    onComplete: (title: string) => void;
  }) => {
    const { displayedText, isComplete } = useTypingAnimation(content, 30, true);

    useEffect(() => {
      if (isComplete) {
        onComplete(sectionTitle);
      }
    }, [isComplete, sectionTitle, onComplete]);

    return <Markdown className="text-gray-700">{displayedText}</Markdown>;
  },
);

TypingContent.displayName = 'TypingContent';

const Content = memo(
  ({
    section,
    isTypingComplete,
    onComplete,
  }: {
    section: Section;
    isTypingComplete: boolean;
    onComplete: (title: string) => void;
  }) => {
    if (
      (section.title === 'Analysis' || section.title === 'Issues') &&
      !isTypingComplete
    ) {
      return (
        <TypingContent
          content={section.content}
          sectionTitle={section.title}
          onComplete={onComplete}
        />
      );
    }
    return <Markdown className="text-gray-700">{section.content}</Markdown>;
  },
);

Content.displayName = 'TypingContent';

const AIResult: React.FC<AIResultProps> = ({ result }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string[]>([
    'Analysis',
    'Issues',
  ]);
  const [completedTyping, setCompletedTyping] = useState<Set<string>>(
    new Set(),
  );

  const sections: Section[] = [
    { title: 'Analysis', icon: Brain, content: result.analysis, free: true },
    { title: 'Issues', icon: AlertCircle, content: result.issues, free: true },
    {
      title: 'Decision',
      icon: CheckCircle2,
      content: result.decision,
      free: false,
    },
    {
      title: 'Suggestions',
      icon: Lightbulb,
      content: result.suggestion,
      free: false,
    },
    {
      title: 'Completeness',
      icon: PieChart,
      content: result.completeness,
      free: false,
    },
  ];

  const handleTypingComplete = (title: string) => {
    setCompletedTyping((prev) => new Set(prev).add(title));
  };

  const toggleSection = (section: string) => {
    if (!section) return;
    setExpandedSection((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          AI Analysis Results
        </h1>

        <div className="grid gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white shadow-lg rounded-lg overflow-hidden border-2 ${
                section.free || isPremium
                  ? 'border-blue-300'
                  : 'border-yellow-500'
              } ${!section.free && !isPremium ? 'opacity-75' : ''}`}
            >
              <div
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  (section.free || isPremium) &&
                  expandedSection.includes(section.title)
                    ? 'bg-blue-50'
                    : ''
                }`}
                onClick={() =>
                  section.free || isPremium
                    ? toggleSection(section.title)
                    : null
                }
              >
                <div className="flex items-center space-x-3">
                  <section.icon
                    className={`w-6 h-6 ${section.free || isPremium ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                {!section.free && !isPremium ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : expandedSection.includes(section.title) ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {(section.free || isPremium) &&
                expandedSection.includes(section.title) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-blue-100">
                      <Content
                        section={section}
                        isTypingComplete={completedTyping.has(section.title)}
                        onComplete={handleTypingComplete}
                      />
                    </div>
                  </motion.div>
                )}
            </motion.div>
          ))}
        </div>

        {!isPremium && (
          <div className="text-center">
            <Button
              onClick={() => setIsPremium(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2 inline-block" />
              Upgrade to Premium
            </Button>
            <p className="mt-4 text-sm text-gray-600">
              Unlock Decision, Suggestions, and Completeness sections with a
              Premium account!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResult;

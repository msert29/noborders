'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTypingAnimation } from '@/app/hooks/useTypingAnimation';
import { CheckCircle, AlertTriangle, Stamp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const formatTextContent = (text: string) => {
  // Split the text into lines
  const lines = text.split('\n');

  // Process each line
  const formattedLines = lines.map((line) => {
    // Check for numbered points (e.g., "1.", "2.", etc.)
    const numberMatch = line.match(/^\d+\./);
    if (numberMatch) {
      // Replace the number with a bullet point
      return `• ${line.slice(numberMatch[0].length).trim()}`;
    }
    // Check for sub-bullets (indented with - or *)
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      // Add some indentation for sub-bullets
      return `  ${line.trim().replace(/^[-*]/, '•')}`;
    }
    return line;
  });

  return formattedLines.join('\n');
};

export interface AIResultProps {
  analysis: string;
  issues: string;
  suggestion: string;
  completeness: string;
  decision: string;
}

export const AIResult: React.FC<{
  result: AIResultProps;
}> = ({ result }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [
    'analysis',
    'issues',
    'suggestion',
    'completeness',
    'decision',
  ];

  const { displayedText: analysisText, isComplete: analysisComplete } =
    useTypingAnimation(
      formatTextContent(result.analysis),
      20,
      currentSection >= 0,
    );
  const { displayedText: issuesText, isComplete: issuesComplete } =
    useTypingAnimation(
      formatTextContent(result.issues),
      20,
      currentSection >= 1,
    );
  const { displayedText: suggestionText, isComplete: suggestionComplete } =
    useTypingAnimation(
      formatTextContent(result.suggestion),
      20,
      currentSection >= 2,
    );
  const { displayedText: completenessText, isComplete: completenessComplete } =
    useTypingAnimation(
      formatTextContent(result.completeness),
      20,
      currentSection >= 3,
    );
  const { displayedText: decisionText, isComplete: decisionComplete } =
    useTypingAnimation(
      formatTextContent(result.decision),
      20,
      currentSection >= 4,
    );

  useEffect(() => {
    if (currentSection < sections.length - 1) {
      let timer: NodeJS.Timeout | undefined;
      switch (currentSection) {
        case 0:
          if (analysisComplete)
            timer = setTimeout(
              () => setCurrentSection((prev) => prev + 1),
              1000,
            );
          break;
        case 1:
          if (issuesComplete)
            timer = setTimeout(
              () => setCurrentSection((prev) => prev + 1),
              1000,
            );
          break;
        case 2:
          if (suggestionComplete)
            timer = setTimeout(
              () => setCurrentSection((prev) => prev + 1),
              1000,
            );
          break;
        case 3:
          if (completenessComplete)
            timer = setTimeout(
              () => setCurrentSection((prev) => prev + 1),
              1000,
            );
          break;
        case 4:
          if (decisionComplete)
            timer = setTimeout(
              () => setCurrentSection((prev) => prev + 1),
              1000,
            );
          break;
        default:
          timer = setTimeout(() => setCurrentSection((prev) => prev + 1), 2000);
      }
      return () => clearTimeout(timer);
    }
  }, [
    currentSection,
    analysisComplete,
    issuesComplete,
    suggestionComplete,
    completenessComplete,
    decisionComplete,
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <Card className="max-w-4xl mx-auto space-y-12">
        <CardHeader className="text-4xl font-bold mb-8 text-center">
          Visa Application Result
        </CardHeader>
        <AnimatePresence>
          <CardContent>
            {currentSection >= 0 && (
              <AnimatedSection
                title="Analysis"
                content={analysisText}
                icon={<CheckCircle className="w-6 h-6" />}
                key="analysis"
              />
            )}
            {currentSection >= 1 && (
              <AnimatedSection
                title="Issues"
                content={issuesText}
                icon={<AlertTriangle className="w-6 h-6" />}
                key="issues"
              />
            )}
            {currentSection >= 2 && (
              <AnimatedSection
                title="Suggestion"
                content={suggestionText}
                icon={<CheckCircle className="w-6 h-6" />}
                key="suggestion"
              />
            )}
            {currentSection >= 3 && (
              <AnimatedSection
                title="Completeness"
                content={completenessText}
                icon={<CheckCircle className="w-6 h-6" />}
                key="completeness"
              />
            )}
            {currentSection >= 4 && (
              <AnimatedSection
                title="Decision"
                content={decisionText}
                icon={<Stamp className="w-6 h-6" />}
                key="decision"
              />
            )}
          </CardContent>
        </AnimatePresence>
      </Card>
    </div>
  );
};

type AnimatedSectionProps = {
  title: string;
  content: string;
  icon: React.ReactNode;
};

function AnimatedSection({ title, content, icon }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <div className="text-lg whitespace-pre-wrap">{content}</div>
    </motion.div>
  );
}

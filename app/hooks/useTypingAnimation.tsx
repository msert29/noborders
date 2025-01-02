'use client';

import { CheckCircle, AlertTriangle, Stamp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const useTypingAnimation = (
  text: string,
  speed: number,
  shouldStart: boolean = false,
) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldStart) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, shouldStart]);

  return { displayedText, isComplete };
};

'use client';

import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Reviewing your personal information',
  'Reviewing your financial information',
  'Verifying your documents',
  'Determining possible visa outcome',
];

export default function AIProgressDialog() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length - 1) {
          return prevStep + 1;
        }
        clearInterval(timer);
        setIsComplete(true);
        return prevStep;
      });
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-8 max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-4">AI Processing</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index < currentStep || (index === currentStep && isComplete)
                    ? 'bg-green-500'
                    : index === currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                }`}
                initial={false}
                animate={
                  index < currentStep || (index === currentStep && isComplete)
                    ? { scale: [1, 1.2, 1] }
                    : index === currentStep
                      ? { rotate: 360 }
                      : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: index === currentStep && !isComplete ? Infinity : 0,
                  ease: 'linear',
                }}
              >
                {(index < currentStep ||
                  (index === currentStep && isComplete)) && (
                  <Check className="text-white" size={16} />
                )}
                {index === currentStep && !isComplete && (
                  <Loader2 className="text-white animate-spin" size={16} />
                )}
              </motion.div>
              <span
                className={
                  index <= currentStep ? 'text-black' : 'text-gray-500'
                }
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isComplete ? 1 : (currentStep + 1) / steps.length,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-green-500 h-full rounded-full" />
        </motion.div>
        {isComplete && <Button className="w-full">View results</Button>}
      </motion.div>
    </div>
  );
}

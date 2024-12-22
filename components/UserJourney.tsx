'use client';
import {
  financialInformationSchema,
  personalInformationSchema,
} from '@/lib/schemas';
import { FinancialInformationType, PersonalInformationType } from '@/lib/types';
import { FinancialInformation } from '@/components/FinancialInformationForm';
import { PersonalInformation } from '@/components/PersonalInformation';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import React from 'react';
import { z } from 'zod';

const ProgressBarClass = ({ step }: { step: number }) => {
  const widthClass: Record<number, string> = {
    1: 'w-1/4',
    2: 'w-2/4',
    3: 'w-3/4',
    4: 'w-full',
  };

  return (
    <div className={`h-full bg-primary rounded-full ${widthClass[step]}`} />
  );
};

const VisaApplicationForm = () => {
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationType>({
      visaCountry: '',
      nationality: '',
      name: '',
      gender: '',
      age: '',
      address: '',
    });

  const [financialInformation, setFinancialInformation] =
    useState<FinancialInformationType>({
      income: '',
      currency: '',
      expenditure: '',
      savings: '',
      toDate: undefined,
      fromDate: undefined,
      employmentType: '',
    });

  const handlePersonalInformationFormSubmit = (
    data: z.infer<typeof personalInformationSchema>,
  ) => {
    setPersonalInformation((prev) => ({
      ...prev,
      ...data,
    }));
    goToNextStep();
  };

  const handleFinancialInformationFormSubmit = (
    data: z.infer<typeof financialInformationSchema>,
  ) => {
    setFinancialInformation((prev) => ({
      ...prev,
      ...data,
    }));
    goToNextStep();
  };

  const handleFileUploadFormSubmit = () => {
    console.log('File upload successful');
  };

  const [step, setStep] = useState(1);

  const goToNextStep = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex justify-start items-center mb-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mr-10">
              NoBorders.ai
            </span>
            <div className="items-center gap-8 hidden lg:flex">
              {/* Step navigation */}
              {/* You can display active step indicator */}
              <div className="items-center gap-8 hidden lg:flex">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                    1
                  </div>
                  <span className="text-sm font-medium">
                    Personal Information
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Financial Information
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                    3
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Upload Documents
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                    4
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Submission
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full">
            <ProgressBarClass step={step} />
          </div>
        </div>

        {/* Step Forms */}
        {step === 1 && (
          <PersonalInformation
            formData={personalInformation}
            setPersonalInformationAction={handlePersonalInformationFormSubmit}
          />
        )}
        {step === 2 && (
          <FinancialInformation
            setFinancialInformationAction={handleFinancialInformationFormSubmit}
            formData={financialInformation}
            goPreviousAction={goToPreviousStep}
          />
        )}
        {step === 3 && (
          <FileUpload
            goPreviousAction={goToPreviousStep}
            onSubmitAction={handleFileUploadFormSubmit}
          />
        )}
        {step === 4 && <h1>Payment Form</h1>}
      </div>
    </div>
  );
};

export default VisaApplicationForm;

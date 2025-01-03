'use client';
import {
  AnalyseAndUploadResult,
  FinancialInformationType,
  PersonalInformationType,
} from '@/lib/types';
import {
  financialInformationSchema,
  personalInformationSchema,
} from '@/lib/schemas';
import { FinancialInformation } from '@/components/FinancialInformationForm';
import { PersonalInformation } from '@/components/PersonalInformation';
import { Dictionary } from '@/app/[lang]/dictionaries';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
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

type AnalyseAndUploadProps = {
  files: Array<{ file: File; documentType: string }>;
  uuid: string;
  personalInformation: PersonalInformationType;
  financialInformation: FinancialInformationType;
};

type VisaApplicationFormProps = {
  analyseAndUpload: (
    data: AnalyseAndUploadProps,
  ) => Promise<AnalyseAndUploadResult>;
  dictionary: Dictionary;
};

const VisaApplicationForm: React.FC<VisaApplicationFormProps> = ({
  analyseAndUpload,
  dictionary,
}) => {
  const router = useRouter();
  const [uuid, setUUID] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationType>({
      visaCountry: '',
      nationality: '',
      name: '',
      gender: '',
      age: 0,
      address: '',
      previous_visa_from_uk_eu_us: false,
      previous_rejection_from_uk_eu_us: false,
    } as PersonalInformationType);

  const [financialInformation, setFinancialInformation] =
    useState<FinancialInformationType>({
      income: 0,
      currency: '',
      expenditure: 0,
      savings: 0,
      toDate: undefined,
      fromDate: undefined,
      employmentType: '',
    });

  useEffect(() => {
    if (!searchParams?.get('uuid') || searchParams?.get('uuid') === null) {
      const uuidValue = uuidv4();
      setUUID(uuidValue);
      router.push(`${pathname}?uuid=${uuidValue}`);
    } else {
      const uuidValue = searchParams?.get('uuid');
      setUUID(uuidValue);
      router.push(`${pathname}?uuid=${uuidValue}`);
    }
  }, []);

  useEffect(() => {
    if (!uuid) return; // handle initial render
    const queryParams = new URLSearchParams(searchParams?.toString());

    const step = queryParams.get('step');
    if (step === '1') {
      queryParams.set('step', '2');
    }

    if (uuid) {
      queryParams.set('uuid', uuid);
    }

    const computedQueryParams = buildQueryParams(step || '1');
    router.push(`${pathname}?${computedQueryParams}`);
  }, [personalInformation, financialInformation]);

  const buildQueryParams = (step: string): string => {
    const queryParams = new URLSearchParams(searchParams?.toString());
    queryParams.set('step', step);
    queryParams.set('uuid', uuid as string);

    Object.entries(personalInformation).forEach(([key, value]) => {
      queryParams.set(key, String(value));
    });
    Object.entries(financialInformation).forEach(([key, value]) => {
      queryParams.set(key, String(value));
    });

    return queryParams.toString();
  };

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

  const handleFileUploadFormSubmit = async (
    files: Array<{ file: File; documentType: string }>,
  ) => {
    await analyseAndUpload({
      files: files,
      uuid: uuid as string,
      personalInformation: personalInformation,
      financialInformation: financialInformation,
    });
    router.push(`result/${uuid}`);
  };

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
                    {dictionary.userJourney.personalInformation.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                      step >= 2
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    2
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dictionary.userJourney.financialInformation.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                      step >= 3
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    3
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dictionary.userJourney.uploadDocuments.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                      step >= 4
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    4
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dictionary.userJourney.submission.title}
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
            setPersonalInformationAction={handlePersonalInformationFormSubmit}
            dictionary={dictionary}
          />
        )}
        {step === 2 && (
          <FinancialInformation
            setFinancialInformationAction={handleFinancialInformationFormSubmit}
            goPreviousAction={goToPreviousStep}
            dictionary={dictionary}
          />
        )}
        {step === 3 && (
          <FileUpload
            onUploadAction={handleFileUploadFormSubmit}
            goPreviousAction={goToPreviousStep}
            dictionary={dictionary}
          />
        )}
      </div>
    </div>
  );
};

export default VisaApplicationForm;

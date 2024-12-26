export type PersonalInformationType = {
  visaCountry: string;
  nationality: string;
  name: string;
  gender: string;
  age: number;
  address: string;
  previous_visa_from_uk_eu_us: boolean;
  previous_rejection_from_uk_eu_us: boolean;
};

export type FinancialInformationType = {
  employmentType: string;
  currency: string;
  income: number;
  expenditure: number;
  savings: number;
  toDate: Date | undefined;
  fromDate: Date | undefined;
};

export type UploadResult = {
  id: string;
  url: string;
  documentType: string;
};

export type AnalyseAndUploadResult = {
  success: boolean;
  uploads?: Array<{ id: string; url: string }>;
  error?: string;
};

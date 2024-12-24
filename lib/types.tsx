export type PersonalInformationType = {
  visaCountry: string;
  nationality: string;
  name: string;
  gender: string;
  age: string;
  address: string;
  previous_visa_from_uk_eu_us: boolean;
  previous_rejection_from_uk_eu_us: boolean;
};

export type FinancialInformationType = {
  employmentType: string;
  currency: string;
  income: string;
  expenditure: string;
  savings: string;
  toDate: Date | undefined;
  fromDate: Date | undefined;
};

export type UploadResult = {
  id: string;
  url: string;
  documentType: string;
};

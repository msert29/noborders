export type PersonalInformationType = {
  visaCountry: string;
  nationality: string;
  name: string;
  gender: string;
  age: string;
  address: string;
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

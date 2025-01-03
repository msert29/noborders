import 'server-only';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  fr: () => import('./locales/fr.json').then((module) => module.default),
  ar: () => import('./locales/ar.json').then((module) => module.default),
  tr: () => import('./locales/tr.json').then((module) => module.default),
  ur: () => import('./locales/ur.json').then((module) => module.default),
  hi: () => import('./locales/hi.json').then((module) => module.default),
};

const locales = ['en', 'fr', 'ar', 'tr', 'ur', 'hi'];

export const getDictionary = async (
  locale: 'en' | 'fr' | 'ar' | 'tr' | 'ur' | 'hi',
): Promise<Dictionary> => {
  return dictionaries[locales.includes(locale) ? locale : 'en']();
};

export type FeatureContent = {
  title: string;
  text: string;
};

type UserJourney = {
  back: string;
  next: string;
  viewResults: string;
  personalInformation: {
    title: string;
    applyingFor: string;
    applyingForPlaceholder: string;
    nationality: string;
    nationalityPlaceholder: string;
    fullName: string;
    gender: string;
    genderPlaceholder: string;
    age: string;
    address: string;
    previousApproval: string;
    previousRejection: string;
  };
  financialInformation: {
    title: string;
    employmentType: string;
    employmentTypePlaceholder: string;
    currency: string;
    monthlyIncome: string;
    monthlyExpenditure: string;
    savings: string;
    dateOfEntry: string;
    dateOfDeparture: string;
  };
  uploadDocuments: {
    title: string;
    dragAndDrop: string;
    chooseFile: string;
    supportedFormat: string;
    minimumUpload: string;
  };
  submission: {
    title: string;
    reviewPersonal: string;
    reviewFinancial: string;
    reviewDocuments: string;
    outcome: string;
  };
};

export type Landing = {
  scrollTitle: string;
  title: string;
  subTitle: string;
  enterEmail: string;
  joinWaitlist: string;
  aiPowered: FeatureContent;
  accuracy: FeatureContent;
  results: FeatureContent;
  secure: FeatureContent;
  joinTitle: string;
  ftaHeader: string;
  thanksForJoining: string;
  requestEarlyAccess: string;
  privacy: string;
  terms: string;
  contact: string;
};

export type Dictionary = {
  landing: Landing;
  userJourney: UserJourney;
};

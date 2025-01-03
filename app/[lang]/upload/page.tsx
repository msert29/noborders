import { Suspense } from 'react';

import { getDictionary, Dictionary } from '@/app/[lang]/dictionaries';
import { analyseAndUpload } from '@/app/actions/analyse';
import UserJourney from '@/components/UserJourney';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: 'en' | 'fr' | 'ar' | 'tr' | 'ur' | 'hi' }>;
}) {
  const lang = (await params).lang;
  const dictionary: Dictionary = await getDictionary(lang);
  return (
    <Suspense>
      <UserJourney
        analyseAndUpload={analyseAndUpload}
        dictionary={dictionary}
      />
    </Suspense>
  );
}

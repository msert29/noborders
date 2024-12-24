import { Suspense } from 'react';

import { analyseAndUpload } from '@/app/actions/analyse';
import UserJourney from '@/components/UserJourney';

export default function UploadPage() {
  return (
    <Suspense>
      <UserJourney analyseAndUpload={analyseAndUpload} />
    </Suspense>
  );
}

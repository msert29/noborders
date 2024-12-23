import { Suspense } from 'react';

import UserJourney from '@/components/UserJourney';

export default function UploadPage() {
  return (
    <Suspense>
      <UserJourney />
    </Suspense>
  );
}

import AIResult, { AIResultProps } from '@/components/AIResult';
import { Suspense } from 'react';

export default async function Page({ params }: { params: { uuid: string } }) {
  try {
    const { uuid } = await params;

    const response = await fetch(
      `${process.env.AWS_LAMBDA_URL}/vet-application/${uuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Optional: Ensure no stale data is served in SSG/SSR
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    // Parse the JSON response
    const data: AIResultProps['result'] = await response.json();

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AIResult result={data} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching AI result:', error);
    return (
      <div>
        <p>
          That application does not exist or currently in processing state.
          Please try again later.
        </p>
      </div>
    );
  }
}

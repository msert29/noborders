'use server';

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { FinancialInformationType, PersonalInformationType } from '@/lib/types';
import { AnalyseAndUploadResult } from '@/lib/types';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function isAwsError(error: unknown): error is { name: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    typeof (error as { name: unknown }).name === 'string'
  );
}

async function createBucketIfNotExists(uuid: string): Promise<string> {
  const bucketName = uuid;

  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
  } catch (error: unknown) {
    if (isAwsError(error) && error.name !== 'BucketAlreadyExists') {
      throw error;
    }
  }

  return bucketName;
}

type AnalyseAndUploadProps = {
  files: Array<{ file: File; documentType: string }>;
  uuid: string;
  personalInformation: PersonalInformationType;
  financialInformation: FinancialInformationType;
};

export async function analyseAndUpload(
  data: AnalyseAndUploadProps,
): Promise<AnalyseAndUploadResult> {
  try {
    const bucketName = await createBucketIfNotExists(data.uuid);

    const uploadPromises = data.files.map(async (file) => {
      const key = `${Date.now()}-${file.file.name}`;
      const arrayBuffer = await file.file.arrayBuffer();

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: Buffer.from(arrayBuffer),
          ContentType: file.file.type,
          Metadata: {
            documentType: file.file.type,
            uuid: data.uuid,
          },
          Tagging: `type=${file.documentType}`,
        }),
      );

      return {
        id: key,
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      };
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, uploads: results };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}

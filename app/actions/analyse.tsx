'use server';

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { FinancialInformationType, PersonalInformationType } from '@/lib/types';
import { AnalyseAndUploadResult } from '@/lib/types';
import prisma from '@/lib/prisma';

const s3client = new S3Client({
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

async function saveVisaApplication(
  uuid: string,
  personalInformation: PersonalInformationType,
  financialInformation: FinancialInformationType,
): Promise<void> {
  try {
    const fromDate = financialInformation?.fromDate
      ?.toISOString()
      .substring(0, 10);
    const toDate = financialInformation.toDate?.toISOString().substring(0, 10);
    await prisma.visaApplication.create({
      data: {
        uuid: uuid,
        visaCountry: personalInformation.visaCountry,
        name: personalInformation.name,
        gender: personalInformation.gender,
        age: personalInformation.age,
        address: personalInformation.address,
        nationality: personalInformation.nationality,
        previousVisaFromUkEuUs: personalInformation.previous_visa_from_uk_eu_us,
        previousRejectionFromUkEuUs:
          personalInformation.previous_rejection_from_uk_eu_us,
        employmentType: financialInformation.employmentType,
        currency: financialInformation.currency,
        income: financialInformation.income,
        expenditure: financialInformation.expenditure,
        savings: financialInformation.savings,
        fromDate: fromDate ?? '',
        toDate: toDate ?? '',
      },
    });
  } catch (error) {
    console.error('Error inserting visa application:', error);
    throw error;
  }
}

async function createBucketIfNotExists(bucketName: string): Promise<string> {
  try {
    await s3client.send(new CreateBucketCommand({ Bucket: bucketName }));
  } catch (error: unknown) {
    if (isAwsError(error) && error.name !== 'BucketAlreadyExists') {
      return bucketName;
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
    await saveVisaApplication(
      data.uuid,
      data.personalInformation,
      data.financialInformation,
    );
    const bucketName = await createBucketIfNotExists(
      'nobordersai-supporting-documents',
    );
    const uploadPromises = data.files.map(async (file) => {
      const key = `${data.uuid}/${Date.now()}-${file.file.name}`;
      const arrayBuffer = await file.file.arrayBuffer();

      await s3client.send(
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

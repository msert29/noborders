'use server';

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { FileUploadSchema } from '@/lib/schemas';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function createBucketIfNotExists(uuid: string) {
  const bucketName = `${process.env.AWS_BUCKET_NAME}-${uuid}`;
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
  } catch (error: any) {
    if (error.name !== 'BucketAlreadyExists') {
      throw error;
    }
  }
  return bucketName;
}

export async function analyseAndUpload(data: {
  files: File[];
  documentTypes: Record<string, string>;
  uuid: string;
}) {
  try {
    const bucketName = await createBucketIfNotExists(data.uuid);

    const uploadPromises = data.files.map(async (file) => {
      const key = `${Date.now()}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: Buffer.from(arrayBuffer),
          ContentType: file.type,
          Metadata: {
            documentType: data.documentTypes[file.name],
            uuid: data.uuid,
          },
        }),
      );

      return {
        id: key,
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        documentType: data.documentTypes[file.name],
      };
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, uploads: results };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { anthropic } from '@ai-sdk/anthropic';
import formidable, { File } from 'formidable';
import { promises as fs } from 'fs';
import { generateText } from 'ai';
import pdfParse from 'pdf-parse';

// Disable the default body parser to handle files
export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 45,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fields, files] = await form.parse(req);

    const uploadedFiles = files.documents;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    console.log(`Processing ${uploadedFiles.length} files...`);

    const textResults = await Promise.all(
      uploadedFiles.map(async (file: File) => {
        try {
          console.log(`Processing file: ${file.originalFilename}`);
          // Read the file from the temporary path
          const buffer = await fs.readFile(file.filepath);
          const pdfData = await pdfParse(buffer);
          return {
            filename: file.originalFilename,
            content: pdfData.text,
          };
        } catch (error) {
          console.error(
            `Error processing file ${file.originalFilename}:`,
            error,
          );
          throw new Error(
            `Failed to process file ${file.originalFilename}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        } finally {
          // Clean up: remove the temporary file
          await fs.unlink(file.filepath).catch(console.error);
        }
      }),
    );

    console.log('Files processed successfully, calling Anthropic API...');
    const prompt = `You are acting as a UK visa clearance officer. Your task is to review an applicant's documents, generate impressions, note down important points, and make a decision on their visa application. Here are the applicant's documents:

<applicant_documents>
${textResults
  .map(
    (result: { filename: string | null; content: string }) =>
      `<${result.filename}> File: <${result.filename}> \nContent:\n${result.content} </${result.filename}>\n---\n`,
  )
  .join('\n')}
</applicant_documents>

Carefully analyze the provided documents. Pay attention to details such as:
- Personal information (name, age, nationality)
- Purpose of visit
- Duration of stay
- Financial information
- Employment status
- Travel history
- Any supporting documents or letters

After reviewing the documents, note down important points that stand out or may influence the visa decision. Consider both positive and negative aspects of the application.

Based on your analysis, generate impressions about the applicant. Consider factors such as:
- Credibility of the application
- Likelihood of the applicant returning to their home country
- Financial capability to support their stay
- Consistency of information across documents
- Any red flags or areas of concern

Using your impressions and the noted points, make a decision on whether to approve or deny the visa application. Consider the UK visa regulations and requirements in your decision-making process.

Present your findings in the following format:

<notable_points>
List the important points you've identified from the documents
</notable_points>

<impressions>
Provide your overall impressions of the applicant based on the documents
</impressions>

<decision>
State your decision (Approve or Deny) and provide a brief justification for your choice
</decision>

Remember to maintain a professional and impartial tone throughout your assessment. Base your decision solely on the information provided in the applicant's documents and the UK visa regulations.`;

    console.log('Prompt: ', prompt);

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
    });
    // Extract content between XML tags
    const extractContent = (text: string, tag: string) => {
      const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`);
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const response = {
      notablePoints: extractContent(text, 'notable_points'),
      impressions: extractContent(text, 'impressions'),
      decision: extractContent(text, 'decision'),
      fullText: text, // keeping the full text just in case
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in process-documents handler:', error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Failed to process documents',
    });
  }
}

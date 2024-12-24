import { APPLYING_FOR_COUNTRY_LIST, COUNTRIES } from '@/lib/static-data';
import { z, ZodTypeAny } from 'zod';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Invalid number',
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);

export const personalInformationSchema = z.object({
  visaCountry: z
    .string()
    .refine((value) => APPLYING_FOR_COUNTRY_LIST.includes(value), {
      message: 'Selected country is not valid.',
    }),
  name: z.string().nonempty('Name is required.'),
  gender: z.string().nonempty('Gender is required.'),
  age: zodInputStringPipe(
    z.coerce
      .number()
      .min(0, 'Age cannot be less than 0.')
      .max(150, 'Age cannot be greater than 150.')
      .refine((value) => Number.isInteger(value), {
        message: 'Age must be a whole number.',
      }),
  ).refine((value) => value !== 0, {
    message: 'Age is required.',
  }),
  address: z.string(),
  nationality: z.string().refine((value) => COUNTRIES.includes(value), {
    message: 'Selected nationality is not valid.',
  }),
  previous_visa_from_uk_eu_us: z.boolean().default(false).optional(),
  previous_rejection_from_uk_eu_us: z.boolean().default(false).optional(),
});

export const financialInformationSchema = z.object({
  employmentType: z.string().nonempty('Employment type is required.'),
  currency: z.string().nonempty('Currency is required.'),
  income: zodInputStringPipe(
    z.number().min(0, 'Income must be a positive number.'),
  ),
  expenditure: zodInputStringPipe(
    z.number().min(0, 'Expenditure must be a positive number.'),
  ),
  savings: zodInputStringPipe(
    z.number().min(0, 'Savings must be a positive number.'),
  ),
  fromDate: z.date(),
  toDate: z.date(),
});

export const FileUploadSchema = z.object({
  files: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'application/pdf'].includes(
                file.type,
              ),
            {
              message: 'Unsupported file type',
            },
          )
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'File size must be less than 25MB',
          }),
        documentType: z.string().nonempty('Document type is required'),
      }),
    )
    .min(5, 'At least 5 files are required to make a decision'),
});

import { z } from 'zod'; // Add new import

export const WaitlistFormSchema = z.object({
  email: z.string().email(),
});

export type IWaitlistFormSchema = z.infer<typeof WaitlistFormSchema>;

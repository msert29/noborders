'use server';

import { WaitlistFormSchema } from '@/app/schemas/waitlist.schema';
import prisma from '@/lib/prisma';

export async function submitJoinWaitlist(email: string) {
  const result = WaitlistFormSchema.safeParse({ email });
  if (result.success) {
    const existingWaitlistUser = await prisma.waitlist.findUnique({
      where: {
        email: email,
      },
    });

    // Prevent duplicate entries and just mark a safe operation as successful
    if (existingWaitlistUser) {
      return { ok: true };
    }

    await prisma.waitlist.create({
      data: {
        email: email,
      },
    });

    return {
      ok: true,
    };
  } else {
    console.log('Failed to submit to waitlist', result.error.format());
    return {
      ok: false,
      errors: result.error.format(),
    };
  }
}

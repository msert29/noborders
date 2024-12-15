'use client';

import {
  WaitlistFormSchema,
  IWaitlistFormSchema,
} from '@/app/schemas/waitlist.schema';
import { submitJoinWaitlist } from '@/app/actions/submitJoinWaitlist';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from 'lucide-react';
import { useState } from 'react';

function Errors(props: { errors?: string[] }) {
  if (!props.errors?.length) return null;
  return (
    <div className="d-flex justify-center items-center content-center text-red-800">
      {props.errors.map((err) => (
        <p>{err}</p>
      ))}
    </div>
  );
}

export default function Hero() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWaitlistFormSchema>({
    resolver: zodResolver(WaitlistFormSchema),
  });

  const [inProgress, setInProgress] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(false);

  const onSubmit = async (data: IWaitlistFormSchema) => {
    setInProgress(true);
    try {
      const submission = await submitJoinWaitlist(data.email);

      if (submission.ok) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setInProgress(false);
    } catch (err) {
      console.error('An error occurred:', err);
      setSuccess(false);
      setInProgress(false);
    }
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 text-transparent bg-clip-text">
            Predict your visa outcome with AI precision
          </h1>
          <p className="text-xl mb-12 text-gray-400">
            Advanced AI-powered predictions for the UK and Schengen tourist visa
            applications.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email..."
              {...register('email')}
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
              required
            />
            <Errors
              errors={
                errors?.email?.message ? [errors.email.message] : undefined
              }
            />
            {inProgress && (
              <div className="d-flex justify-center items-center content-center">
                <Loader />
              </div>
            )}
            {!inProgress && (
              <button
                type="submit"
                className="text-white d-flex justify-center items-center
              [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border relative px-8 py-3 bg-white rounded-lg leading-none flex divide-x divide-gray-600"
              >
                Join waitlist
              </button>
            )}
          </form>
          {success && (
            <p className="pt-5 text-green-700">
              Thanks for joining our waitlist, you will receive updates once we
              launch 🚀{' '}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

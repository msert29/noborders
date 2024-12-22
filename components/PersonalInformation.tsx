'use client';
import {
  COUNTRIES,
  APPLYING_FOR_COUNTRY_LIST,
  EMPLOYEMENT_STATUS_LIST,
  CURRENCY_LIST,
  GENDER_LIST,
} from '@/lib/static-data';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { personalInformationSchema } from '@/lib/schemas';
import { PersonalInformationType } from '@/lib/types';
import { Button } from '@/components/ui/button';

export const PersonalInformation: React.FC<{
  formData: PersonalInformationType;
  setPersonalInformationAction: (
    data: z.infer<typeof personalInformationSchema>,
  ) => void;
}> = ({ formData, setPersonalInformationAction }) => {
  const form = useForm<z.infer<typeof personalInformationSchema>>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      visaCountry: formData?.visaCountry || '',
      name: formData?.name || '',
      gender: formData?.gender || '',
      age: formData?.age || '',
      address: formData?.address || '',
      nationality: formData?.nationality || '',
    },
  });

  function onSubmit(values: z.infer<typeof personalInformationSchema>) {
    console.log(values);
    setPersonalInformationAction(values);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Personal information
          </h4>
          <FormField
            control={form.control}
            name="visaCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which country are you applying for? *</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLYING_FOR_COUNTRY_LIST.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your nationality? *</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_LIST.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input
                    max={150}
                    min={0}
                    type="number"
                    {...field}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === '' ? '' : event.target.value,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address details</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end ">
            <Button className="w-full md:w-1/6" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

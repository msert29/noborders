'use client';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  COUNTRIES,
  APPLYING_FOR_COUNTRY_LIST,
  GENDER_LIST,
} from '@/lib/static-data';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { personalInformationSchema } from '@/lib/schemas';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const PersonalInformation: React.FC<{
  setPersonalInformationAction: (
    data: z.infer<typeof personalInformationSchema>,
  ) => void;
  dictionary: Dictionary;
}> = ({ setPersonalInformationAction, dictionary }) => {
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof personalInformationSchema>>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      visaCountry: searchParams?.get('visaCountry') || '',
      name: searchParams?.get('name') || '',
      gender: searchParams?.get('gender') || '',
      age: searchParams?.get('age') || '',
      address: searchParams?.get('address') || '',
      nationality: searchParams?.get('nationality') || '',
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
            {dictionary.userJourney.personalInformation.title}
          </h4>
          <FormField
            control={form.control}
            name="visaCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {dictionary.userJourney.personalInformation.applyingFor}
                </FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          dictionary.userJourney.personalInformation
                            .applyingForPlaceholder
                        }
                      />
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
                <FormLabel>
                  {dictionary.userJourney.personalInformation.nationality}
                </FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          dictionary.userJourney.personalInformation
                            .nationalityPlaceholder
                        }
                      />
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
                <FormLabel>
                  {dictionary.userJourney.personalInformation.fullName}
                </FormLabel>
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
                <FormLabel>
                  {dictionary.userJourney.personalInformation.gender}
                </FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          dictionary.userJourney.personalInformation
                            .genderPlaceholder
                        }
                      />
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
                <FormLabel>
                  {dictionary.userJourney.personalInformation.age}
                </FormLabel>
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
                <FormLabel>
                  {dictionary.userJourney.personalInformation.address}
                </FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="previous_visa_from_uk_eu_us"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    {
                      dictionary.userJourney.personalInformation
                        .previousApproval
                    }
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="previous_rejection_from_uk_eu_us"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>
                    {
                      dictionary.userJourney.personalInformation
                        .previousRejection
                    }
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end ">
            <Button className="w-full md:w-1/6" type="submit">
              {dictionary.userJourney.next}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

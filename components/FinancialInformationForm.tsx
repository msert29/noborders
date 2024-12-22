'use client';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { EMPLOYEMENT_STATUS_LIST, CURRENCY_LIST } from '@/lib/static-data';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { financialInformationSchema } from '@/lib/schemas';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FinancialInformationType } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const FinancialInformation: React.FC<{
  goPreviousAction: () => void;
  formData: FinancialInformationType;
  setFinancialInformationAction: (
    data: z.infer<typeof financialInformationSchema>,
  ) => void;
}> = ({ goPreviousAction, formData, setFinancialInformationAction }) => {
  const form = useForm<z.infer<typeof financialInformationSchema>>({
    resolver: zodResolver(financialInformationSchema),
    defaultValues: {
      employmentType: formData?.employmentType || '',
      currency: formData?.currency || '',
      income: formData?.income || '',
      expenditure: formData?.expenditure || '',
      savings: formData?.savings || '',
      fromDate: formData?.fromDate || undefined,
      toDate: formData?.toDate || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof financialInformationSchema>) {
    setFinancialInformationAction(values);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Financial Information
          </h4>
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment type*</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEMENT_STATUS_LIST.map((workType) => (
                        <SelectItem key={workType} value={workType}>
                          {workType}
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select your currency*</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_LIST.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Please convert from your local currency to available
                  currencies
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your monthly Gross income*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2,500"
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
            name="expenditure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your monthly expenditure*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1,500"
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
            name="savings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have any savings?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10,000"
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
            name="fromDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of entry*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'yyyy-MM-dd')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date.getTime() < new Date().setHours(0, 0, 0, 0)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Date of entry to the destination country.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of departure*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'yyyy-MM-dd')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date.getTime() < new Date().setHours(0, 0, 0, 0)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Date of departure from the destination country.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between md:flex-row gap-4 md:justify-end">
            <Button
              className="w-full md:w-1/6"
              variant="outline"
              onClick={goPreviousAction}
            >
              Back
            </Button>
            <Button className="w-full md:w-1/6" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

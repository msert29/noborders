'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import AIProgressDialog from '@/components/AIProgressDialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { zodResolver } from '@hookform/resolvers/zod';
import { FILE_UPLOAD_TYPE } from '@/lib/static-data';
import { fileUploadSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { X, Upload, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import { z } from 'zod';

type UploadFilesProps = {
  onUploadAction: (
    files: Array<{ file: File; documentType: string }>,
  ) => Promise<void>;
  goPreviousAction: () => void;
  dictionary: Dictionary;
};

const FileUpload = ({
  onUploadAction,
  goPreviousAction,
  dictionary,
}: UploadFilesProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof fileUploadSchema>>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      files: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'files',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      append({ documentType: '', file });
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        append({ documentType: '', file });
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof fileUploadSchema>) => {
    try {
      setIsUploading(true);
      await onUploadAction(values.files);
      form.reset();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">
                {dictionary.userJourney.uploadDocuments.dragAndDrop}
              </p>
              <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                {dictionary.userJourney.uploadDocuments.chooseFile}
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {dictionary.userJourney.uploadDocuments.supportedFormat}
              </p>
              <p className="text-sm text-gray-500">Maximum size: 25MB</p>
              <p className="text-sm text-black font-bold">
                {dictionary.userJourney.uploadDocuments.minimumUpload}
              </p>
            </div>
          </div>

          {fields.length > 0 && (
            <div className="p-6">
              <h3 className="font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <File className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        {form.getValues(`files.${index}.file`)?.name}
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name={`files.${index}.documentType`}
                      render={({ field }) => (
                        <FormItem className="flex-shrink-0">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {FILE_UPLOAD_TYPE.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-between md:flex-row gap-4 md:justify-end">
            <Button
              className="w-full md:w-1/6"
              variant="outline"
              onClick={goPreviousAction}
            >
              {dictionary.userJourney.back}
            </Button>
            {fields.length >= 5 && (
              <Button type="submit" className="w-full md:w-1/6">
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            )}
          </div>
        </form>
        {isUploading && <AIProgressDialog dictionary={dictionary} />}
      </Form>
    </Card>
  );
};

export default FileUpload;

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FILE_UPLOAD_TYPE } from '@/lib/static-data';
import { fileUploadSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { X, Upload, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { z } from 'zod';

type UploadFilesProps = {
  onUploadAction: (
    files: Array<{ file: File; documentType: string }>,
  ) => Promise<void>;
};

const FileUpload = ({ onUploadAction }: UploadFilesProps) => {
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
      console.log(values);
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
              <p className="text-lg mb-2">Drag and Drop file here or</p>
              <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                Choose file
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Supported formats: PDF, JPEG, PNG, JPG
              </p>
              <p className="text-sm text-gray-500">Maximum size: 25MB</p>
              <p className="text-sm text-black font-bold">
                Upload at least 5 files to continue
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

          {fields.length > 0 && (
            <div className="flex justify-end gap-4">
              {fields.length >= 5 && (
                <Button type="submit">
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default FileUpload;

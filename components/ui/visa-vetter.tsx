'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type DocumentCategory = {
  id: string;
  label: string;
  acceptedTypes?: string;
};

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'passport',
    label: 'Passport',
    acceptedTypes: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'photo',
    label: 'Passport Photo',
    acceptedTypes: '.jpg,.jpeg,.png',
  },
  {
    id: 'bank_statement',
    label: 'Bank Statement',
    acceptedTypes: '.pdf',
  },
  {
    id: 'employment_letter',
    label: 'Employment Letter',
    acceptedTypes: '.pdf',
  },
  {
    id: 'travel_itinerary',
    label: 'Travel Itinerary',
    acceptedTypes: '.pdf',
  },
  {
    id: 'accommodation',
    label: 'Accommodation Proof',
    acceptedTypes: '.pdf',
  },
  {
    id: 'marriage_cert',
    label: 'Marriage Certificate',
    acceptedTypes: '.pdf',
  },
  {
    id: 'birth_cert',
    label: 'Birth Certificate',
    acceptedTypes: '.pdf',
  },
  {
    id: 'other',
    label: 'Other Supporting Document',
    acceptedTypes: '.pdf,.jpg,.jpeg,.png',
  },
];

export default function VisaVetter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const selectedCategoryData = DOCUMENT_CATEGORIES.find(
    (cat) => cat.id === selectedCategory,
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (
      selectedCategory &&
      selectedCategoryData?.acceptedTypes &&
      !selectedCategoryData.acceptedTypes.includes(fileType)
    ) {
      setError(
        `Invalid file type. Accepted types: ${selectedCategoryData.acceptedTypes}`,
      );
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setError('');
    // Clear file if it doesn't match new category's accepted types
    if (selectedFile) {
      const fileType = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
      const category = DOCUMENT_CATEGORIES.find((cat) => cat.id === value);
      if (
        category?.acceptedTypes &&
        !category.acceptedTypes.includes(fileType)
      ) {
        setSelectedFile(null);
        setError(`Please select a file with type: ${category.acceptedTypes}`);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      setError('Please select both a file and a document category');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', selectedCategory);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSelectedFile(null);
      setSelectedCategory('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to upload document',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Visa Document Upload</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                {selectedCategoryData?.acceptedTypes
                  ? `Accepted formats: ${selectedCategoryData.acceptedTypes}`
                  : 'Please select a document category first'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center justify-center w-full">
                      <Label
                        htmlFor="dropzone-file"
                        className={cn(
                          'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100',
                          error && 'border-red-500',
                        )}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Maximum file size: 10MB
                          </p>
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept={selectedCategoryData?.acceptedTypes}
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              </form>

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

              {selectedFile && (
                <div className="text-sm text-muted-foreground mt-4">
                  Selected file: {selectedFile.name}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedCategory || isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Card>
  );
}

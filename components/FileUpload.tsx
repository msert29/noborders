'use client';
import { Upload, X, FileImage, File, HelpCircle, Check } from 'lucide-react';
import React, { useState, useCallback, ChangeEvent } from 'react';
import { financialInformationSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { z } from 'zod';

type FileWithProgress = {
  file: File;
  id: string;
  progress: number;
  previewUrl?: string;
  isComplete?: boolean;
  documentType?: string;
};

type AcceptedFileType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/jpg'
  | 'application/pdf';

const DOCUMENT_TYPES = [
  'Passport',
  'Passport Photo',
  'Bank Statement',
  'Employment Letter',
  'Travel Itinerary',
  'Accommodation Proof',
  'Marriage Certificate',
  'Birth Certificate',
  'Other Supporting Document',
];

const ACCEPTED_TYPES: AcceptedFileType[] = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

const FileUpload: React.FC<{
  goPreviousAction: () => void;
  onSubmitAction: () => void;
}> = ({ goPreviousAction, onSubmitAction }) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type as AcceptedFileType)) {
      setError(
        'File type not supported. Please upload PDF or image files (JPEG, PNG, JPG)',
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 25MB limit');
      return false;
    }

    return true;
  };

  const createPreviewUrl = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) return undefined;
    return URL.createObjectURL(file);
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    const previewUrl = await createPreviewUrl(file);
    const newFile: FileWithProgress = {
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      previewUrl,
      isComplete: false,
    };

    setFiles((prev) => [...prev, newFile]);
    simulateUpload(newFile.id);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    for (const file of droppedFiles) {
      await processFile(file);
    }
  }, []);

  const simulateUpload = (fileId: string): void => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: Math.min(progress, 100),
                isComplete: progress >= 100,
              }
            : file,
        ),
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    for (const file of selectedFiles) {
      await processFile(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== fileId);
      // Clean up preview URLs
      prev.forEach((file) => {
        if (file.id === fileId && file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      return updatedFiles;
    });
  };

  const getFileIcon = (fileType: string) => {
    return fileType.startsWith('image/') ? FileImage : File;
  };

  const handleDocumentTypeChange = (fileId: string, type: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, documentType: type } : file,
      ),
    );
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Upload file</h1>

        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out relative ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600 text-center">
              Drag and Drop file here or{' '}
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                Choose file
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  multiple
                />
              </label>
            </p>
          </div>
        </div>

        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

        <div className="mt-4 text-sm text-gray-500">
          <span>Supported formats: PDF, JPEG, PNG, JPG</span>
          <span className="float-right">Maximum size: 25MB</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg border p-4 relative"
            >
              <div className="flex items-center gap-3">
                {file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  React.createElement(getFileIcon(file.file.type), {
                    className: 'w-6 h-6 text-blue-600',
                  })
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{file.file.name}</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ease-out ${
                        file.isComplete ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  {file.isComplete && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Upload complete</span>
                      </div>
                      <div className="flex-1">
                        <select
                          value={file.documentType || ''}
                          onChange={(e) =>
                            handleDocumentTypeChange(file.id, e.target.value)
                          }
                          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Select document type
                          </option>
                          {DOCUMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end items-center">
        <div className="space-x-3">
          <Button variant="outline" onClick={goPreviousAction}>
            Back
          </Button>
          <Button>View predictions</Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

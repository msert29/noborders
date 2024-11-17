'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud } from 'lucide-react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface AnalysisResponse {
    notablePoints: string;
    impressions: string;
    decision: string;
    fullText: string;
}

const processDocuments = async (documents: File[]): Promise<AnalysisResponse> => {
    try {
        const formData = new FormData();
        documents.forEach(doc => {
            formData.append('documents', doc);
        });

        const response = await fetch('/api/process-documents', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to process documents');
        }

        if (!data.fullText) {
            throw new Error('No response text received');
        }

        return data;
    } catch (error) {
        console.error('Error processing documents:', error);
        throw error;
    }
}

export default function VisaVetter() {
    const [documents, setDocuments] = useState<File[]>([])
    const [response, setResponse] = useState<AnalysisResponse | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showFullText, setShowFullText] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setDocuments(Array.from(event.target.files))
        }
    }

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault()
        if (documents.length === 0) return

        setIsProcessing(true)
        try {
            const result = await processDocuments(documents)
            setResponse(result)
        } catch (error) {
            setResponse(null)
            console.error(`Error: ${error.message || 'An unknown error occurred'}`)
        } finally {
            setIsProcessing(false)
        }
    }, [documents])

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Visa Application Vetter</CardTitle>
                <CardDescription>Upload your visa-related documents for verification</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="documents">Upload Documents</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, or images (MAX. 10MB)</p>
                                    </div>
                                    <Input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </Label>
                            </div>
                        </div>
                        {documents.length > 0 && (
                            <div className="text-sm text-gray-500">
                                {documents.length} file(s) selected
                            </div>
                        )}
                        <Button type="submit" disabled={isProcessing || documents.length === 0}>
                            {isProcessing ? "Processing..." : "Analyze Documents"}
                        </Button>
                    </div>
                </form>
                {response && (
                    <div className="mt-4 space-y-4">
                        {/* Decision Section */}
                        <div className="rounded-lg border bg-green-50 p-4">
                            <h3 className="font-semibold text-green-900 mb-2">Decision</h3>
                            <div className="text-sm prose prose-sm max-w-none text-green-800">
                                {response.decision}
                            </div>
                        </div>

                        {/* Notable Points Section */}
                        <div className="rounded-lg border bg-blue-50 p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Notable Points</h3>
                            <ReactMarkdown className="text-sm prose prose-sm max-w-none text-blue-800">
                                {response.notablePoints}
                            </ReactMarkdown>
                        </div>

                        {/* Impressions Section */}
                        <div className="rounded-lg border bg-purple-50 p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">Impressions</h3>
                            <ReactMarkdown className="text-sm prose prose-sm max-w-none text-purple-800">
                                {response.impressions}
                            </ReactMarkdown>
                        </div>

                        {/* Full Text (Expandable) */}
                        <div className="rounded-lg border bg-gray-50">
                            <button
                                onClick={() => setShowFullText(!showFullText)}
                                className="w-full p-4 flex items-center justify-between text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-semibold">Full Analysis</h3>
                                {showFullText ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                            {showFullText && (
                                <div className="p-4 border-t">
                                    <div className="prose prose-sm max-w-none text-gray-800">
                                        {response.fullText}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
                Ensure all documents are legible and in the correct format
            </CardFooter>
        </Card>
    )
}

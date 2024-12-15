import type { AnalysisResponse } from './visa-vetter';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export function AnalysisResponse({
  decision,
  notablePoints,
  impressions,
  fullText,
}: AnalysisResponse) {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      {/* Decision Section */}
      <div className="rounded-lg border bg-green-50 p-4">
        <h3 className="font-semibold text-green-900 mb-2">Decision</h3>
        <div className="text-sm prose prose-sm max-w-none text-green-800">
          {decision}
        </div>
      </div>

      {/* Notable Points Section */}
      <div className="rounded-lg border bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Notable Points</h3>
        <ReactMarkdown className="text-sm prose prose-sm max-w-none text-blue-800">
          {notablePoints}
        </ReactMarkdown>
      </div>

      {/* Impressions Section */}
      <div className="rounded-lg border bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Impressions</h3>
        <ReactMarkdown className="text-sm prose prose-sm max-w-none text-purple-800">
          {impressions}
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
              {fullText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

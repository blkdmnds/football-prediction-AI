import React from 'react';

interface AiAnalysisProps {
  summary: string;
  keyFactors: string[];
  predictions: Record<string, string>;
}

export function AiAnalysis({ summary, keyFactors, predictions }: AiAnalysisProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow col-span-full">
      <h2 className="text-xl font-bold mb-2">AI Analysis</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Summary</h3>
          <p className="text-gray-700">{summary}</p>
        </div>
        <div>
          <h3 className="font-semibold">Key Factors</h3>
          <ul className="list-disc pl-4">
            {keyFactors.map((factor, index) => (
              <li key={index} className="text-gray-700">{factor}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">AI Predictions</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(predictions).map(([key, value]) => (
              <div key={key}>
                <p className="font-medium">{key}:</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

interface ConfidenceScoreProps {
  confidence: number;
}

export function ConfidenceScore({ confidence }: ConfidenceScoreProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Analysis Confidence</h2>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div 
            style={{ width: `${confidence * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
        <p className="text-center font-bold">{(confidence * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
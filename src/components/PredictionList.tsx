import React from 'react';
import { PredictionResult } from '../types/prediction';
import { PredictionCard } from './PredictionCard';

interface PredictionListProps {
  predictions: PredictionResult[];
}

export function PredictionList({ predictions }: PredictionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {predictions.map((prediction) => (
        <PredictionCard key={prediction.match.id} prediction={prediction} />
      ))}
    </div>
  );
}
import React from 'react';
import { format } from 'date-fns';
import { PredictionResult } from '../types/prediction';
import { Trophy, Scale, Goal, Percent } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const { match, predictions, confidence } = prediction;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{match.competition}</h3>
          <p className="text-gray-500">{format(match.date, 'PPP')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">{match.homeTeam}</span>
        <span className="text-gray-500">vs</span>
        <span className="text-lg font-medium">{match.awayTeam}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-green-500" />
          <span className="text-sm">
            Win: {(predictions.homeWin * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Goal className="w-4 h-4 text-orange-500" />
          <span className="text-sm">
            BTTS: {(predictions.btts * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-purple-500" />
          <span className="text-sm">
            O2.5: {(predictions.over25 * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
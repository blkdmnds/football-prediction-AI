import React from 'react';
import { Match } from '../types/matches';
import { format } from 'date-fns';

interface MatchPredictionProps {
  match: Match;
  prediction: {
    homeWin: number;
    awayWin: number;
    draw: number;
    btts: number;
    over25: number;
  };
}

export function MatchPrediction({ match, prediction }: MatchPredictionProps) {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="text-sm text-gray-500">{format(match.date, 'PPP p')}</div>
        <div className="text-lg font-semibold">{match.competition}</div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-900 font-medium">{match.homeTeam}</div>
        <div className="text-gray-500 px-4">vs</div>
        <div className="text-gray-900 font-medium">{match.awayTeam}</div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="font-medium text-blue-600">{formatPercentage(prediction.homeWin)}</div>
            <div className="text-gray-500">Home Win</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">{formatPercentage(prediction.draw)}</div>
            <div className="text-gray-500">Draw</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-600">{formatPercentage(prediction.awayWin)}</div>
            <div className="text-gray-500">Away Win</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center">
            <div className="font-medium text-purple-600">{formatPercentage(prediction.btts)}</div>
            <div className="text-gray-500">Both Teams to Score</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-orange-600">{formatPercentage(prediction.over25)}</div>
            <div className="text-gray-500">Over 2.5 Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
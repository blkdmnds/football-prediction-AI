import React from 'react';

interface MatchPredictionsProps {
  matchResult: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  goalsMarkets: {
    over25: number;
    btts: number;
  };
}

export function MatchPredictions({ matchResult, goalsMarkets }: MatchPredictionsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Match Predictions</h2>
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold">Match Result</h3>
          <p>Home Win: {(matchResult.homeWin * 100).toFixed(1)}%</p>
          <p>Draw: {(matchResult.draw * 100).toFixed(1)}%</p>
          <p>Away Win: {(matchResult.awayWin * 100).toFixed(1)}%</p>
        </div>
        <div>
          <h3 className="font-semibold">Goals Markets</h3>
          <p>Over 2.5: {(goalsMarkets.over25 * 100).toFixed(1)}%</p>
          <p>BTTS: {(goalsMarkets.btts * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

interface Bet {
  type: string;
  selection: string;
  confidence: number;
  riskRating: number;
}

interface RecommendedBetsProps {
  bets: Bet[];
}

export function RecommendedBets({ bets }: RecommendedBetsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Recommended Bets</h2>
      <div className="space-y-2">
        {bets.map((bet, index) => (
          <div key={index} className="border-b pb-2">
            <h3 className="font-semibold">{bet.type}</h3>
            <p>Selection: {bet.selection}</p>
            <p>Confidence: {bet.confidence}%</p>
            <p className="text-sm text-gray-600">Risk Level: {bet.riskRating}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
}
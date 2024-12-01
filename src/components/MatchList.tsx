import React from 'react';
import { Match } from '../types/matches';
import { format } from 'date-fns';

interface MatchListProps {
  matches: Match[];
}

export function MatchList({ matches }: MatchListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-500 mb-2">
            {format(match.date, 'PPP p')}
          </div>
          <div className="text-lg font-semibold mb-2">{match.competition}</div>
          <div className="flex justify-between items-center">
            <div className="text-gray-900">{match.homeTeam}</div>
            <div className="text-gray-500 px-2">vs</div>
            <div className="text-gray-900">{match.awayTeam}</div>
          </div>
          {match.status === 'FINISHED' && match.score && (
            <div className="mt-2 text-center font-semibold">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500 text-center">
            {match.status}
          </div>
        </div>
      ))}
    </div>
  );
}
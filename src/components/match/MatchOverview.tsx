import React from 'react';
import { format } from 'date-fns';

interface MatchOverviewProps {
  match: string;
  competition: string;
  date: Date;
  venue: string;
}

export function MatchOverview({ match, competition, date, venue }: MatchOverviewProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Match Overview</h2>
      <div className="space-y-2">
        <p><strong>Teams:</strong> {match}</p>
        <p><strong>Competition:</strong> {competition}</p>
        <p><strong>Date:</strong> {format(date, 'PPP')}</p>
        <p><strong>Venue:</strong> {venue}</p>
      </div>
    </div>
  );
}
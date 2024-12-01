import React from 'react';
import { format } from 'date-fns';
import { Match } from '../types/prediction';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{match.competition}</h3>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <p>{format(match.date, 'PPP p')}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">{match.homeTeam}</span>
        <span className="text-gray-500 px-4">vs</span>
        <span className="text-lg font-medium">{match.awayTeam}</span>
      </div>

      <Link 
        to={`/analysis/${match.id}`}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        View Analysis
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
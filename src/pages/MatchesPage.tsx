import React, { useEffect, useState } from 'react';
import { Match } from '../types/matches';
import { MatchList } from '../components/MatchList';
import { fetchUpcomingMatches } from '../services/matchService';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { addDays } from 'date-fns';
import { CompetitionSelector } from '../components/CompetitionSelector';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { API_CONFIG } from '../config/api';

export function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState(API_CONFIG.SUPPORTED_COMPETITIONS[0].id);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 7),
  });

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUpcomingMatches();
        setMatches(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load matches');
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [dateRange, selectedCompetition]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;

  const filteredMatches = matches.filter(
    match => match.competition === API_CONFIG.SUPPORTED_COMPETITIONS.find(c => c.id === selectedCompetition)?.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Football Matches</h1>
      
      <CompetitionSelector
        selectedCompetition={selectedCompetition}
        onChange={setSelectedCompetition}
      />
      
      <DateRangeSelector
        startDate={dateRange.start}
        endDate={dateRange.end}
        onStartDateChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
        onEndDateChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
      />

      {filteredMatches.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-700">
          No matches scheduled for this period.
        </div>
      ) : (
        <MatchList matches={filteredMatches} />
      )}
    </div>
  );
}
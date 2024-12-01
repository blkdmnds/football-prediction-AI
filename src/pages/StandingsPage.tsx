import React, { useEffect, useState } from 'react';
import { LeagueStandings } from '../components/LeagueStandings';
import { fetchLeagueStandings } from '../services/standingsService';
import { API_CONFIG } from '../config/api';
import { LoadingState } from '../components/LoadingState';
import { LeagueStandings as LeagueStandingsType } from '../types/standings';

export function StandingsPage() {
  const [standings, setStandings] = useState<LeagueStandingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState(API_CONFIG.SUPPORTED_COMPETITIONS[0].id);

  useEffect(() => {
    async function loadStandings() {
      setLoading(true);
      const response = await fetchLeagueStandings(selectedLeague);
      
      if (response.error) {
        setError(response.error);
      } else {
        setStandings(response.standings);
      }
      setLoading(false);
    }

    loadStandings();
  }, [selectedLeague]);

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!standings) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <label htmlFor="league" className="block text-sm font-medium text-gray-700">
          Select League
        </label>
        <select
          id="league"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          {API_CONFIG.SUPPORTED_COMPETITIONS.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name}
            </option>
          ))}
        </select>
      </div>

      {standings.standings[0]?.table && (
        <LeagueStandings
          standings={standings.standings[0].table}
          competitionName={standings.competition.name}
        />
      )}
    </div>
  );
}
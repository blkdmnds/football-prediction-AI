import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Table } from 'lucide-react';
import { InfoSection } from '../components/InfoSection';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Match } from '../types/matches';
import { fetchUpcomingMatches, ApiError } from '../services/api';

export function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);
        const upcomingMatches = await fetchUpcomingMatches();
        setMatches(upcomingMatches);
      } catch (err) {
        const errorMessage = err instanceof ApiError 
          ? err.message 
          : 'An unexpected error occurred. Please try again later.';
        setError(errorMessage);
        console.error('Error loading matches:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <InfoSection />

      <div className="grid gap-8 md:grid-cols-3">
        <Link
          to="/matches"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Calendar className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upcoming Matches</h2>
          <p className="text-gray-600">
            {matches.length} matches scheduled
          </p>
        </Link>

        <Link
          to="/standings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Table className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">League Standings</h2>
          <p className="text-gray-600">
            View current standings across major leagues
          </p>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Activity className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Match Analysis</h2>
          <p className="text-gray-600">
            AI-powered predictions and statistics
          </p>
        </div>
      </div>
    </div>
  );
}
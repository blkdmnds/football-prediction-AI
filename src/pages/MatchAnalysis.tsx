import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HistoricalData, Match } from '../types/prediction';
import { fetchHistoricalData } from '../services/dataService';
import { LoadingState } from '../components/LoadingState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { subMonths } from 'date-fns';

interface TeamStats {
  team: string;
  form: { date: Date; performance: number }[];
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

export function MatchAnalysis() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const endDate = new Date();
        const startDate = subMonths(endDate, 6);
        const data = await fetchHistoricalData(startDate, endDate);
        setHistoricalData(data);
        // TODO: Fetch specific match details using id
      } catch (err) {
        setError('Failed to load match analysis data.');
        console.error('Error loading analysis:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!match) return <div>Match not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Match Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Form</h3>
          <LineChart width={500} height={300} data={[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="performance" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Head to Head</h3>
          {/* Add head to head statistics */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Team Statistics</h3>
          {/* Add team statistics */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Predictions</h3>
          {/* Add predictions */}
        </div>
      </div>
    </div>
  );
}
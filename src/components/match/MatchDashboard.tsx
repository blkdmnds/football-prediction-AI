import React, { useState, useEffect } from 'react';
import { analyzeMatch } from '../../services/analysisService';
import { Match } from '../../types/matches';
import { MatchOverview } from './MatchOverview';
import { MatchPredictions } from './MatchPredictions';
import { RecommendedBets } from './RecommendedBets';
import { AiAnalysis } from './AiAnalysis';
import { ConfidenceScore } from './ConfidenceScore';
import { LoadingState } from '../LoadingState';
import { ErrorMessage } from '../ErrorMessage';

interface MatchDashboardProps {
  match: Match;
}

export function MatchDashboard({ match }: MatchDashboardProps) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        setError(null);
        const result = await analyzeMatch(match);
        setAnalysis(result);
      } catch (err) {
        setError('Failed to analyze match data');
        console.error('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [match]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MatchOverview {...analysis.matchOverview} />
      <MatchPredictions {...analysis.predictions} />
      <RecommendedBets bets={analysis.recommendedBets} />
      <AiAnalysis 
        summary={analysis.aiAnalysis.summary}
        keyFactors={analysis.aiAnalysis.keyFactors}
        predictions={analysis.predictions.aiPredictions}
      />
      <ConfidenceScore confidence={analysis.confidence} />
    </div>
  );
}
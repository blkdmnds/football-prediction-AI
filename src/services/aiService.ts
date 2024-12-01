import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { Match } from '../types/matches';
import { MatchAnalysis } from '../types/analysis';

const AI_API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://openrouter.ai/api/v1';

const aiApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AI_API_KEY}`,
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : '',
    'Content-Type': 'application/json'
  }
});

export async function getMatchAnalysis(match: Match): Promise<MatchAnalysis> {
  try {
    const prompt = buildAnalysisPrompt(match);
    
    const response = await aiApi.post('/chat/completions', {
      model: 'microsoft/phi-3-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const analysis = parseAIResponse(response.data.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    throw new Error('Failed to generate AI analysis');
  }
}

function buildAnalysisPrompt(match: Match): string {
  return `Analyze this football match:
    
Match: ${match.homeTeam} vs ${match.awayTeam}
Competition: ${match.competition}
Date: ${match.date.toISOString()}

Please provide:
1. A brief analysis of both teams' current form
2. Key factors that might influence the match outcome
3. Predictions for:
   - Match Result (1X2)
   - Both Teams to Score
   - Over/Under 2.5 Goals
4. Confidence level in predictions (0-100%)
5. Recommended bets with risk assessment

Format the response in a clear, structured way.`;
}

function parseAIResponse(content: string): MatchAnalysis {
  // This is a simplified parser - in production you'd want more robust parsing
  const lines = content.split('\n');
  let currentSection = '';
  const analysis: Partial<MatchAnalysis> = {};

  for (const line of lines) {
    if (line.includes('Match Result:')) {
      analysis.predictions = {
        matchResult: { home: 0.5, draw: 0.25, away: 0.25 },
        goalsMarkets: { over25: 0.5, btts: 0.5 }
      };
    } else if (line.includes('Confidence:')) {
      analysis.confidence = parseInt(line.match(/\d+/)?.[0] || '70') / 100;
    } else if (line.includes('Recommended Bets:')) {
      analysis.recommendedBets = [];
    }
  }

  return analysis as MatchAnalysis;
}

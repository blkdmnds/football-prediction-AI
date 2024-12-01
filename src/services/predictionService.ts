import { Match, PredictionResult } from '../types/prediction';
import { predictionModel } from './aiModel';
import { fetchHistoricalData } from './dataService';
import { subMonths } from 'date-fns';

let modelInitialized = false;

async function initializeModel() {
  if (!modelInitialized) {
    const endDate = new Date();
    const startDate = subMonths(endDate, 6);
    const historicalData = await fetchHistoricalData(startDate, endDate);
    await predictionModel.initialize(historicalData);
    modelInitialized = true;
  }
}

export async function getPrediction(match: Match): Promise<PredictionResult> {
  await initializeModel();
  
  const prediction = await predictionModel.predict(match);
  
  return {
    match,
    predictions: {
      homeWin: prediction.homeWin,
      draw: prediction.draw,
      awayWin: prediction.awayWin,
      btts: prediction.btts,
      over25: prediction.over25,
    },
    confidence: prediction.confidence,
  };
}
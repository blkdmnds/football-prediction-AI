import * as tf from '@tensorflow/tfjs';
import { Match, HistoricalData } from '../types/prediction';

interface ModelFeatures {
  homeTeamForm: number[];
  awayTeamForm: number[];
  homeTeamGoals: number[];
  awayTeamGoals: number[];
  headToHead: number[];
}

export class FootballPredictionModel {
  private model: tf.LayersModel | null = null;
  private historicalData: HistoricalData[] = [];

  async initialize(historicalData: HistoricalData[]) {
    this.historicalData = historicalData;
    await this.buildModel();
    await this.trainModel();
  }

  private async buildModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 5, activation: 'sigmoid' }) // Output: [homeWin, draw, awayWin, btts, over25]
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  private extractFeatures(match: Match): ModelFeatures {
    const homeTeamMatches = this.historicalData.filter(
      h => h.match.homeTeam === match.homeTeam || h.match.awayTeam === match.homeTeam
    ).slice(-5);

    const awayTeamMatches = this.historicalData.filter(
      h => h.match.homeTeam === match.awayTeam || h.match.awayTeam === match.awayTeam
    ).slice(-5);

    const headToHeadMatches = this.historicalData.filter(
      h => (h.match.homeTeam === match.homeTeam && h.match.awayTeam === match.awayTeam) ||
           (h.match.homeTeam === match.awayTeam && h.match.awayTeam === match.homeTeam)
    ).slice(-3);

    return {
      homeTeamForm: this.calculateForm(homeTeamMatches, match.homeTeam),
      awayTeamForm: this.calculateForm(awayTeamMatches, match.awayTeam),
      homeTeamGoals: this.calculateGoals(homeTeamMatches, match.homeTeam),
      awayTeamGoals: this.calculateGoals(awayTeamMatches, match.awayTeam),
      headToHead: this.calculateHeadToHead(headToHeadMatches, match.homeTeam)
    };
  }

  private calculateForm(matches: HistoricalData[], team: string): number[] {
    return matches.map(m => {
      const isHome = m.match.homeTeam === team;
      const won = isHome ? m.result.homeGoals > m.result.awayGoals : m.result.awayGoals > m.result.homeGoals;
      const drew = m.result.homeGoals === m.result.awayGoals;
      return won ? 1 : drew ? 0.5 : 0;
    });
  }

  private calculateGoals(matches: HistoricalData[], team: string): number[] {
    return matches.map(m => {
      const isHome = m.match.homeTeam === team;
      return isHome ? m.result.homeGoals : m.result.awayGoals;
    });
  }

  private calculateHeadToHead(matches: HistoricalData[], homeTeam: string): number[] {
    return matches.map(m => {
      const isHomeInOriginal = m.match.homeTeam === homeTeam;
      const homeWon = m.result.homeGoals > m.result.awayGoals;
      const drew = m.result.homeGoals === m.result.awayGoals;
      return isHomeInOriginal ? 
        (homeWon ? 1 : drew ? 0.5 : 0) : 
        (homeWon ? 0 : drew ? 0.5 : 1);
    });
  }

  private async trainModel() {
    if (!this.model) throw new Error('Model not initialized');

    const trainingData = this.historicalData.map(match => {
      const features = this.extractFeatures(match.match);
      const labels = [
        match.result.winner === 'home' ? 1 : 0,
        match.result.winner === 'draw' ? 1 : 0,
        match.result.winner === 'away' ? 1 : 0,
        (match.result.homeGoals > 0 && match.result.awayGoals > 0) ? 1 : 0,
        (match.result.homeGoals + match.result.awayGoals > 2.5) ? 1 : 0
      ];

      return { features, labels };
    });

    const xs = tf.tensor2d(
      trainingData.map(d => [
        ...d.features.homeTeamForm,
        ...d.features.awayTeamForm,
        ...d.features.homeTeamGoals,
        ...d.features.awayTeamGoals,
        ...d.features.headToHead
      ])
    );

    const ys = tf.tensor2d(trainingData.map(d => d.labels));

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true
    });

    xs.dispose();
    ys.dispose();
  }

  async predict(match: Match) {
    if (!this.model) throw new Error('Model not initialized');

    const features = this.extractFeatures(match);
    const input = tf.tensor2d([
      [
        ...features.homeTeamForm,
        ...features.awayTeamForm,
        ...features.homeTeamGoals,
        ...features.awayTeamGoals,
        ...features.headToHead
      ]
    ]);

    const prediction = await this.model.predict(input) as tf.Tensor;
    const [homeWin, draw, awayWin, btts, over25] = Array.from(await prediction.data());

    input.dispose();
    prediction.dispose();

    return {
      homeWin,
      draw,
      awayWin,
      btts,
      over25,
      confidence: Math.max(homeWin, draw, awayWin)
    };
  }
}

export const predictionModel = new FootballPredictionModel();
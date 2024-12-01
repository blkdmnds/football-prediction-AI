import React from 'react';
import { Info, Target, Zap, Database } from 'lucide-react';

export function InfoSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">About This Project</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        This project uses machine learning to predict football match outcomes. Our model analyzes historical data and provides predictions for various markets including match results, goals, and more.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-medium mb-1">Predictions</h3>
            <p className="text-sm text-gray-600">
              Match results (1X2), Both Teams to Score, Over/Under 2.5 goals
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-orange-500 mt-1" />
          <div>
            <h3 className="font-medium mb-1">AI Model</h3>
            <p className="text-sm text-gray-600">
              Trained on historical match data using advanced machine learning algorithms
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h3 className="font-medium mb-1">Data Sources</h3>
            <p className="text-sm text-gray-600">
              Real-time data from major European leagues via football-data.org API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
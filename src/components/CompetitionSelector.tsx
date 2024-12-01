import React from 'react';
import { API_CONFIG } from '../config/api';

interface CompetitionSelectorProps {
  selectedCompetition: string;
  onChange: (competitionId: string) => void;
}

export function CompetitionSelector({ selectedCompetition, onChange }: CompetitionSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="competition" className="block text-sm font-medium text-gray-700">
        Select Competition
      </label>
      <select
        id="competition"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={selectedCompetition}
        onChange={(e) => onChange(e.target.value)}
      >
        {API_CONFIG.SUPPORTED_COMPETITIONS.map((competition) => (
          <option key={competition.id} value={competition.id}>
            {competition.name}
          </option>
        ))}
      </select>
    </div>
  );
}
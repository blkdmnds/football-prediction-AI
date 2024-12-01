import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              AI Football Predictions
            </h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/matches" className="text-gray-600 hover:text-gray-900">
              Matches
            </Link>
            <Link to="/standings" className="text-gray-600 hover:text-gray-900">
              Standings
            </Link>
            <a
              href="https://github.com/yourusername/ai-football-predictions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
import requests
import json
from datetime import datetime, timedelta

API_URL = 'https://api.football-data.org/v4'
API_KEY = 'YOUR_API_KEY'

def fetch_matches(date_from=None, date_to=None):
    headers = {'X-Auth-Token': API_KEY}
    params = {}
    
    if date_from:
        params['dateFrom'] = date_from
    if date_to:
        params['dateTo'] = date_to
        
    try:
        response = requests.get(f'{API_URL}/matches', headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching matches: {e}')
        return None

def process_matches(matches_data):
    if not matches_data or 'matches' not in matches_data:
        return []
        
    processed_matches = []
    
    for match in matches_data['matches']:
        # Basic match information
        processed_match = {
            'id': str(match['id']),
            'competition': match['competition']['name'],
            'homeTeam': match['homeTeam']['name'],
            'awayTeam': match['awayTeam']['name'],
            'date': match['utcDate'],
            'status': match['status']
        }
        
        # Add score if available
        if match['status'] == 'FINISHED' and match['score']['fullTime']:
            processed_match['score'] = {
                'home': match['score']['fullTime']['home'],
                'away': match['score']['fullTime']['away']
            }
            
        processed_matches.append(processed_match)
        
    return processed_matches

def main():
    # Fetch matches for next 7 days
    today = datetime.now()
    next_week = today + timedelta(days=7)
    
    date_from = today.strftime('%Y-%m-%d')
    date_to = next_week.strftime('%Y-%m-%d')
    
    matches_data = fetch_matches(date_from, date_to)
    
    if matches_data:
        processed_matches = process_matches(matches_data)
        
        # Save processed data
        with open('processed_matches.json', 'w') as f:
            json.dump(processed_matches, f, indent=2)
            
        print(f'Successfully processed {len(processed_matches)} matches')
    else:
        print('Failed to fetch matches data')

if __name__ == '__main__':
    main()

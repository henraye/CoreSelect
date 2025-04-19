from flask import Blueprint, jsonify, request
import openai
import os
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
import json

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

parts_api = Blueprint('parts_api', __name__)

def load_parts_data():
    data_dir = Path('data')
    parts_data = {}
    
    # List of part types and their corresponding CSV files
    part_files = {
        'motherboards': 'motherboards.csv',
        'cpus': 'cpus.csv',
        'memory': 'memory.csv',
        'storage': 'storage.csv',
        'gpus': 'gpus.csv',
        'cases': 'cases.csv',
        'cpu_coolers': 'cpu_coolers.csv',
        'case_fans': 'case_fans.csv',
        'psus': 'psus.csv'
    }
    
    # Load each CSV file into the parts_data dictionary
    for part_type, filename in part_files.items():
        file_path = data_dir / filename
        if file_path.exists():
            parts_data[part_type] = pd.read_csv(file_path).to_dict('records')
        else:
            print(f"Warning: {filename} not found in data directory")
            parts_data[part_type] = []
            
    return parts_data

@parts_api.route('/recommend', methods=['POST'])
def get_recommendation():
    try:
        data = request.get_json()
        budget = data.get('budget')
        priorities = data.get('priorities', [])
        want_to_play_games = data.get('wantToPlayGames', [])
        currently_playing_games = data.get('currentlyPlayingGames', [])

        if not budget:
            return jsonify({'error': 'Budget is required'}), 400

        # Load parts data from CSV files
        parts_data = load_parts_data()
        
        # Convert parts data to a format suitable for the OpenAI prompt
        parts_context = ""
        for part_type, parts in parts_data.items():
            parts_context += f"\n{part_type.upper()} OPTIONS:\n"
            for part in parts:
                parts_context += str(part) + "\n"

        # Create the prompt for OpenAI
        prompt = f"""Given the following user requirements and PC parts data, recommend the best PC build:

Budget: ${budget}

User Priorities (in order of importance):
{chr(10).join(f"{i+1}. {priority}" for i, priority in enumerate(priorities))}

Games they want to play:
{chr(10).join(f"- {game}" for game in want_to_play_games)}

Games they currently play:
{chr(10).join(f"- {game}" for game in currently_playing_games)}

Available PC Parts:
{parts_context}

IMPORTANT RULES:
1. CPU and motherboard must be compatible (same socket type). For AMD CPUs, the socket must match to motherboard sockets, specifically AM4 or AM5. For Intel CPUs, the socket must match to motherboard sockets, specifically LGA 1200 or LGA 1700.
2. RAM must match the motherboard's memory type (DDR4 or DDR5).
3. Keep the explanation simple and beginner-friendly.
4. Focus on explaining why each part is good for the user's needs.

Please recommend ONE specific part from each category that best matches the user's requirements while staying within their budget. Format your response as a JSON object with the following structure:
{{
    "motherboard": "exact name from list",
    "cpu": "exact name from list",
    "memory": "exact name from list",
    "storage": "exact name from list",
    "gpu": "exact name from list",
    "case": "exact name from list",
    "cpu_cooler": "exact name from list",
    "case_fans": "exact name from list",
    "psu": "exact name from list",
    "total_cost": total cost,
    "explanation": "Simple, beginner-friendly explanation of why these parts were chosen. Focus on what each part does and why it's good for their needs. Avoid technical jargon."
}}"""

        # Get recommendation from OpenAI
        print("Sending request to OpenAI with prompt:", prompt)
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": """You are a PC building expert who explains things simply. 
                You must:
                1. Ensure CPU and motherboard socket compatibility
                2. Match RAM type (DDR4/DDR5) with motherboard
                3. Keep explanations simple and beginner-friendly
                4. Focus on what each part does and why it's good for the user
                Respond with ONLY a valid JSON object containing the recommended parts."""},
                {"role": "user", "content": prompt}
            ]
        )

        # Parse the response
        recommendation = response.choices[0].message.content
        print("Received response from OpenAI:", recommendation)

        try:
            # Ensure the response is valid JSON before sending it back
            parsed_recommendation = json.loads(recommendation)
            
            # Validate that all required fields are present
            required_fields = ['motherboard', 'cpu', 'memory', 'storage', 'gpu', 'case', 'cpu_cooler', 'case_fans', 'psu', 'total_cost', 'explanation']
            missing_fields = [field for field in required_fields if field not in parsed_recommendation]
            
            if missing_fields:
                error_msg = f"Missing required fields in recommendation: {', '.join(missing_fields)}"
                print(error_msg)
                return jsonify({'error': error_msg}), 500
                
            return jsonify(parsed_recommendation), 200
        except json.JSONDecodeError as e:
            print("Failed to parse OpenAI response as JSON:", e)
            return jsonify({'error': 'Invalid response format from AI service'}), 500

    except Exception as e:
        print(f"Error in recommendation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@parts_api.route('/parts/<component_type>', methods=['GET'])
def get_component(component_type):
    try:
        parts_data = load_parts_data()
        if component_type not in parts_data:
            return jsonify({'error': 'Invalid component type'}), 400
        
        return jsonify(parts_data[component_type]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
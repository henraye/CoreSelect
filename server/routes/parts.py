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

def parse_openai_response(response):
    try:
        content = response.choices[0].message.content.strip()
        # Remove any markdown code block markers if present
        content = content.replace('```json', '').replace('```', '').strip()
        # Print the content for debugging
        print("Raw OpenAI response:", content)
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error parsing OpenAI response: {e}")
        print(f"Raw response content: {content}")
        raise

def load_component_data():
    data_dir = Path('data')
    components = {}
    
    files = {
        'cpu': 'cpu_final_dataset_complete.csv',
        'gpu': 'video_card_final_dataset_complete.csv',
        'ram': 'memory_final_dataset_complete.csv',
        'storage': 'internal_hard_drive_final_dataset_complete.csv',
        'motherboard': 'motherboard_final_dataset_complete.csv',
        'case': 'case_final_dataset_complete.csv',
        'cpu_cooler': 'cpu_cooler_final_dataset_complete.csv',
        'psu': 'power_supply_final_dataset_complete.csv'
    }
    
    for component, filename in files.items():
        file_path = data_dir / filename
        if file_path.exists():
            components[component] = pd.read_csv(file_path)
        else:
            print(f"Warning: {filename} not found")
            components[component] = pd.DataFrame()
            
    return components

@parts_api.route('/recommend', methods=['POST'])
def get_recommendation():
    try:
        data = request.get_json()
        budget = data.get('budget')
        priorities = data.get('priorities', [])
        
        # Load all component data
        components = load_component_data()
        
        # System prompt for the AI
        system_prompt = """You are an expert PC builder with deep knowledge of computer hardware.
        Your task is to create the optimal PC build based on the user's budget and requirements.
        
        Key guidelines:
        1. For high budgets (>$3000):
           - Choose the latest generation flagship CPU
           - Select the highest-tier current generation GPU
           - Use high-speed DDR5 RAM, minimum 32GB
           - Select premium cooling solutions
           
        2. For mid-range budgets ($1500-$3000):
           - Focus on balanced performance
           - Select current or previous generation high-performance parts
           - Ensure good CPU-GPU balance
           
        3. For budget builds (<$1500):
           - Maximize price-to-performance
           - Focus on essential components
           - Consider previous generation parts for better value
           
        4. Always ensure:
           - Components are compatible (CPU socket matches motherboard, etc.)
           - PSU has adequate wattage (add 200W buffer)
           - Case fits all components (check GPU length)
           - Cooling is appropriate for CPU TDP
           - Storage matches use case requirements"""

        # Main selection prompt
        selection_prompt = f"""Create the best possible PC build for a budget of ${budget}.
        User priorities: {', '.join(priorities)}
        Games to play: {', '.join(data.get('wantToPlayGames', []))}
        Current games: {', '.join(data.get('currentlyPlayingGames', []))}

        Available components:

        CPUs:
        {components['cpu'].to_string()}

        GPUs:
        {components['gpu'].to_string()}

        Motherboards:
        {components['motherboard'].to_string()}

        RAM:
        {components['ram'].to_string()}

        Storage:
        {components['storage'].to_string()}

        Cases:
        {components['case'].to_string()}

        CPU Coolers:
        {components['cpu_cooler'].to_string()}

        Power Supplies:
        {components['psu'].to_string()}

        This is a {'high-end' if budget >= 3000 else 'mid-range' if budget >= 1500 else 'budget'} build.
        
        For high-end builds:
        - Select the highest-tier current generation GPU available
        - Choose a matching high-performance CPU
        - Use high-speed DDR5 RAM, 32GB minimum
        - Include premium cooling solution
        - Select high-wattage PSU (1000W+)
        
        IMPORTANT: You must return a valid JSON object with EXACT keys and structure as shown below.
        Do not include any additional text or explanation outside the JSON object.
        The response must be a single JSON object that can be parsed by json.loads().
        
        Required JSON structure:
        {{
            "cpu": {{
                "name": "exact name from the CPU list",
                "price": numeric_price_value,
                "socket": "exact socket type"
            }},
            "gpu": {{
                "name": "exact name from the GPU list",
                "price": numeric_price_value
            }},
            "motherboard": {{
                "name": "exact name from the motherboard list",
                "price": numeric_price_value
            }},
            "ram": {{
                "name": "exact name from the RAM list",
                "price": numeric_price_value
            }},
            "storage": {{
                "name": "exact name from the storage list",
                "price": numeric_price_value
            }},
            "case": {{
                "name": "exact name from the case list",
                "price": numeric_price_value
            }},
            "cpu_cooler": {{
                "name": "exact name from the CPU cooler list",
                "price": numeric_price_value
            }},
            "psu": {{
                "name": "exact name from the PSU list",
                "price": numeric_price_value
            }},
            "explanation": "Detailed explanation of component choices and their synergy"
        }}"""

        # Get AI recommendation
        response = openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": selection_prompt}
            ],
            temperature=0.2,  # Lower temperature for more consistent formatting
            max_tokens=2000,
            response_format={"type": "json_object"}  # Force JSON response
        )
        
        build = parse_openai_response(response)
        
        # Calculate total cost
        total_cost = round(sum([
            build['cpu']['price'],
            build['gpu']['price'],
            build['motherboard']['price'],
            build['ram']['price'],
            build['storage']['price'],
            build['case']['price'],
            build['cpu_cooler']['price'],
            build['psu']['price']
        ]), 2)

        # Format final recommendation
        recommendation = {
            "cpu": build['cpu']['name'],
            "gpu": build['gpu']['name'],
            "motherboard": build['motherboard']['name'],
            "memory": build['ram']['name'],
            "storage": build['storage']['name'],
            "case": build['case']['name'],
            "cpu_cooler": build['cpu_cooler']['name'],
            "case_fans": "Included with case",
            "psu": build['psu']['name'],
            "total_cost": total_cost,
            "explanation": build['explanation']
        }

        return jsonify(recommendation), 200

    except Exception as e:
        print(f"Error in recommendation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@parts_api.route('/parts/<component_type>', methods=['GET'])
def get_component(component_type):
    try:
        components = load_component_data()
        if component_type not in components:
            return jsonify({'error': 'Invalid component type'}), 400
        
        return jsonify(components[component_type].to_dict('records')), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
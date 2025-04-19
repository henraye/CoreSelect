from flask import Blueprint, jsonify, request
import openai
import os
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
import json
from .cleanCSV import CleanCSV as cc

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

parts_api = Blueprint('parts_api', __name__)

def parse_openai_response(response):
    try:
        content = response.choices[0].message.content.strip()
        # Remove any markdown code block markers if present
        content = content.replace('```json', '').replace('```', '').strip()
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error parsing OpenAI response: {e}")
        print(f"Raw response: {content}")
        raise

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

        #openai makes a decision after each part clean up(have openai pick/make decisions)
        cleaner = cc(budget, priorities)
        
        # Process CPU
        cpu_df = cleaner.clean_cpu()
        cpu_prompt = f"""Given the following CPU options and user requirements, select the best CPU:
        Budget: ${budget}
        Priorities: {', '.join(priorities)}
        Games to play: {', '.join(data.get('wantToPlayGames', []))}
        Current games: {', '.join(data.get('currentlyPlayingGames', []))}

        Available CPUs:
        {cpu_df.to_string()}

        Select the best CPU and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact CPU name",
            "price": price,
            "explanation": "brief explanation of why this CPU is best for the user"
        }}"""
        cpu_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best CPU based on the user's needs and budget. Return only valid JSON."},
                {"role": "user", "content": cpu_prompt}
            ]
        )
        chosen_cpu = parse_openai_response(cpu_response)
        print("Chosen CPU:", chosen_cpu)

        # Process Motherboard
        mb_df = cleaner.clean_motherboard(chosen_cpu)
        mb_prompt = f"""Given the following motherboard options and the selected CPU, select the best motherboard:
        Selected CPU: {chosen_cpu['name']}
        Budget: ${budget}
        Priorities: {', '.join(priorities)}

        Available Motherboards:
        {mb_df.to_string()}

        Select the best motherboard and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact motherboard name",
            "price": price,
            "explanation": "brief explanation of why this motherboard is best for the user"
        }}"""
        mb_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best motherboard that's compatible with the chosen CPU. Return only valid JSON."},
                {"role": "user", "content": mb_prompt}
            ]
        )
        chosen_mb = parse_openai_response(mb_response)
        print("Chosen Motherboard:", chosen_mb)

        # Process RAM
        ram_df = cleaner.clean_ram(chosen_cpu)
        ram_prompt = f"""Given the following RAM options and the selected CPU/motherboard, select the best RAM:
        Selected CPU: {chosen_cpu['name']}
        Selected Motherboard: {chosen_mb['name']}
        Budget: ${budget}
        Priorities: {', '.join(priorities)}

        Available RAM:
        {ram_df.to_string()}

        Select the best RAM and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact RAM name",
            "price": price,
            "explanation": "brief explanation of why this RAM is best for the user"
        }}"""
        ram_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best RAM that's compatible with the chosen CPU and motherboard. Return only valid JSON."},
                {"role": "user", "content": ram_prompt}
            ]
        )
        chosen_ram = parse_openai_response(ram_response)
        print("Chosen RAM:", chosen_ram)

        # Process GPU
        gpu_df = cleaner.clean_gpu()
        gpu_prompt = f"""Given the following GPU options and user requirements, select the best GPU:
        Budget: ${budget}
        Priorities: {', '.join(priorities)}
        Games to play: {', '.join(data.get('wantToPlayGames', []))}
        Current games: {', '.join(data.get('currentlyPlayingGames', []))}

        Available GPUs:
        {gpu_df.to_string()}

        Select the best GPU and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact GPU name",
            "price": price,
            "explanation": "brief explanation of why this GPU is best for the user"
        }}"""
        gpu_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best GPU based on the user's gaming needs and budget. Return only valid JSON."},
                {"role": "user", "content": gpu_prompt}
            ]
        )
        chosen_gpu = parse_openai_response(gpu_response)
        print("Chosen GPU:", chosen_gpu)

        # Process Case
        case_df = cleaner.clean_case(chosen_gpu)
        case_prompt = f"""Given the following case options and the selected GPU, select the best case:
        Selected GPU: {chosen_gpu['name']}
        Budget: ${budget}
        Priorities: {', '.join(priorities)}

        Available Cases:
        {case_df.to_string()}

        Select the best case and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact case name",
            "price": price,
            "explanation": "brief explanation of why this case is best for the user"
        }}"""
        case_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best case that can accommodate the chosen GPU. Return only valid JSON."},
                {"role": "user", "content": case_prompt}
            ]
        )
        chosen_case = parse_openai_response(case_response)
        print("Chosen Case:", chosen_case)

        # Process PSU
        psu_df = cleaner.clean_psu(chosen_gpu, chosen_case)
        psu_prompt = f"""Given the following PSU options and the selected components, select the best PSU:
        Selected GPU: {chosen_gpu['name']}
        Selected Case: {chosen_case['name']}
        Budget: ${budget}
        Priorities: {', '.join(priorities)}

        Available PSUs:
        {psu_df.to_string()}

        Select the best PSU and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact PSU name",
            "price": price,
            "explanation": "brief explanation of why this PSU is best for the user"
        }}"""
        psu_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best PSU that can power all the chosen components. Return only valid JSON."},
                {"role": "user", "content": psu_prompt}
            ]
        )
        chosen_psu = parse_openai_response(psu_response)
        print("Chosen PSU:", chosen_psu)

        # Process CPU Cooler
        cooler_df = cleaner.clean_cpu_cooler()
        cooler_prompt = f"""Given the following CPU cooler options and the selected CPU, select the best cooler:
        Selected CPU: {chosen_cpu['name']}
        Budget: ${budget}
        Priorities: {', '.join(priorities)}

        Available CPU Coolers:
        {cooler_df.to_string()}

        Select the best CPU cooler and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact cooler name",
            "price": price,
            "explanation": "brief explanation of why this cooler is best for the user"
        }}"""
        cooler_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best CPU cooler for the chosen CPU. Return only valid JSON."},
                {"role": "user", "content": cooler_prompt}
            ]
        )
        chosen_cooler = parse_openai_response(cooler_response)
        print("Chosen Cooler:", chosen_cooler)

        # Process Storage
        storage_df = cleaner.clean_storage()
        storage_prompt = f"""Given the following storage options and user requirements, select the best storage:
        Budget: ${budget}
        Priorities: {', '.join(priorities)}
        Games to play: {', '.join(data.get('wantToPlayGames', []))}
        Current games: {', '.join(data.get('currentlyPlayingGames', []))}

        Available Storage:
        {storage_df.to_string()}

        Select the best storage and explain why it's the best choice for the user's needs. Return a JSON object with the following structure:
        {{
            "name": "exact storage name",
            "price": price,
            "explanation": "brief explanation of why this storage is best for the user"
        }}"""
        storage_response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a PC building expert. Select the best storage based on the user's needs and budget. Return only valid JSON."},
                {"role": "user", "content": storage_prompt}
            ]
        )
        chosen_storage = parse_openai_response(storage_response)
        print("Chosen Storage:", chosen_storage)

        # Calculate total cost
        total_cost = round(sum([
            chosen_cpu['price'],
            chosen_mb['price'],
            chosen_ram['price'],
            chosen_gpu['price'],
            chosen_case['price'],
            chosen_psu['price'],
            chosen_cooler['price'],
            chosen_storage['price']
        ]), 2)
        # Create final recommendation
        recommendation = {
            "motherboard": chosen_mb['name'],
            "cpu": chosen_cpu['name'],
            "memory": chosen_ram['name'],
            "storage": chosen_storage['name'],
            "gpu": chosen_gpu['name'],
            "case": chosen_case['name'],
            "cpu_cooler": chosen_cooler['name'],
            "case_fans": "Included with case",  # Default value
            "psu": chosen_psu['name'],
            "total_cost": total_cost,
            "explanation": f"""Here's your perfect PC build:

CPU: {chosen_cpu['explanation'].split('.')[0]}.
Motherboard: {chosen_mb['explanation'].split('.')[0]}.
RAM: {chosen_ram['explanation'].split('.')[0]}.
Storage: {chosen_storage['explanation'].split('.')[0]}.
GPU: {chosen_gpu['explanation'].split('.')[0]}.
Case: {chosen_case['explanation'].split('.')[0]}.
CPU Cooler: {chosen_cooler['explanation'].split('.')[0]}.
Power Supply: {chosen_psu['explanation'].split('.')[0]}.

Total Cost: ${total_cost}
"""
        }

        return jsonify(recommendation), 200

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
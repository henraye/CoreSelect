from flask import Blueprint, jsonify, request
import openai
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

parts_api = Blueprint('parts_api', __name__)

# Store scraped data
pc_parts_data = {
    'cpus': [],
    'gpus': [],
    'motherboards': [],
    'ram': [],
    'storage': [],
    'psus': [],
    'cases': []
}

# Cache for recommendations
recommendation_cache = {}
CACHE_DURATION = timedelta(hours=1)

def scrape_pc_parts():
    try:
        # Example scraping from Newegg (you'll need to adjust the URLs and selectors)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Scrape CPUs
        cpu_url = "https://www.newegg.com/Processors-Desktops/SubCategory/ID-343"
        response = requests.get(cpu_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Example selector (you'll need to adjust based on actual website structure)
        cpu_items = soup.select('.item-container')
        for item in cpu_items[:10]:  # Limit to 10 items for example
            try:
                name = item.select_one('.item-title').text.strip()
                price = item.select_one('.price-current').text.strip()
                pc_parts_data['cpus'].append({
                    'name': name,
                    'price': price,
                    'url': item.select_one('a')['href']
                })
            except Exception as e:
                print(f"Error parsing CPU item: {e}")
        
        # Similar scraping for other components...
        # You'll need to implement scraping for GPUs, motherboards, etc.
        
    except Exception as e:
        print(f"Error scraping PC parts: {e}")

def get_cached_recommendation(budget, cpu_pref, gpu_pref):
    cache_key = f"{budget}_{cpu_pref}_{gpu_pref}"
    if cache_key in recommendation_cache:
        cached_data = recommendation_cache[cache_key]
        if datetime.now() - cached_data['timestamp'] < CACHE_DURATION:
            return cached_data['recommendation']
    return None

def cache_recommendation(budget, cpu_pref, gpu_pref, recommendation):
    cache_key = f"{budget}_{cpu_pref}_{gpu_pref}"
    recommendation_cache[cache_key] = {
        'recommendation': recommendation,
        'timestamp': datetime.now()
    }

@parts_api.route('/recommend', methods=['POST'])
def get_recommendation():
    try:
        data = request.get_json()
        budget = data.get('budget')
        cpu_preference = data.get('cpu_preference')
        gpu_preference = data.get('gpu_preference')
        
        if not all([budget, cpu_preference, gpu_preference]):
            return jsonify({'error': 'Missing required parameters'}), 400

        # Check cache first
        cached_recommendation = get_cached_recommendation(budget, cpu_preference, gpu_preference)
        if cached_recommendation:
            return jsonify({'recommendation': cached_recommendation}), 200

        # Call OpenAI API for recommendations
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a PC building expert. Recommend PC parts based on budget and preferences.
                Consider the following in your recommendations:
                1. CPU and GPU compatibility
                2. Power supply requirements
                3. Case size compatibility
                4. RAM speed compatibility with motherboard
                5. Storage options (SSD/HDD)
                Format your response with clear sections for each component."""},
                {"role": "user", "content": f"""Recommend a PC build with a budget of ${budget}.
                CPU preference: {cpu_preference}
                GPU preference: {gpu_preference}
                Please provide specific part recommendations and explain your choices."""}
            ]
        )

        recommendation = response.choices[0].message.content
        cache_recommendation(budget, cpu_preference, gpu_preference, recommendation)
        return jsonify({'recommendation': recommendation}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@parts_api.route('/parts', methods=['GET'])
def get_parts():
    try:
        # If data is empty, scrape it
        if not any(pc_parts_data.values()):
            scrape_pc_parts()
        return jsonify(pc_parts_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@parts_api.route('/parts/<component_type>', methods=['GET'])
def get_component(component_type):
    try:
        if component_type not in pc_parts_data:
            return jsonify({'error': 'Invalid component type'}), 400
        
        # If data is empty, scrape it
        if not pc_parts_data[component_type]:
            scrape_pc_parts()
        
        return jsonify(pc_parts_data[component_type]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
# This class is responsible for cleaning the CSV files
# it will take in a budget and priority list containing the User's workflow preferences, and decide which entries to keep
# and which ones to remove.

import pandas as pd
import os
from collections import defaultdict
from pathlib import Path
import openai
from dotenv import load_dotenv
import json

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

class CleanCSV:
    budget: float # The budget for the user
    # const availablePriorities = [
    #     "Gaming Performance",
    #     "Video Editing",
    #     "3D Rendering",
    #     "Programming",
    #     "General Use",
    #     "Streaming",
    #     "Content Creation",
    #     "Machine Learning"
    # ];
    priority_list: list # The list of categories the user prefers
    cpu_budget: float # The budget for the CPU
    gpu_budget: float # The budget for the GPU
    case_budget: float # The budget for the case
    ram_budget: float # The budget for the RAM
    cpu_cooler_budget: float # The budget for the CPU cooler
    psu_budget: float # The budget for the PSU
    motherboard_budget: float # The budget for the motherboard
    storage_budget: float # The budget for the storage
    
    
    def __init__(self, budget: float, priority_list: list):
        self.budget = budget
        self.priority_list = priority_list
        self.data_dir = Path('data')
        self.determine_budget()
    
    def get_use_case_weights(self):
        return {
            "Gaming Performance": {"GPU": 0.5, "CPU": 0.3, "RAM": 0.1, "Motherboard": 0.1},
            "Video Editing": {"CPU": 0.35, "GPU": 0.35, "RAM": 0.15, "Storage": 0.15},
            "3D Rendering": {"CPU": 0.4, "GPU": 0.4, "RAM": 0.1, "Cooler": 0.1},
            "Programming": {"CPU": 0.4, "RAM": 0.3, "Storage": 0.2, "Motherboard": 0.1},
            "General Use": {"CPU": 0.4, "RAM": 0.3, "Storage": 0.2, "Case": 0.1},
            "Streaming": {"CPU": 0.3, "GPU": 0.3, "RAM": 0.2, "Cooler": 0.1, "PSU": 0.1},
            "Content Creation": {"CPU": 0.35, "GPU": 0.35, "RAM": 0.2, "Storage": 0.1},
            "Machine Learning": {"GPU": 0.5, "CPU": 0.3, "RAM": 0.2}
        }

    
    def determine_budget(self):
        use_case_weights = self.get_use_case_weights()

        # Define budget tiers and their corresponding minimum allocations
        if self.budget >= 3000:  # High-end build
            fixed_minimums = {
                "CPU": 500,    # Allow for high-end CPUs
                "GPU": 1200,   # Allow for RTX 4090/4080 tier
                "RAM": 200,    # Allow for 32/64GB DDR5
                "Storage": 200, # Allow for large NVMe drives
                "Motherboard": 300, # High-end motherboards
                "Cooler": 150,  # Allow for premium cooling
                "PSU": 200,    # Allow for 1000W+ PSUs
                "Case": 150    # Allow for premium cases
            }
        elif self.budget >= 1500:  # Mid-range build
            fixed_minimums = {
                "CPU": 300,
                "GPU": 600,
                "RAM": 150,
                "Storage": 150,
                "Motherboard": 200,
                "Cooler": 100,
                "PSU": 150,
                "Case": 100
            }
        else:  # Budget build
            fixed_minimums = {
                "CPU": 120,
                "GPU": 200,
                "RAM": 80,
                "Storage": 90,
                "Motherboard": 100,
                "Cooler": 50,
                "PSU": 150,
                "Case": 80
            }

        weightings = [0.5, 0.3, 0.2]
        dynamic_weights = defaultdict(float)

        for idx, use_case in enumerate(self.priority_list):
            if use_case in use_case_weights:
                for part, weight in use_case_weights[use_case].items():
                    dynamic_weights[part] += weight * weightings[idx]

        # Normalize dynamic weights
        total_weight = sum(dynamic_weights.values())
        for part in dynamic_weights:
            dynamic_weights[part] /= total_weight

        # Initial dynamic allocation with minimum percentages for high budgets
        if self.budget >= 3000:
            # Ensure GPU gets at least 35% of total budget for high-end builds
            dynamic_weights["GPU"] = max(dynamic_weights.get("GPU", 0), 0.35)
            # Ensure CPU gets at least 20% of total budget for high-end builds
            dynamic_weights["CPU"] = max(dynamic_weights.get("CPU", 0), 0.20)

        # Recalculate total weight after adjustments
        total_weight = sum(dynamic_weights.values())
        for part in dynamic_weights:
            dynamic_weights[part] /= total_weight

        # Initial dynamic allocation
        raw_allocations = {
            part: self.budget * dynamic_weights.get(part, 0)
            for part in fixed_minimums
        }

        # Lock in minimums and prepare scaling
        final_allocations = {}
        locked_total = 0
        adjustable_parts = {}

        for part, raw in raw_allocations.items():
            fixed = fixed_minimums[part]
            if raw < fixed:
                final_allocations[part] = fixed
                locked_total += fixed
            else:
                adjustable_parts[part] = raw

        remaining_budget = self.budget - locked_total
        if remaining_budget < 0:
            raise ValueError("Total budget too low to meet fixed minimums.")

        adjustable_total = sum(adjustable_parts.values())
        for part, raw in adjustable_parts.items():
            scaled = (raw / adjustable_total) * remaining_budget
            final_allocations[part] = scaled

        # Final assignment
        self.cpu_budget = final_allocations["CPU"]
        self.gpu_budget = final_allocations["GPU"]
        self.ram_budget = final_allocations["RAM"]
        self.storage_budget = final_allocations["Storage"]
        self.motherboard_budget = final_allocations["Motherboard"]
        self.cpu_cooler_budget = final_allocations["Cooler"]
        self.psu_budget = final_allocations["PSU"]
        self.case_budget = final_allocations["Case"]
        
    def display_budgets(self):
        print(f"CPU Budget: {self.cpu_budget}")
        print(f"GPU Budget: {self.gpu_budget}")
        print(f"RAM Budget: {self.ram_budget}")
        print(f"Storage Budget: {self.storage_budget}")
        print(f"Motherboard Budget: {self.motherboard_budget}")
        print(f"CPU Cooler Budget: {self.cpu_cooler_budget}")
        print(f"PSU Budget: {self.psu_budget}")
        print(f"Case Budget: {self.case_budget}")

    def load_csv(self, filename):
        file_path = self.data_dir / filename
        if not file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {filename}")
        return pd.read_csv(file_path)

    def clean_cpu(self):
        df = self.load_csv('cpu_final_dataset_complete.csv')
        df = df[df['price'] <= self.cpu_budget].copy()
        return df

    def clean_gpu(self):
        df = self.load_csv('video_card_final_dataset_complete.csv')
        df = df[df['price'] <= self.gpu_budget].copy()
        return df

    def clean_ram(self, cpu):
        df = self.load_csv('memory_final_dataset_complete.csv')
        df = df[df['price'] <= self.ram_budget].copy()
        socket = cpu.get('socket_type', '')
        if socket in ['LGA 1700', 'AM4']:
            df = df[df['dram'].isin(['DDR4'])]
        elif socket in ['LGA 1851', 'AM5']:
            df = df[df['dram'].isin(['DDR5'])]
        return df

    def clean_storage(self):
        df = self.load_csv('internal_hard_drive_final_dataset_complete.csv')
        df = df[df['price'] <= self.storage_budget].copy()
        return df

    def clean_motherboard(self, cpu):
        df = self.load_csv('motherboard_final_dataset_complete.csv')
        df = df[df['price'] <= self.motherboard_budget].copy()
        socket = cpu.get('socket_type', '')
        df = df[df['socket'] == socket]
        return df

    def clean_case(self, gpu):
        df = self.load_csv('case_final_dataset_complete.csv')
        df = df[df['price'] <= self.case_budget].copy()
        gpu_clearance = gpu.get('length', 0)
        df = df[df['GPU_clearance'] >= gpu_clearance]
        return df

    def clean_cpu_cooler(self):
        df = self.load_csv('cpu_cooler_final_dataset_complete.csv')
        df = df[df['price'] <= self.cpu_cooler_budget].copy()
        return df

    def clean_psu(self, gpu, case):
        df = self.load_csv('power_supply_final_dataset_complete.csv')
        df = df[df['price'] <= self.psu_budget].copy()
        wattage_required = gpu.get('recommended_wattage', 500)
        wattage_cutoff = 600 if wattage_required > 600 else 500
        df = df[df['wattage'] >= wattage_cutoff]
        return df
        
    
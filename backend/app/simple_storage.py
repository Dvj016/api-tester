"""
Simple Total Visit Counter with Persistent Storage
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

Tracks TOTAL VISITS (every page load) with persistent JSON storage.
NO PII - just a simple counter that increments on every request.
"""
import json
from pathlib import Path
from datetime import datetime
from typing import Tuple
import threading

# Store data file in the app directory (persists on Render)
DATA_DIR = Path(__file__).parent / "data"
DATA_FILE = DATA_DIR / "visit_counter.json"

# Thread lock for file operations
_lock = threading.Lock()


def ensure_data_dir():
    """Ensure data directory exists"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_data() -> dict:
    """Load visit data from JSON file"""
    ensure_data_dir()
    
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"[Storage] Error loading data: {e}")
    
    # Return default data
    return {
        "total_visits": 1000,
        "last_updated": datetime.now().isoformat(),
        "version": "3.0"
    }


def save_data(data: dict):
    """Save visit data to JSON file"""
    ensure_data_dir()
    
    try:
        # Atomic write operation
        temp_file = DATA_FILE.with_suffix('.tmp')
        with open(temp_file, 'w') as f:
            json.dump(data, f, indent=2)
        temp_file.replace(DATA_FILE)
    except Exception as e:
        print(f"[Storage] Error saving data: {e}")


def get_visitor_stats() -> Tuple[int, int]:
    """Get total visits (returns total, 0 for compatibility)"""
    with _lock:
        data = load_data()
        return data["total_visits"], 0


def increment_visitor(ip_address: str = "") -> Tuple[int, int, bool]:
    """
    Increment total visit counter
    Returns: (total_visits, 0, True) - always counts as new visit
    
    NOTE: ip_address parameter kept for API compatibility but not used
    """
    with _lock:
        data = load_data()
        
        # Increment total visits on EVERY call
        data["total_visits"] += 1
        data["last_updated"] = datetime.now().isoformat()
        
        # Save to file
        save_data(data)
        
        print(f"[Storage] Total visits: {data['total_visits']}")
        
        return data["total_visits"], 0, True


def reset_visitor_stats():
    """Reset visit counter (admin function)"""
    with _lock:
        data = {
            "total_visits": 1000,
            "last_updated": datetime.now().isoformat(),
            "version": "3.0"
        }
        save_data(data)
        print("[Storage] Visit counter reset to 1000")


# Initialize on module import
try:
    ensure_data_dir()
    data = load_data()
    save_data(data)
    print(f"[Storage] Total Visit Counter initialized: {data['total_visits']} visits")
except Exception as e:
    print(f"[Storage] Error initializing: {e}")

# Made with Bob
"""
Unique Visitor Tracking with Secure Hashing
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

SEPARATE from total visit counter - tracks unique visitors using secure hashing.
NO PII stored - only cryptographic hashes.
"""
import json
import hashlib
import hmac
import secrets
from pathlib import Path
from datetime import datetime
from typing import Tuple
import threading
import os

# Store data file in the app directory (persists on Render)
DATA_DIR = Path(__file__).parent / "data"
UNIQUE_VISITORS_FILE = DATA_DIR / "unique_visitors.json"
SALT_FILE = DATA_DIR / ".unique_salt"

# Thread lock for file operations
_lock = threading.Lock()


def get_or_create_salt() -> str:
    """Get or create a unique salt for this installation"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    if SALT_FILE.exists():
        try:
            with open(SALT_FILE, 'r') as f:
                return f.read().strip()
        except Exception:
            pass
    
    # Generate new cryptographically secure salt
    salt = secrets.token_hex(32)
    try:
        with open(SALT_FILE, 'w') as f:
            f.write(salt)
        # Lock down permissions (owner read/write only)
        try:
            os.chmod(SALT_FILE, 0o600)
        except Exception:
            pass  # May fail on Windows
    except Exception as e:
        print(f"[Unique Visitors] Warning: Could not save salt: {e}")
    
    return salt


# Global salt (loaded once)
_SALT = get_or_create_salt()


def secure_hash(ip_address: str) -> str:
    """
    Create secure hash using HMAC-SHA256 with salt
    SECURITY: Uses cryptographic hash, not reversible, no PII stored
    """
    return hmac.new(
        _SALT.encode(),
        ip_address.encode(),
        hashlib.sha256
    ).hexdigest()[:16]


def load_unique_visitors() -> dict:
    """Load unique visitor data from JSON file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    if UNIQUE_VISITORS_FILE.exists():
        try:
            with open(UNIQUE_VISITORS_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"[Unique Visitors] Error loading data: {e}")
    
    # Return default data
    return {
        "unique_visitor_hashes": [],
        "last_updated": datetime.now().isoformat(),
        "version": "1.0"
    }


def save_unique_visitors(data: dict):
    """Save unique visitor data to JSON file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    try:
        # Atomic write operation
        temp_file = UNIQUE_VISITORS_FILE.with_suffix('.tmp')
        with open(temp_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Set secure permissions before moving
        try:
            os.chmod(temp_file, 0o600)
        except Exception:
            pass  # May fail on Windows
        
        # Atomic rename
        temp_file.replace(UNIQUE_VISITORS_FILE)
        
    except Exception as e:
        print(f"[Unique Visitors] Error saving data: {e}")


def get_unique_visitor_count() -> int:
    """Get count of unique visitors"""
    with _lock:
        data = load_unique_visitors()
        return len(data["unique_visitor_hashes"])


def check_and_add_unique_visitor(ip_address: str) -> Tuple[int, bool]:
    """
    Check if visitor is unique and add if new
    Returns: (unique_count, is_new_visitor)
    
    SECURITY: IP is hashed before checking/storing - actual IP never saved
    """
    with _lock:
        data = load_unique_visitors()
        
        # Hash the IP for privacy
        ip_hash = secure_hash(ip_address)
        
        # Check if this is a new unique visitor
        is_new_visitor = ip_hash not in data["unique_visitor_hashes"]
        
        # Add hash if new visitor
        if is_new_visitor:
            data["unique_visitor_hashes"].append(ip_hash)
            data["last_updated"] = datetime.now().isoformat()
            save_unique_visitors(data)
            print(f"[Unique Visitors] New unique visitor! Total unique: {len(data['unique_visitor_hashes'])}")
        
        return len(data["unique_visitor_hashes"]), is_new_visitor


def reset_unique_visitors():
    """Reset unique visitor tracking (admin function)"""
    with _lock:
        data = {
            "unique_visitor_hashes": [],
            "last_updated": datetime.now().isoformat(),
            "version": "1.0"
        }
        save_unique_visitors(data)
        print("[Unique Visitors] Reset successfully")


# Initialize on module import
try:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    get_or_create_salt()
    data = load_unique_visitors()
    save_unique_visitors(data)
    print(f"[Unique Visitors] Initialized with {len(data['unique_visitor_hashes'])} unique visitors")
except Exception as e:
    print(f"[Unique Visitors] Error initializing: {e}")

# Made with Bob
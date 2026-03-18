"""
MongoDB Storage for Visitor Counter
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

Persistent storage using MongoDB Atlas (free tier).
Survives deployments, restarts, and service sleep on Render.
"""
import os
from datetime import datetime
from typing import Tuple, Optional
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
import threading

# MongoDB connection
_client: Optional[MongoClient] = None
_db = None
_collection = None
_lock = threading.Lock()

# Fallback values if MongoDB is unavailable
FALLBACK_COUNT = 1000


def get_mongodb_uri() -> str:
    """Get MongoDB URI from environment variable"""
    return os.getenv("MONGODB_URI", "")


def connect_mongodb():
    """Connect to MongoDB Atlas"""
    global _client, _db, _collection
    
    if _client is not None:
        return True
    
    try:
        uri = get_mongodb_uri()
        if not uri:
            print("[MongoDB] MONGODB_URI not configured - using fallback storage")
            return False
        
        # Connect to MongoDB
        _client = MongoClient(
            uri,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=5000,
            socketTimeoutMS=5000
        )
        
        # Test connection
        _client.admin.command('ping')
        
        # Get database and collection
        _db = _client['api_tester']
        _collection = _db['visitor_stats']
        
        # Create index on stat_name for faster queries
        _collection.create_index("stat_name", unique=True)
        
        print("[MongoDB] Connected successfully to MongoDB Atlas")
        return True
        
    except Exception as e:
        print(f"[MongoDB] Connection failed: {e}")
        _client = None
        _db = None
        _collection = None
        return False


def ensure_connection():
    """Ensure MongoDB connection is active"""
    if _client is None:
        return connect_mongodb()
    
    try:
        # Test if connection is still alive
        _client.admin.command('ping')
        return True
    except:
        # Reconnect if connection lost
        print("[MongoDB] Connection lost, reconnecting...")
        return connect_mongodb()


def get_visitor_stats() -> Tuple[int, int]:
    """
    Get visitor statistics from MongoDB
    Returns: (total_visits, unique_visitors)
    """
    with _lock:
        if not ensure_connection():
            print("[MongoDB] Using fallback count")
            return FALLBACK_COUNT, 0
        
        try:
            # Get total visits
            total_doc = _collection.find_one({"stat_name": "total_visits"})
            total = total_doc["count"] if total_doc else FALLBACK_COUNT
            
            # Get unique visitors
            unique_doc = _collection.find_one({"stat_name": "unique_visitors"})
            unique = unique_doc["count"] if unique_doc else 0
            
            return total, unique
            
        except Exception as e:
            print(f"[MongoDB] Error getting stats: {e}")
            return FALLBACK_COUNT, 0


def increment_visitor() -> Tuple[int, int, bool]:
    """
    Increment total visit counter in MongoDB
    Returns: (total_visits, 0, True)
    """
    with _lock:
        if not ensure_connection():
            print("[MongoDB] Using fallback - increment not saved")
            return FALLBACK_COUNT, 0, True
        
        try:
            # Increment total visits using atomic operation
            result = _collection.find_one_and_update(
                {"stat_name": "total_visits"},
                {
                    "$inc": {"count": 1},
                    "$set": {"last_updated": datetime.now().isoformat()}
                },
                upsert=True,  # Create if doesn't exist
                return_document=True  # Return updated document
            )
            
            total = result["count"] if result else FALLBACK_COUNT
            print(f"[MongoDB] Total visits: {total}")
            
            return total, 0, True
            
        except Exception as e:
            print(f"[MongoDB] Error incrementing: {e}")
            return FALLBACK_COUNT, 0, True


def update_unique_visitor_count(count: int):
    """Update unique visitor count in MongoDB"""
    with _lock:
        if not ensure_connection():
            return
        
        try:
            _collection.update_one(
                {"stat_name": "unique_visitors"},
                {
                    "$set": {
                        "count": count,
                        "last_updated": datetime.now().isoformat()
                    }
                },
                upsert=True
            )
        except Exception as e:
            print(f"[MongoDB] Error updating unique count: {e}")


def initialize_counter(initial_count: int = 1000):
    """Initialize counter with a starting value (only if not exists)"""
    with _lock:
        if not ensure_connection():
            print("[MongoDB] Cannot initialize - no connection")
            return False
        
        try:
            # Only set if document doesn't exist
            existing = _collection.find_one({"stat_name": "total_visits"})
            if not existing:
                _collection.insert_one({
                    "stat_name": "total_visits",
                    "count": initial_count,
                    "last_updated": datetime.now().isoformat(),
                    "created_at": datetime.now().isoformat()
                })
                print(f"[MongoDB] Initialized counter at {initial_count}")
            else:
                print(f"[MongoDB] Counter already exists: {existing['count']}")
            
            return True
            
        except Exception as e:
            print(f"[MongoDB] Error initializing: {e}")
            return False


def reset_visitor_stats(count: int = 1000):
    """Reset visitor counter (admin function)"""
    with _lock:
        if not ensure_connection():
            return False
        
        try:
            _collection.update_one(
                {"stat_name": "total_visits"},
                {
                    "$set": {
                        "count": count,
                        "last_updated": datetime.now().isoformat()
                    }
                },
                upsert=True
            )
            print(f"[MongoDB] Counter reset to {count}")
            return True
            
        except Exception as e:
            print(f"[MongoDB] Error resetting: {e}")
            return False


# Initialize on module import
try:
    if connect_mongodb():
        # Initialize counter if needed (won't overwrite existing)
        initialize_counter(1002)  # Start from current count
        total, unique = get_visitor_stats()
        print(f"[MongoDB] Visitor Counter Ready: {total} total visits, {unique} unique visitors")
    else:
        print("[MongoDB] Running in fallback mode - counts will not persist")
except Exception as e:
    print(f"[MongoDB] Initialization error: {e}")

# Made with Bob
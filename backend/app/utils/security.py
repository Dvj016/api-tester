import re
from typing import Optional


def mask_api_key(api_key: str, visible_chars: int = 4) -> str:
    """
    Mask an API key for logging purposes
    
    Args:
        api_key: The API key to mask
        visible_chars: Number of characters to show at the end
        
    Returns:
        Masked API key string
    """
    if not api_key or len(api_key) <= visible_chars:
        return "***"
    
    return f"***{api_key[-visible_chars:]}"


def validate_api_key_format(api_key: str, provider: str) -> tuple[bool, str]:
    """
    Validate API key format for different providers
    
    Args:
        api_key: The API key to validate
        provider: The provider name
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not api_key or not api_key.strip():
        return False, "API key cannot be empty"
    
    # Basic length check
    if len(api_key) < 10:
        return False, "API key appears to be too short"
    
    # Provider-specific validation
    if provider == "openai":
        if not api_key.startswith("sk-"):
            return False, "OpenAI API keys should start with 'sk-'"
    
    elif provider == "anthropic":
        if not api_key.startswith("sk-ant-"):
            return False, "Anthropic API keys should start with 'sk-ant-'"
    
    elif provider == "gemini":
        # Google API keys are typically alphanumeric
        if not re.match(r'^[A-Za-z0-9_-]+$', api_key):
            return False, "Invalid Google API key format"
    
    elif provider == "nvidia":
        # NVIDIA NIM keys format validation
        if not re.match(r'^[A-Za-z0-9_-]+$', api_key):
            return False, "Invalid NVIDIA API key format"
    
    return True, ""


def sanitize_error_message(error_msg: str) -> str:
    """
    Sanitize error messages to remove potential API keys and sensitive data
    
    Args:
        error_msg: The error message to sanitize
        
    Returns:
        Sanitized error message with API keys and sensitive data removed
    """
    if not error_msg:
        return error_msg
    
    # Remove OpenAI API keys (sk-...)
    error_msg = re.sub(r'sk-[a-zA-Z0-9]{20,}', '***API_KEY***', error_msg)
    
    # Remove Anthropic API keys (sk-ant-...)
    error_msg = re.sub(r'sk-ant-[a-zA-Z0-9-]{20,}', '***API_KEY***', error_msg)
    
    # Remove Google/Gemini API keys (typically 39 chars alphanumeric)
    error_msg = re.sub(r'\b[A-Za-z0-9_-]{35,45}\b', '***API_KEY***', error_msg)
    
    # Remove NVIDIA API keys (nvapi-...)
    error_msg = re.sub(r'nvapi-[a-zA-Z0-9_-]{20,}', '***API_KEY***', error_msg)
    
    # Remove Bearer tokens
    error_msg = re.sub(r'Bearer\s+[a-zA-Z0-9_-]{20,}', 'Bearer ***TOKEN***', error_msg, flags=re.IGNORECASE)
    
    # Remove Authorization headers
    error_msg = re.sub(r'Authorization:\s*[^\s,]+', 'Authorization: ***REDACTED***', error_msg, flags=re.IGNORECASE)
    
    # Remove any long alphanumeric strings that might be keys (32+ chars)
    error_msg = re.sub(r'\b[A-Za-z0-9_-]{32,}\b', '***REDACTED***', error_msg)
    
    # Remove email addresses (potential PII)
    error_msg = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '***EMAIL***', error_msg)
    
    # Remove IP addresses (potential PII)
    error_msg = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '***IP***', error_msg)
    
    return error_msg


def sanitize_response_data(data: dict) -> dict:
    """
    Sanitize response data to ensure no API keys leak through
    
    Args:
        data: Response data dictionary
        
    Returns:
        Sanitized response data
    """
    if not isinstance(data, dict):
        return data
    
    sanitized = {}
    sensitive_keys = ['api_key', 'apikey', 'key', 'token', 'secret', 'password', 'authorization']
    
    for key, value in data.items():
        # Check if key name suggests sensitive data
        if any(sensitive in key.lower() for sensitive in sensitive_keys):
            sanitized[key] = '***REDACTED***'
        elif isinstance(value, str):
            # Sanitize string values
            sanitized[key] = sanitize_error_message(value)
        elif isinstance(value, dict):
            # Recursively sanitize nested dictionaries
            sanitized[key] = sanitize_response_data(value)
        elif isinstance(value, list):
            # Sanitize lists
            sanitized[key] = [
                sanitize_response_data(item) if isinstance(item, dict)
                else sanitize_error_message(item) if isinstance(item, str)
                else item
                for item in value
            ]
        else:
            sanitized[key] = value
    
    return sanitized

# Made with Bob

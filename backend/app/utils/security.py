import re


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

# Made with Bob

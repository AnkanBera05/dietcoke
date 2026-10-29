import secrets
import time
from typing import Dict

# Active tokens store: token -> {"username": username, "expires_at": timestamp}
ACTIVE_TOKENS: Dict[str, dict] = {}
TOKEN_TTL_SECONDS = 3600 * 12  # 12 hours


def create_session_token(username: str) -> str:
    token = secrets.token_hex(32)
    ACTIVE_TOKENS[token] = {
        "username": username,
        "expires_at": time.time() + TOKEN_TTL_SECONDS
    }
    return token


def verify_session_token(token: str) -> bool:
    if not token or token not in ACTIVE_TOKENS:
        return False
    data = ACTIVE_TOKENS[token]
    if time.time() > data["expires_at"]:
        del ACTIVE_TOKENS[token]
        return False
    return True


def invalidate_token(token: str):
    if token in ACTIVE_TOKENS:
        del ACTIVE_TOKENS[token]

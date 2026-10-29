from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str
    username: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ProductModel(BaseModel):
    id: Optional[int] = None
    slug: str
    name: str
    tagline: Optional[str] = ""
    accent_color: str = "#E4002B"
    accent_secondary: str = "#B00020"
    can_style: str = "silver_red"
    badge: Optional[str] = "ICONIC"
    calories: int = 0
    sugar: str = "0g"
    caffeine: str = "46mg"
    volume: str = "355 mL / 12 FL OZ"
    description: str
    taste_notes: List[str] = []
    sort_order: int = 1
    is_active: int = 1
    is_featured: int = 1

class SiteContentUpdate(BaseModel):
    content: Dict[str, str]

class TelemetryEvent(BaseModel):
    event_type: str  # 'visit', 'can_pop', 'sound_toggle', 'flavor_view'
    payload: Optional[Dict[str, Any]] = None

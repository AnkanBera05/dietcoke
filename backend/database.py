import sqlite3
import hashlib
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "diet_coke.db")

DEFAULT_PRODUCTS = [
    {
        "slug": "original",
        "name": "Diet Coke Original",
        "tagline": "The Unapologetic Classic",
        "accent_color": "#E4002B",
        "accent_secondary": "#B00020",
        "can_style": "silver_red",
        "badge": "ICONIC ORIGINAL",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Crisp, cold, and unmistakably bold. The timeless silver aluminum icon crafted with zero sugar, zero calories, and maximum effervescence.",
        "taste_notes": json.dumps(["Crisp Carbonation", "Zero Sugar", "Aluminum Chill", "Signature Spiced Spark"]),
        "sort_order": 1,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "cherry",
        "name": "Diet Coke Feisty Cherry",
        "tagline": "A Fiery Twist of Midnight Cherry",
        "accent_color": "#B81D39",
        "accent_secondary": "#5E0B1B",
        "can_style": "silver_cherry",
        "badge": "FAN FAVORITE",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "An electrifying collision of deep dark cherry aromatics infused into our razor-sharp silver fizz. Tart, sultry, and instantly refreshing.",
        "taste_notes": json.dumps(["Dark Cherry Burst", "Velvet Tang", "Electric Fizz", "Zero Guilt"]),
        "sort_order": 2,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "lime",
        "name": "Diet Coke Sublime Lime",
        "tagline": "Ultra-Crisp Zesty Shockwave",
        "accent_color": "#00A859",
        "accent_secondary": "#005C30",
        "can_style": "silver_lime",
        "badge": "CITRUS SURGE",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Sun-kissed Persian lime peel oils meeting explosive silver carbonation. A razor-sharp citrus zap that cuts through the heat instantly.",
        "taste_notes": json.dumps(["Key Lime Spark", "Glacial Cold", "Citrus Peel Bite", "Zero Calories"]),
        "sort_order": 3,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "vanilla",
        "name": "Diet Coke Velvet Vanilla",
        "tagline": "Madagascar Silk Meets Raw Fizz",
        "accent_color": "#E5A93C",
        "accent_secondary": "#8D5B18",
        "can_style": "silver_vanilla",
        "badge": "LIMITED EDITION",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Sensual bourbon vanilla orchid bean extracts layered gently over aggressive silver carbonation. Creamy yet exhilaratingly crisp.",
        "taste_notes": json.dumps(["Bourbon Vanilla Bean", "Silky Sweetness", "Cold Snap", "Bold Finish"]),
        "sort_order": 4,
        "is_active": 1,
        "is_featured": 1
    }
]

DEFAULT_CONTENT = {
    "hero_headline_1": "THAT'S",
    "hero_headline_2": "SO",
    "hero_headline_3": "DIET COKE.",
    "hero_subheadline": "Bold taste. Zero sugar. Maximum refreshment.",
    "hero_cta": "EXPLORE THE TASTE",
    "ticker_announcement": "/// LIVE CAN EXPERIENCE /// ZERO SUGAR /// UNAPOLOGETICALLY CRISP /// 100% RECYCLABLE ALUMINUM /// THAT'S SO DIET COKE ///",
    "fizz_headline": "TASTE THE FIZZ.",
    "fizz_subheadline": "Millions of microscopic carbonation micro-bubbles suspended in ice-cold silver aluminum. Every sip cracks open an adrenaline rush.",
    "can_opener_headline": "PULL TO OPEN",
    "can_opener_subheadline": "Grab the aluminum ring. Feel the pressurized seal release.",
    "can_opener_success": "AHHH. THAT'S BETTER.",
    "story_heading": "BORN IN 1982. REBORN EVERY SECOND.",
    "story_body": "Diet Coke isn't an alternative. It is an obsession. A relentless pursuit of ice-cold silver perfection, unapologetic individuality, and unmatched crisp bite. No compromises. Zero sugar. All attitude.",
    "stat_sugar": "0g",
    "stat_sugar_label": "Zero Sugar",
    "stat_calories": "0",
    "stat_calories_label": "Zero Calories",
    "stat_refreshment": "100%",
    "stat_refreshment_label": "Crisp Silver Kick",
    "stat_year": "1982",
    "stat_year_label": "Iconic Heritage"
}


def hash_password(password: str, salt: str = "dietcoke_salt_2026") -> str:
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Site content table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS site_content (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)

    # Products table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE,
            name TEXT NOT NULL,
            tagline TEXT,
            accent_color TEXT DEFAULT '#E4002B',
            accent_secondary TEXT DEFAULT '#B00020',
            can_style TEXT DEFAULT 'silver_red',
            badge TEXT DEFAULT 'ICONIC',
            calories INTEGER DEFAULT 0,
            sugar TEXT DEFAULT '0g',
            caffeine TEXT DEFAULT '46mg',
            volume TEXT DEFAULT '355 mL / 12 FL OZ',
            description TEXT,
            taste_notes TEXT,
            sort_order INTEGER DEFAULT 1,
            is_active INTEGER DEFAULT 1,
            is_featured INTEGER DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Admin users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Telemetry / Analytics table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY,
            visits_count INTEGER DEFAULT 1842,
            can_pops_count INTEGER DEFAULT 624,
            sound_enabled_count INTEGER DEFAULT 412,
            flavor_clicks TEXT DEFAULT '{"original": 940, "cherry": 412, "lime": 320, "vanilla": 170}'
        )
    """)

    # Check and seed site_content
    cursor.execute("SELECT COUNT(*) FROM site_content")
    if cursor.fetchone()[0] == 0:
        for k, v in DEFAULT_CONTENT.items():
            cursor.execute("INSERT INTO site_content (key, value) VALUES (?, ?)", (k, v))

    # Check and seed products
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        for p in DEFAULT_PRODUCTS:
            cursor.execute("""
                INSERT INTO products (slug, name, tagline, accent_color, accent_secondary, can_style, badge,
                                     calories, sugar, caffeine, volume, description, taste_notes, sort_order, is_active, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["slug"], p["name"], p["tagline"], p["accent_color"], p["accent_secondary"],
                p["can_style"], p["badge"], p["calories"], p["sugar"], p["caffeine"], p["volume"],
                p["description"], p["taste_notes"], p["sort_order"], p["is_active"], p["is_featured"]
            ))

    # Check and seed default admin user
    cursor.execute("SELECT COUNT(*) FROM admin_users")
    if cursor.fetchone()[0] == 0:
        default_salt = "dietcoke_salt_2026"
        pwd_hash = hash_password("dietcoke2026!", default_salt)
        cursor.execute("""
            INSERT INTO admin_users (username, password_hash, salt)
            VALUES (?, ?, ?)
        """, ("admin", pwd_hash, default_salt))

    # Check and seed telemetry
    cursor.execute("SELECT COUNT(*) FROM telemetry")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO telemetry (id, visits_count, can_pops_count, sound_enabled_count) VALUES (1, 1842, 624, 412)")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")

import sqlite3
import hashlib
import os
import json
import shutil

ORIGINAL_DB_PATH = os.path.join(os.path.dirname(__file__), "diet_coke.db")

# In serverless environments (Vercel / Lambda), filesystem is read-only except /tmp
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    TMP_DB = "/tmp/diet_coke.db"
    if not os.path.exists(TMP_DB) and os.path.exists(ORIGINAL_DB_PATH):
        try:
            shutil.copy2(ORIGINAL_DB_PATH, TMP_DB)
        except Exception:
            pass
    DB_PATH = TMP_DB if os.path.exists(TMP_DB) else ORIGINAL_DB_PATH
else:
    DB_PATH = ORIGINAL_DB_PATH

DEFAULT_PRODUCTS = [
    {
        "slug": "classic",
        "name": "Diet Coke Classic",
        "tagline": "Same Iconic Taste. Zero Sugar.",
        "accent_color": "#E4002B",
        "accent_secondary": "#B00020",
        "can_style": "silver_red",
        "badge": "CLASSIC",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Crisp, cold, and unmistakably bold. The timeless silver aluminum icon crafted with zero sugar, zero calories, and maximum effervescence.",
        "taste_notes": json.dumps(["Crisp Carbonation", "Zero Sugar", "Aluminum Chill", "Iconic Kick"]),
        "sort_order": 1,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "lime",
        "name": "Diet Coke Lime",
        "tagline": "Ultra-Crisp Zesty Shockwave",
        "accent_color": "#28A745",
        "accent_secondary": "#005C30",
        "can_style": "silver_lime",
        "badge": "LIME",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Sun-kissed Persian lime peel oils meeting explosive silver carbonation. A razor-sharp citrus zap that cuts through the heat instantly.",
        "taste_notes": json.dumps(["Key Lime Spark", "Glacial Cold", "Citrus Peel Bite", "Zero Calories"]),
        "sort_order": 2,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "cherry",
        "name": "Diet Coke Cherry",
        "tagline": "A Fiery Twist of Midnight Cherry",
        "accent_color": "#B81D39",
        "accent_secondary": "#5E0B1B",
        "can_style": "silver_cherry",
        "badge": "CHERRY",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "An electrifying collision of deep dark cherry aromatics infused into our razor-sharp silver fizz. Tart, sultry, and instantly refreshing.",
        "taste_notes": json.dumps(["Dark Cherry Burst", "Velvet Tang", "Electric Fizz", "Zero Guilt"]),
        "sort_order": 3,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "vanilla",
        "name": "Diet Coke Vanilla",
        "tagline": "Madagascar Silk Meets Raw Fizz",
        "accent_color": "#E5A93C",
        "accent_secondary": "#8D5B18",
        "can_style": "silver_vanilla",
        "badge": "VANILLA",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Sensual bourbon vanilla orchid bean extracts layered gently over aggressive silver carbonation. Creamy yet exhilaratingly crisp.",
        "taste_notes": json.dumps(["Bourbon Vanilla Bean", "Silky Sweetness", "Cold Snap", "Bold Finish"]),
        "sort_order": 4,
        "is_active": 1,
        "is_featured": 1
    },
    {
        "slug": "raspberry",
        "name": "Diet Coke Raspberry",
        "tagline": "Electric Berry Voltage",
        "accent_color": "#E91E63",
        "accent_secondary": "#880E4F",
        "can_style": "silver_raspberry",
        "badge": "RASPBERRY",
        "calories": 0,
        "sugar": "0g",
        "caffeine": "46mg",
        "volume": "355 mL / 12 FL OZ",
        "description": "Wild mountain raspberries bursting with tangy effervescence. Electric pink meets cold silver fizz.",
        "taste_notes": json.dumps(["Wild Raspberry Spark", "Electric Berry Tang", "Zero Sugar", "Crisp Cold Finish"]),
        "sort_order": 5,
        "is_active": 1,
        "is_featured": 1
    }
]

DEFAULT_CONTENT = {
    # 01 Hero
    "sec1_headline_1": "SAME",
    "sec1_headline_2": "ICONIC TASTE",
    "sec1_headline_3": "ZERO SUGAR",
    "sec1_subheadline": "BOLD. REFRESHING. ALWAYS A GOOD IDEA.",
    "sec1_cta": "EXPLORE →",
    
    # 02 Fizz Moves You
    "sec2_headline_1": "A FIZZ THAT",
    "sec2_headline_2": "MOVES YOU",
    "sec2_subheadline": "Crisp bubbles. Bold moments. Diet Coke keeps life exciting.",
    "sec2_cta": "FEEL THE FIZZ ▶",

    # 03 Find Your Flavor
    "sec3_headline_1": "FIND",
    "sec3_headline_2": "YOUR FLAVOR",
    "sec3_subheadline": "Same bold taste. More ways to enjoy.",

    # 04 Press Play
    "sec4_headline_1": "PRESS",
    "sec4_headline_2": "PLAY",
    "sec4_subheadline": "The sound of something refreshing.",
    "sec4_cta": "OPEN THE CAN ▶",

    # 05 Brighter Days
    "sec5_headline_1": "GOOD TASTE",
    "sec5_headline_2": "FOR BRIGHTER DAYS",
    "sec5_subheadline": "From busy mornings to late night plans, Diet Coke fits every moment.",
    "sec5_cta": "DISCOVER MOMENTS →",

    # 06 Different Places
    "sec6_headline_1": "SAME ENERGY",
    "sec6_headline_2": "DIFFERENT PLACES",
    "sec6_subheadline": "Gym, work, travel or night out — Diet Coke goes wherever you do.",

    # 07 Real Refreshment
    "sec7_headline_1": "REAL",
    "sec7_headline_2": "REFRESHMENT",
    "sec7_subheadline": "Zero Sugar. Bold Taste. Made for what's next.",

    # 08 A Brighter Tomorrow
    "sec8_headline_1": "A BRIGHTER",
    "sec8_headline_2": "TOMORROW",
    "sec8_subheadline": "We're working towards a more sustainable future for the moments that matter.",
    "sec8_cta": "OUR COMMITMENT →",

    # 09 Real Moments
    "sec9_headline_1": "REAL PEOPLE",
    "sec9_headline_2": "REAL MOMENTS",
    "sec9_subheadline": "Tag your #DietCokeMoment",

    # 10 Moments Ahead
    "sec10_headline_1": "MORE",
    "sec10_headline_2": "GOOD MOMENTS",
    "sec10_headline_3": "AHEAD",
    "sec10_subheadline": "Grab a Diet Coke and make the next moment yours.",
    "sec10_cta": "BUY NOW ▶",

    "ticker_announcement": "/// LIVE CAN EXPERIENCE /// ZERO SUGAR /// UNAPOLOGETICALLY CRISP /// 100% RECYCLABLE ALUMINUM /// THAT'S SO DIET COKE ///"
}


def hash_password(password: str, salt: str = "dietcoke_salt_2026") -> str:
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(force_reseed=False):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS site_content (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)

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

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY,
            visits_count INTEGER DEFAULT 2410,
            can_pops_count INTEGER DEFAULT 842,
            sound_enabled_count INTEGER DEFAULT 618,
            flavor_clicks TEXT DEFAULT '{\"classic\": 1200, \"lime\": 520, \"cherry\": 640, \"vanilla\": 380, \"raspberry\": 450}'
        )
    """)

    if force_reseed:
        cursor.execute("DELETE FROM site_content")
        cursor.execute("DELETE FROM products")

    cursor.execute("SELECT COUNT(*) FROM site_content")
    if cursor.fetchone()[0] == 0:
        for k, v in DEFAULT_CONTENT.items():
            cursor.execute("INSERT INTO site_content (key, value) VALUES (?, ?)", (k, v))

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

    cursor.execute("SELECT COUNT(*) FROM admin_users")
    if cursor.fetchone()[0] == 0:
        default_salt = "dietcoke_salt_2026"
        pwd_hash = hash_password("dietcoke2026!", default_salt)
        cursor.execute("""
            INSERT INTO admin_users (username, password_hash, salt)
            VALUES (?, ?, ?)
        """, ("admin", pwd_hash, default_salt))

    cursor.execute("SELECT COUNT(*) FROM telemetry")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO telemetry (id, visits_count, can_pops_count, sound_enabled_count) VALUES (1, 2410, 842, 618)")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db(force_reseed=True)
    print("Database updated and re-seeded with 5 authentic inspiration flavors and 10 section copy keys.")

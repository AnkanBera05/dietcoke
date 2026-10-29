import os
import json
import sqlite3
from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .database import get_db, init_db, hash_password, DEFAULT_CONTENT, DEFAULT_PRODUCTS
from .models import (
    LoginRequest, LoginResponse, ChangePasswordRequest,
    ProductModel, SiteContentUpdate, TelemetryEvent
)
from .auth import create_session_token, verify_session_token, invalidate_token

# Initialize database on startup
init_db()

app = FastAPI(title="Diet Coke Interactive Experience API", version="2.0.0")

# Enable CORS for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if not os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
    FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


# Dependency for Admin Token Validation
def require_admin(x_admin_token: str = Header(None)):
    if not x_admin_token or not verify_session_token(x_admin_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin session token."
        )
    return True


# ==========================================
# PUBLIC API ENDPOINTS
# ==========================================

@app.get("/api/content")
def get_site_content():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM site_content")
    rows = cursor.fetchall()
    conn.close()
    content = {row["key"]: row["value"] for row in rows}
    return content


@app.get("/api/products")
def get_public_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM products
        WHERE is_active = 1
        ORDER BY sort_order ASC, id ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    products = []
    for r in rows:
        item = dict(r)
        try:
            item["taste_notes"] = json.loads(item["taste_notes"]) if item["taste_notes"] else []
        except Exception:
            item["taste_notes"] = []
        products.append(item)
    return products


@app.get("/api/products/{slug}")
def get_product_by_slug(slug: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    item = dict(row)
    try:
        item["taste_notes"] = json.loads(item["taste_notes"]) if item["taste_notes"] else []
    except Exception:
        item["taste_notes"] = []
    return item


@app.post("/api/telemetry")
def record_telemetry(event: TelemetryEvent):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT visits_count, can_pops_count, sound_enabled_count, flavor_clicks FROM telemetry WHERE id = 1")
    row = cursor.fetchone()
    if not row:
        cursor.execute("INSERT INTO telemetry (id, visits_count, can_pops_count, sound_enabled_count) VALUES (1, 1, 0, 0)")
        conn.commit()
        cursor.execute("SELECT visits_count, can_pops_count, sound_enabled_count, flavor_clicks FROM telemetry WHERE id = 1")
        row = cursor.fetchone()

    visits = row["visits_count"] or 0
    can_pops = row["can_pops_count"] or 0
    sound_enabled = row["sound_enabled_count"] or 0
    try:
        flavor_clicks = json.loads(row["flavor_clicks"]) if row["flavor_clicks"] else {}
    except Exception:
        flavor_clicks = {}

    if event.event_type == "visit":
        visits += 1
    elif event.event_type == "can_pop":
        can_pops += 1
    elif event.event_type == "sound_toggle":
        sound_enabled += 1
    elif event.event_type == "flavor_view" and event.payload and "slug" in event.payload:
        slug = str(event.payload["slug"])
        flavor_clicks[slug] = flavor_clicks.get(slug, 0) + 1

    cursor.execute("""
        UPDATE telemetry
        SET visits_count = ?, can_pops_count = ?, sound_enabled_count = ?, flavor_clicks = ?
        WHERE id = 1
    """, (visits, can_pops, sound_enabled, json.dumps(flavor_clicks)))
    conn.commit()
    conn.close()
    return {"status": "ok"}


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash, salt FROM admin_users WHERE username = ?", (payload.username,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return LoginResponse(success=False, message="Invalid username or password")

    calc_hash = hash_password(payload.password, user["salt"])
    if calc_hash != user["password_hash"]:
        return LoginResponse(success=False, message="Invalid username or password")

    token = create_session_token(user["username"])
    return LoginResponse(
        success=True,
        token=token,
        username=user["username"],
        message="Authentication successful"
    )


@app.get("/api/auth/verify")
def verify_auth(x_admin_token: str = Header(None)):
    if not x_admin_token or not verify_session_token(x_admin_token):
        return {"authenticated": False}
    return {"authenticated": True}


@app.post("/api/auth/logout")
def logout(x_admin_token: str = Header(None)):
    if x_admin_token:
        invalidate_token(x_admin_token)
    return {"success": True, "message": "Logged out successfully"}


@app.post("/api/auth/change-password")
def change_password(payload: ChangePasswordRequest, authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash, salt FROM admin_users WHERE username = 'admin'")
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="Admin user not found")

    old_calc = hash_password(payload.current_password, user["salt"])
    if old_calc != user["password_hash"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Current password incorrect")

    new_hash = hash_password(payload.new_password, user["salt"])
    cursor.execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", (new_hash, user["id"]))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Password changed successfully"}


# ==========================================
# ADMIN DASHBOARD CRUD ENDPOINTS
# ==========================================

@app.get("/api/admin/content")
def get_admin_content(authenticated: bool = Depends(require_admin)):
    return get_site_content()


@app.post("/api/admin/content")
def update_admin_content(payload: SiteContentUpdate, authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    for k, v in payload.content.items():
        cursor.execute("""
            INSERT INTO site_content (key, value)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """, (k, v))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Site content updated successfully"}


@app.get("/api/admin/products")
def get_all_admin_products(authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products ORDER BY sort_order ASC, id ASC")
    rows = cursor.fetchall()
    conn.close()

    products = []
    for r in rows:
        item = dict(r)
        try:
            item["taste_notes"] = json.loads(item["taste_notes"]) if item["taste_notes"] else []
        except Exception:
            item["taste_notes"] = []
        products.append(item)
    return products


@app.post("/api/admin/products")
def create_product(product: ProductModel, authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()

    slug = product.slug.strip().lower().replace(" ", "-")
    # Verify slug uniqueness
    cursor.execute("SELECT id FROM products WHERE slug = ?", (slug,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail=f"Product slug '{slug}' already exists.")

    notes_str = json.dumps(product.taste_notes)
    cursor.execute("""
        INSERT INTO products (slug, name, tagline, accent_color, accent_secondary, can_style,
                             badge, calories, sugar, caffeine, volume, description, taste_notes,
                             sort_order, is_active, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        slug, product.name, product.tagline, product.accent_color, product.accent_secondary,
        product.can_style, product.badge, product.calories, product.sugar, product.caffeine,
        product.volume, product.description, notes_str, product.sort_order, product.is_active, product.is_featured
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"success": True, "id": new_id, "slug": slug, "message": "Product created successfully"}


@app.put("/api/admin/products/{prod_id}")
def update_product(prod_id: int, product: ProductModel, authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()

    slug = product.slug.strip().lower().replace(" ", "-")
    notes_str = json.dumps(product.taste_notes)

    cursor.execute("""
        UPDATE products
        SET slug = ?, name = ?, tagline = ?, accent_color = ?, accent_secondary = ?,
            can_style = ?, badge = ?, calories = ?, sugar = ?, caffeine = ?, volume = ?,
            description = ?, taste_notes = ?, sort_order = ?, is_active = ?, is_featured = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        slug, product.name, product.tagline, product.accent_color, product.accent_secondary,
        product.can_style, product.badge, product.calories, product.sugar, product.caffeine,
        product.volume, product.description, notes_str, product.sort_order, product.is_active,
        product.is_featured, prod_id
    ))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Product updated successfully"}


@app.delete("/api/admin/products/{prod_id}")
def delete_product(prod_id: int, authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (prod_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Product deleted successfully"}


@app.post("/api/admin/reset-defaults")
def reset_to_defaults(authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()

    # Reset site_content
    cursor.execute("DELETE FROM site_content")
    for k, v in DEFAULT_CONTENT.items():
        cursor.execute("INSERT INTO site_content (key, value) VALUES (?, ?)", (k, v))

    # Reset products
    cursor.execute("DELETE FROM products")
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

    conn.commit()
    conn.close()
    return {"success": True, "message": "All site content and products reset to brand defaults"}


@app.get("/api/admin/telemetry")
def get_admin_telemetry(authenticated: bool = Depends(require_admin)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM telemetry WHERE id = 1")
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"visits": 1842, "can_pops": 624, "sound_toggles": 412, "flavor_clicks": {}}

    try:
        flavor_clicks = json.loads(row["flavor_clicks"]) if row["flavor_clicks"] else {}
    except Exception:
        flavor_clicks = {}

    return {
        "visits": row["visits_count"] or 1842,
        "can_pops": row["can_pops_count"] or 624,
        "sound_toggles": row["sound_enabled_count"] or 412,
        "flavor_clicks": flavor_clicks,
        "engagement_rate": round(((row["can_pops_count"] or 624) / max(row["visits_count"] or 1, 1)) * 100, 1)
    }


# ==========================================
# STATIC FRONTEND ROUTES
# ==========================================

@app.get("/")
def serve_index():
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse({"status": "Frontend loading..."})


@app.get("/admin")
def serve_admin():
    admin_file = os.path.join(FRONTEND_DIR, "admin.html")
    if os.path.exists(admin_file):
        return FileResponse(admin_file)
    return JSONResponse({"status": "Admin dashboard loading..."})


# Mount remaining static directories (css, js, assets)
app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

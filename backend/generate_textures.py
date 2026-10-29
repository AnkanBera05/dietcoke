import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

TEXTURE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "assets", "textures"))
os.makedirs(TEXTURE_DIR, exist_ok=True)

WIDTH = 2048
HEIGHT = 1024


def create_brushed_aluminum(width, height, base_color=(220, 224, 228)):
    img = Image.new("RGBA", (width, height), (*base_color, 255))
    pixels = img.load()
    
    # Brushed aluminum horizontal streaks and specular vertical gradients
    random.seed(42)
    # Pre-generate horizontal noise lines
    noise_rows = [random.uniform(-18, 18) for _ in range(height)]
    
    for y in range(height):
        # Vertical lighting curvature (studio light setup on cylinder)
        specular_light = math.sin((y / height) * math.pi) * 15
        row_noise = noise_rows[y]
        
        for x in range(width):
            # Horizontal cylinder lighting simulation (highlight bands)
            x_norm = x / width
            highlight_1 = math.exp(-((x_norm - 0.25) ** 2) / 0.015) * 45
            highlight_2 = math.exp(-((x_norm - 0.75) ** 2) / 0.02) * 35
            ambient_shadow = (math.cos(x_norm * math.pi * 2) * 0.5 + 0.5) * 20
            
            # Subtle micro grain
            micro_grain = random.uniform(-4, 4)
            
            delta = row_noise * 0.4 + specular_light + highlight_1 + highlight_2 - ambient_shadow + micro_grain
            
            r = min(255, max(0, int(base_color[0] + delta)))
            g = min(255, max(0, int(base_color[1] + delta)))
            b = min(255, max(0, int(base_color[2] + delta * 1.05))) # subtle cool silver tone
            pixels[x, y] = (r, g, b, 255)
            
    return img


def draw_diet_coke_graphics(base_img, flavor_name="ORIGINAL", accent_hex="#E4002B", subtext="NO SUGAR NO CALORIES"):
    draw = ImageDraw.Draw(base_img)
    
    # Try finding standard fonts or use default
    font_bold = None
    font_sub = None
    font_script = None
    font_small = None
    
    font_candidates = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\impact.ttf",
        "C:\\Windows\\Fonts\\seguihb.ttf",
        "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for fc in font_candidates:
        if os.path.exists(fc):
            try:
                font_bold = ImageFont.truetype(fc, 160)
                font_script = ImageFont.truetype("C:\\Windows\\Fonts\\segoesc.ttf" if os.path.exists("C:\\Windows\\Fonts\\segoesc.ttf") else fc, 90)
                font_sub = ImageFont.truetype(fc, 32)
                font_small = ImageFont.truetype(fc, 20)
                break
            except Exception:
                pass
                
    if not font_bold:
        font_bold = ImageFont.load_default()
        font_script = font_bold
        font_sub = font_bold
        font_small = font_bold

    # Flavor-specific decorative dynamic band or gradient splash
    r_hex = int(accent_hex[1:3], 16)
    g_hex = int(accent_hex[3:5], 16)
    b_hex = int(accent_hex[5:7], 16)
    
    if flavor_name != "ORIGINAL":
        # Draw dynamic angled accent wave across can
        for i in range(120):
            alpha = int(180 * (1 - i / 120))
            y_offset = int(math.sin(i * 0.05) * 20)
            draw.line([(300 + i * 8, 120 + y_offset), (300 + i * 8, 920 + y_offset)],
                      fill=(r_hex, g_hex, b_hex, alpha), width=8)

    # FRONT FACING LABEL AREA (Centered around x = 500 to 1100)
    center_x = 750
    center_y = 500

    # Draw Iconic vertical / rotated or giant Diet Coke typography
    # "Diet" script in white or red
    draw.text((center_x - 180, center_y - 240), "Diet", fill=(r_hex, g_hex, b_hex, 255), font=font_script)
    
    # "Coke" in massive bold letters
    draw.text((center_x - 220, center_y - 140), "Coke", fill=(r_hex, g_hex, b_hex, 255), font=font_bold)
    
    # Flavor badge if applicable
    if flavor_name != "ORIGINAL":
        badge_text = flavor_name
        # Draw pill badge
        bx1, by1, bx2, by2 = center_x - 160, center_y + 70, center_x + 160, center_y + 120
        draw.rounded_rectangle([bx1, by1, bx2, by2], radius=15, fill=(r_hex, g_hex, b_hex, 255))
        draw.text((center_x - 130, center_y + 78), badge_text, fill=(255, 255, 255, 255), font=font_sub)

    # Subtext "NO SUGAR NO CALORIES / CRISP TASTE"
    draw.text((center_x - 200, center_y + 160), subtext, fill=(r_hex, g_hex, b_hex, 240), font=font_sub)
    draw.text((center_x - 140, center_y + 210), "CRISP TASTE", fill=(r_hex, g_hex, b_hex, 240), font=font_sub)
    draw.text((center_x - 180, center_y + 270), "12 FL OZ (355 mL)", fill=(90, 95, 105, 220), font=font_small)

    # BACK OF CAN (x = 1400 to 1950): Nutrition Facts, Barcode, Aluminum badge
    back_x = 1500
    draw.rectangle([back_x, 220, back_x + 320, 800], outline=(100, 105, 115, 200), width=3)
    draw.text((back_x + 20, 240), "Nutrition Facts", fill=(40, 45, 50, 255), font=font_sub)
    draw.line([(back_x + 10, 290), (back_x + 310, 290)], fill=(40, 45, 50, 255), width=8)
    draw.text((back_x + 20, 310), "Serving size   1 Can (355ml)", fill=(40, 45, 50, 255), font=font_small)
    draw.line([(back_x + 10, 345), (back_x + 310, 345)], fill=(40, 45, 50, 255), width=4)
    draw.text((back_x + 20, 360), "Amount per serving", fill=(60, 65, 70, 255), font=font_small)
    draw.text((back_x + 20, 385), "Calories  0", fill=(20, 25, 30, 255), font=font_sub)
    draw.line([(back_x + 10, 435), (back_x + 310, 435)], fill=(40, 45, 50, 255), width=4)
    draw.text((back_x + 20, 450), "Total Fat 0g             0%", fill=(50, 55, 60, 255), font=font_small)
    draw.text((back_x + 20, 480), "Sodium 40mg           2%", fill=(50, 55, 60, 255), font=font_small)
    draw.text((back_x + 20, 510), "Total Carb 0g           0%", fill=(50, 55, 60, 255), font=font_small)
    draw.text((back_x + 35, 540), "Total Sugars 0g", fill=(50, 55, 60, 255), font=font_small)
    draw.text((back_x + 35, 570), "Includes 0g Added Sugars", fill=(50, 55, 60, 255), font=font_small)
    draw.text((back_x + 20, 600), "Protein 0g               0%", fill=(50, 55, 60, 255), font=font_small)
    draw.line([(back_x + 10, 635), (back_x + 310, 635)], fill=(40, 45, 50, 255), width=3)
    draw.text((back_x + 20, 650), "PHENYLKETONURICS:", fill=(80, 85, 90, 255), font=font_small)
    draw.text((back_x + 20, 675), "CONTAINS PHENYLALANINE", fill=(80, 85, 90, 255), font=font_small)
    draw.text((back_x + 20, 710), "Caffeine Content: 46mg/can", fill=(80, 85, 90, 255), font=font_small)
    draw.text((back_x + 20, 745), "CARBONATED WATER, CARAMEL COLOR,", fill=(80, 85, 90, 255), font=font_small)

    # Barcode
    bar_x = back_x + 350
    for i in range(40):
        bw = random.choice([2, 4, 6, 8])
        draw.rectangle([bar_x, 620, bar_x + bw, 780], fill=(20, 25, 30, 255))
        bar_x += bw + random.choice([2, 3, 5])
    draw.text((back_x + 360, 790), "0 49000 00045 8", fill=(50, 55, 60, 255), font=font_small)

    # Recyclable Aluminum logo
    draw.text((center_x - 180, 880), "PLEASE RECYCLE  *  100% INFINITELY RECYCLABLE ALUMINUM", fill=(100, 105, 115, 200), font=font_small)
    
    return base_img


def create_condensation_normal_map(width, height):
    """Generates a tangent space normal map with realistic water droplets."""
    normal_img = Image.new("RGB", (width, height), (128, 128, 255))
    draw = ImageDraw.Draw(normal_img)
    
    random.seed(101)
    
    # Generate ~1200 realistic water droplets
    for _ in range(1200):
        cx = random.randint(20, width - 20)
        cy = random.randint(20, height - 20)
        radius = random.choice([3, 4, 5, 6, 8, 11, 14, 18])
        
        # Draw hemispherical normal perturbation
        for r in range(radius, 0, -1):
            ratio = r / radius
            nx = int(128 + (cx - cx) + random.uniform(-40, 40) * (1 - ratio))
            ny = int(128 - ratio * 70)  # top is tilted upward (green channel)
            nz = int(255 * math.sqrt(max(0, 1 - (1 - ratio) ** 2)))
            draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                         fill=(min(255, max(0, nx)), min(255, max(0, ny)), min(255, max(0, nz))))
                         
    # Also add vertical condensation drip trails
    for _ in range(25):
        sx = random.randint(50, width - 50)
        sy = random.randint(100, height - 300)
        drip_len = random.randint(60, 180)
        for step in range(drip_len):
            offset_x = int(math.sin(step * 0.1) * 3)
            draw.point((sx + offset_x, sy + step), fill=(120, 80, 240))
            draw.point((sx + offset_x + 1, sy + step), fill=(140, 180, 240))
            
    # Soft blur to smooth normal transitions
    normal_img = normal_img.filter(ImageFilter.GaussianBlur(1.2))
    return normal_img


def create_can_lid_texture(size=512):
    """Generates the realistic metallic can lid with pull-tab contour."""
    lid = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(lid)
    
    center = size // 2
    r_outer = size // 2 - 4
    
    # Concentric metallic circles
    for r in range(r_outer, 0, -2):
        shade = 180 + int(math.sin(r * 0.15) * 35) + int(random.uniform(-5, 5))
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(shade, shade, shade + 5, 255))
        
    # Chime crimped rim
    draw.ellipse([center - r_outer, center - r_outer, center + r_outer, center + r_outer],
                 outline=(100, 105, 110, 255), width=6)
    draw.ellipse([center - (r_outer - 15), center - (r_outer - 15), center + (r_outer - 15), center + (r_outer - 15)],
                 outline=(130, 135, 140, 255), width=4)
                 
    # Stamped drinking opening aperture (teardrop/oval)
    mouth_x1, mouth_y1 = center - 45, center - 140
    mouth_x2, mouth_y2 = center + 45, center - 35
    draw.rounded_rectangle([mouth_x1, mouth_y1, mouth_x2, mouth_y2], radius=35,
                           fill=(130, 135, 140, 255), outline=(70, 75, 80, 255), width=4)
    # Scored fracture line
    draw.rounded_rectangle([mouth_x1 + 6, mouth_y1 + 6, mouth_x2 - 6, mouth_y2 - 6], radius=28,
                           outline=(50, 55, 60, 255), width=2)

    # Rivet button in center
    draw.ellipse([center - 14, center - 20, center + 14, center + 8], fill=(215, 220, 225, 255), outline=(90, 95, 100, 255), width=3)

    # Aluminum Pull Tab
    tab_x1, tab_y1 = center - 38, center - 15
    tab_x2, tab_y2 = center + 38, center + 145
    draw.rounded_rectangle([tab_x1, tab_y1, tab_x2, tab_y2], radius=22,
                           fill=(235, 240, 245, 255), outline=(100, 105, 110, 255), width=3)
    # Tab finger ring hole
    draw.ellipse([center - 20, center + 45, center + 20, center + 115], fill=(160, 165, 170, 255), outline=(80, 85, 90, 255), width=3)

    return lid


def main():
    print("Generating brushed aluminum base texture...")
    brushed_base = create_brushed_aluminum(WIDTH, HEIGHT)
    
    # 1. Original Diet Coke
    print("Generating Original Diet Coke texture...")
    orig = brushed_base.copy()
    orig = draw_diet_coke_graphics(orig, flavor_name="ORIGINAL", accent_hex="#E4002B", subtext="NO SUGAR NO CALORIES")
    orig.save(os.path.join(TEXTURE_DIR, "can_label_original.png"), "PNG")
    
    # 2. Feisty Cherry
    print("Generating Cherry Diet Coke texture...")
    cherry = brushed_base.copy()
    cherry = draw_diet_coke_graphics(cherry, flavor_name="FEISTY CHERRY", accent_hex="#B81D39", subtext="DARK CHERRY INFUSED")
    cherry.save(os.path.join(TEXTURE_DIR, "can_label_cherry.png"), "PNG")

    # 3. Sublime Lime
    print("Generating Lime Diet Coke texture...")
    lime = brushed_base.copy()
    lime = draw_diet_coke_graphics(lime, flavor_name="SUBLIME LIME", accent_hex="#00A859", subtext="KEY LIME CITRUS SURGE")
    lime.save(os.path.join(TEXTURE_DIR, "can_label_lime.png"), "PNG")

    # 4. Velvet Vanilla
    print("Generating Vanilla Diet Coke texture...")
    vanilla = brushed_base.copy()
    vanilla = draw_diet_coke_graphics(vanilla, flavor_name="VELVET VANILLA", accent_hex="#E5A93C", subtext="MADAGASCAR VANILLA")
    vanilla.save(os.path.join(TEXTURE_DIR, "can_label_vanilla.png"), "PNG")

    # 5. Condensation Normal Map
    print("Generating Condensation Normal Map...")
    normal_map = create_condensation_normal_map(WIDTH, HEIGHT)
    normal_map.save(os.path.join(TEXTURE_DIR, "can_normal_droplets.png"), "PNG")

    # 6. Can Lid
    print("Generating Can Lid texture...")
    lid = create_can_lid_texture(512)
    lid.save(os.path.join(TEXTURE_DIR, "can_lid.png"), "PNG")

    print("All textures generated successfully in:", TEXTURE_DIR)


if __name__ == "__main__":
    main()

import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

def create_quote_card(text, author_name="Nitish Ranjan", author_title="Founder, Youthfluence", output_path="quote_card.png"):
    # Constants for the "Minimalist White" design
    WIDTH, HEIGHT = 1080, 1080
    BG_COLOR = (248, 248, 248)  # Clean off-white
    TEXT_COLOR = (20, 20, 20)      # Rich black
    BORDER_COLOR = (80, 80, 80)     # Subtle dark border
    
    # Cloud-Compatible Font Paths (Common Linux / Railway paths)
    # We will try multiple paths and fallback to default
    FONT_PATHS = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/System/Library/Fonts/Avenir Next Condensed.ttc", # Keep Mac path for local testing
        "Arial Bold.ttf"
    ]
    
    # Create Canvas
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 1. Draw border
    margin = 50
    draw.rectangle([margin, margin, WIDTH - margin, HEIGHT - margin], outline=BORDER_COLOR, width=1)
    
    # 2. Top Left Branding
    brand_font = None
    for path in FONT_PATHS:
        try:
            brand_font = ImageFont.truetype(path.replace("Bold", "Regular"), 38)
            break
        except:
            continue
    if not brand_font: brand_font = ImageFont.load_default()
        
    brand_text = "YOUTHFLUENCE"
    draw.text((90, 90), brand_text, font=brand_font, fill=TEXT_COLOR)
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    draw.line([(90, 135), (90 + brand_w, 135)], fill=TEXT_COLOR, width=1)

    # 3. DYNAMIC QUOTE SIZING LOGIC
    quote_text = text.upper().strip()
    
    # Constraints
    max_y_start = 240
    max_y_end = HEIGHT - 200 
    max_block_height = max_y_end - max_y_start
    
    font_size = 120
    wrap_width = 14
    
    # Loop to shrink font until it fits
    while font_size > 40:
        quote_font = None
        for path in FONT_PATHS:
            try:
                quote_font = ImageFont.truetype(path, font_size)
                break
            except:
                continue
        if not quote_font: quote_font = ImageFont.load_default()
            
        wrapper = textwrap.TextWrapper(width=wrap_width)
        wrapped_lines = wrapper.wrap(text=quote_text)
        
        line_spacing = font_size * 1.1
        total_text_height = len(wrapped_lines) * line_spacing
        
        if total_text_height <= max_block_height:
            current_y = max_y_start
            for line in wrapped_lines:
                draw.text((90, current_y), line, font=quote_font, fill=TEXT_COLOR)
                current_y += line_spacing
            break
        else:
            font_size -= 5
            if font_size < 100: wrap_width = 18
            if font_size < 80: wrap_width = 22
            if font_size < 60: wrap_width = 28

    # 4. Bottom Right Attribution
    attr_name_font = None
    attr_title_font = None
    for path in FONT_PATHS:
        try:
            attr_name_font = ImageFont.truetype(path, 30)
            attr_title_font = ImageFont.truetype(path.replace("Bold", "Regular"), 22)
            break
        except:
            continue
    if not attr_name_font: attr_name_font = attr_title_font = ImageFont.load_default()

    name_text = author_name.upper()
    name_bbox = draw.textbbox((0, 0), name_text, font=attr_name_font)
    name_w = name_bbox[2] - name_bbox[0]
    
    title_text = author_title.upper()
    title_bbox = draw.textbbox((0, 0), title_text, font=attr_title_font)
    title_w = title_bbox[2] - title_bbox[0]
    
    base_x, base_y = WIDTH - 90, HEIGHT - 140
    draw.text((base_x - name_w, base_y), name_text, font=attr_name_font, fill=TEXT_COLOR)
    draw.text((base_x - title_w, base_y + 42), title_text, font=attr_title_font, fill=TEXT_COLOR)
    
    draw.line([(base_x - 60, base_y - 20), (base_x, base_y - 20)], fill=TEXT_COLOR, width=1)

    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True) if os.path.dirname(output_path) else None
    img.save(output_path)
    return output_path

import sys
from PIL import Image

def process_sticker(input_path, output_path):
    # Load image and ensure it has an alpha channel
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Chroma key condition: Green is highly dominant
        # E.g. Neon green is roughly around (0, 255, 0)
        # Any green where G > 180 and R < 150 and B < 150 gets made transparent
        if item[1] > 180 and item[0] < 150 and item[2] < 150:
            newData.append((255, 255, 255, 0)) # Make Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path}")

process_sticker(sys.argv[1], sys.argv[2])

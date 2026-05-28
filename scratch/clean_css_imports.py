import os
import shutil
import re

css_path = r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\globals-insforge.css"

if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    
    # Remove imports of .html files
    # E.g., @import "../../../../fonts.googleapis.com/css2-4568ef45.html";
    css = re.sub(r'@import\s+[^;]+\.html[^;]*;', '', css)
    
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css)
    print("HTML CSS imports removed from globals-insforge.css")

# Clean Next.js cache directory
next_dir = r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\.next"
if os.path.exists(next_dir):
    try:
        shutil.rmtree(next_dir)
        print("Cleared .next cache folder successfully")
    except Exception as e:
        print(f"Error clearing .next folder: {e}")
else:
    print(".next cache folder did not exist")

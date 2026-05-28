import os
import re

css_dir = r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\insforge.dev\_next\static\css"
css_files = [os.path.join(css_dir, f) for f in os.listdir(css_dir) if f.endswith('.css')]

variables = {}
font_families = set()
colors = set()

for css_file in css_files:
    with open(css_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
        # Look for variables
        found_vars = re.findall(r"--[a-zA-Z0-9_-]+:\s*[^;}]+", content)
        for var in found_vars:
            name, val = var.split(":", 1)
            variables[name.strip()] = val.strip()
            
        # Look for font families
        found_fonts = re.findall(r"font-family:\s*[^;}]+", content)
        for font in found_fonts:
            font_families.add(font.strip())
            
        # Look for hex color patterns
        found_colors = re.findall(r"#[0-9a-fA-F]{3,8}", content)
        for col in found_colors:
            colors.add(col.lower())

print("--- CSS VARIABLES ---")
for k, v in sorted(variables.items()):
    print(f"{k}: {v}")

print("\n--- FONT FAMILIES ---")
for f in font_families:
    print(f)

print("\n--- SAMPLE HEX COLORS ---")
print(list(colors)[:40])

import os
import re
import json

css_dir = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\_next\static\css"
output_file = r"C:\Users\aksha\devpulse-complete-codebase\insforge-design-tokens.json"

css_files = [os.path.join(css_dir, f) for f in os.listdir(css_dir) if f.endswith('.css')]

tokens = {
    "colors": {},
    "fonts": {},
    "spacing": {},
    "animations": {},
    "breakpoints": {}
}

# Regexes
var_re = re.compile(r'--([\w-]+)\s*:\s*([^;}]+)')
keyframes_re = re.compile(r'@keyframes\s+([\w-]+)\s*\{([^}]+)\}')
font_re = re.compile(r'font-family\s*:\s*([^;}]+)')

all_variables = {}
all_keyframes = {}
font_families = set()

for file_path in css_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Find variables
        for match in var_re.finditer(content):
            name, val = match.groups()
            all_variables[name] = val.strip()
            
        # Find keyframes
        # Keyframes can contain nested braces, so we need a more robust parser or regex
        # A simple recursive regex or brace matcher:
        pos = 0
        while True:
            match = re.search(r'@keyframes\s+([\w-]+)\s*\{', content[pos:])
            if not match:
                break
            name = match.group(1)
            start_idx = pos + match.end()
            # find matching brace
            brace_count = 1
            idx = start_idx
            while brace_count > 0 and idx < len(content):
                if content[idx] == '{':
                    brace_count += 1
                elif content[idx] == '}':
                    brace_count -= 1
                idx += 1
            keyframe_body = content[start_idx:idx-1]
            all_keyframes[name] = keyframe_body.strip()
            pos = idx

        # Find font-family declarations
        for match in font_re.finditer(content):
            font_families.add(match.group(1).strip())

# Clean up variables and extract colors/fonts/spacing
# Filter/classify variables
for name, val in all_variables.items():
    if 'color' in name or 'bg' in name or 'text' in name or 'border' in name or 'accent' in name:
        tokens["colors"][name] = val
    elif 'font' in name:
        tokens["fonts"][name] = val
    elif 'space' in name or 'padding' in name or 'margin' in name or 'width' in name or 'height' in name:
        tokens["spacing"][name] = val
    else:
        # put under general variables for now
        tokens["spacing"][name] = val

# Standard design tokens as required by prompt
# Custom properties to extract/document:
# 1. Colors
# 2. Fonts
# 3. Spacing
# 4. Animations
# 5. Breakpoints

# Let's search inside the CSS files for breakpoints in @media queries
breakpoints = set()
media_re = re.compile(r'@media\s*\(([^)]+)\)')
for file_path in css_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        for match in media_re.finditer(content):
            cond = match.group(1)
            # e.g., min-width: 768px
            breakpoints.add(cond.strip())

tokens["breakpoints"] = list(breakpoints)
tokens["animations"] = all_keyframes
tokens["font_families_scraped"] = list(font_families)

# Map requested values or defaults if not found directly
# Keep all colors but replace accent with #06b6d4
# Standardize design tokens structure
std_tokens = {
  "colors": {
    "bg": all_variables.get("background", "near-black"),
    "bgCard": all_variables.get("card", "dark-gray"),
    "accent": "#06b6d4",
    "accent-hover": "#0891b2",
    "accent-glow": "rgba(6, 182, 212, 0.2)",
    "text": all_variables.get("foreground", "white"),
    "muted": all_variables.get("muted-foreground", "gray"),
    "border": all_variables.get("border", "dark-border")
  },
  "fonts": {
    "heading": "Manrope, sans-serif",
    "body": "Inter, sans-serif",
    "mono": "IBM Plex Mono, monospace"
  },
  "spacing": {
    "sectionPY": "py-24",
    "cardPadding": "p-6"
  },
  "animations": {
    "logo-scroll": "logo-scroll 25s linear infinite",
    "shield-pulse": "shield-pulse 2s infinite ease-in-out",
    "power-glow": "power-glow 1.5s infinite alternate",
    "graph-bounce": "graph-bounce 3s infinite ease-in-out",
    "brain-pulse": "brain-pulse 2s infinite ease-in-out",
    "ghost-fade": "ghost-fade 3s infinite alternate",
    "key-rotate": "key-rotate 4s infinite linear",
    "connect-network": "connect-network 5s infinite alternate",
    "draw-check": "draw-check 2s infinite"
  },
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },
  "scraped_variables": all_variables,
  "scraped_keyframes": list(all_keyframes.keys())
}

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(std_tokens, f, indent=2)

print("Tokens extracted to:", output_file)

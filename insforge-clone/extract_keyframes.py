import os
import re

css_dir = r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\insforge.dev\_next\static\css"
css_files = [os.path.join(css_dir, f) for f in os.listdir(css_dir) if f.endswith('.css')]

keyframes = {}

for css_file in css_files:
    with open(css_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
        # Regex to find keyframes
        matches = re.finditer(r"@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+(\{[^}]+\})?[^}]+)\}", content)
        for m in matches:
            name = m.group(1)
            body = m.group(2)
            keyframes[name] = body.strip()

print(f"Found {len(keyframes)} keyframes:")
for name in sorted(keyframes.keys()):
    print(f"\nKeyframe: {name}")
    # Print first few lines of the keyframe body
    lines = keyframes[name].split('\n')
    print("  " + "\n  ".join(lines[:10]))

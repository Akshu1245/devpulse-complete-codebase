with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\clean_body.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find sections near the end containing buttons or links to register
matches = [m.start() for m in re.finditer("Start Building", content)]
if not matches:
    matches = [m.start() for m in re.finditer("cta", content, re.IGNORECASE)]

print("Matches for CTA:")
for idx in matches[:5]:
    print(content[idx-300:idx+800])
    print("-" * 50)

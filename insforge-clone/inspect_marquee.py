with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\clean_body.html", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Search for "works perfectly"
matches = [m.start() for m in re.finditer("perfectly", content, re.IGNORECASE)]
print("Matches for 'perfectly':")
for idx in matches:
    print(content[idx-200:idx+300])
    print("-" * 50)

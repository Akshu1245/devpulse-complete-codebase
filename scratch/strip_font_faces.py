import re

css_path = r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\globals-insforge.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Remove @font-face { ... } declarations
# We'll use a brace matcher or regex
# Since @font-face is simple, a regex can find them
# Or a recursive brace matcher for @font-face
pos = 0
while True:
    match = re.search(r'@font-face\s*\{', css[pos:])
    if not match:
        break
    
    start_idx = pos + match.start()
    brace_start = start_idx + match.group(0).find('{')
    
    # brace matcher
    brace_count = 1
    i = brace_start + 1
    while brace_count > 0 and i < len(css):
        if css[i] == '{':
            brace_count += 1
        elif css[i] == '}':
            brace_count -= 1
        i += 1
        
    if brace_count == 0:
        # Strip it
        css = css[:start_idx] + css[i:]
        pos = start_idx
    else:
        pos = start_idx + len(match.group(0))

# Print all remaining urls to see if they might cause errors
urls = re.findall(r'url\(([^)]+)\)', css)
print("Found URLs in CSS:", urls)

# Replace relative URLs if they contain .woff or .woff2
# Wait, let's look at the remaining URLs. If they are not found or relative, let's inspect them.
with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Font-face declarations removed successfully.")

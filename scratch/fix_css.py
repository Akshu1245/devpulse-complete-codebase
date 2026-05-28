import re

css_path = r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\globals-insforge.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# We want to remove:
# @layer theme { ... } -> keep inner
# @layer base { ... } -> keep inner
# @layer utilities { ... } -> keep inner
# @layer components; -> remove entirely

# Let's find occurrences of `@layer name {` and remove them along with their closing braces.
# We'll use a stack-based parser to find matching braces for @layer declarations.
output = []
pos = 0

while pos < len(css):
    # Find next occurrence of @layer
    match = re.search(r'@layer\s+([a-zA-Z0-9_-]+)\s*(\{)?|@layer\s+([a-zA-Z0-9_-]+)\s*;', css[pos:])
    if not match:
        output.append(css[pos:])
        break
    
    start_idx = pos + match.start()
    # Add preceding text
    output.append(css[pos:start_idx])
    
    matched_str = match.group(0)
    
    if matched_str.endswith(';'):
        # Just an empty layer definition like @layer components;
        # skip it
        pos = start_idx + len(matched_str)
        continue
    
    # It has a opening brace
    # Find matching closing brace
    brace_start = start_idx + matched_str.find('{')
    brace_count = 1
    idx = brace_start + 1
    
    while brace_count > 0 and idx < len(css):
        if css[idx] == '{':
            brace_count += 1
        elif css[idx] == '}':
            brace_count -= 1
        idx += 1
        
    if brace_count == 0:
        # We found the closing brace
        # Extract content inside braces
        inner_content = css[brace_start+1:idx-1]
        output.append(inner_content)
        pos = idx
    else:
        # Malformed, just keep it
        output.append(matched_str)
        pos = start_idx + len(matched_str)

new_css = "".join(output)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(new_css)

print("Layer wrappers stripped successfully from globals-insforge.css")

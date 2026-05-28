import os

# 1. Re-merge CSS files first to get a clean starting point
css_dir = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\_next\static\css"
output_css = r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\globals-insforge.css"

css_files = [os.path.join(css_dir, f) for f in os.listdir(css_dir) if f.endswith('.css')]

full_css = []
for file_path in css_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        full_css.append(f.read())
    full_css.append("\n")

# Append overrides
overrides = """
/* RakshEx Accent Color Overrides */
:root {
  --accent: #06b6d4;
  --accent-hover: #0891b2;
  --accent-glow: rgba(6, 182, 212, 0.2);
}

/* Custom Animation Classes for Feature Cards & Logos */
@keyframes logo-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes shield-pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(6, 182, 212, 0)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.6)); }
}

@keyframes power-glow {
  0% { filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.2)); }
  100% { filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)); }
}

@keyframes graph-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes brain-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

@keyframes ghost-fade {
  0% { opacity: 0.3; }
  100% { opacity: 0.9; }
}

@keyframes key-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes connect-network {
  0% { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 1; }
}

@keyframes draw-check {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

.animate-logo-scroll {
  display: flex;
  width: max-content;
  animation: logo-scroll 25s linear infinite;
}

.hover-shield-pulse:hover svg {
  animation: shield-pulse 2s infinite ease-in-out;
}

.hover-power-glow:hover svg {
  animation: power-glow 1s infinite alternate;
  color: #ef4444 !important;
}

.hover-graph-bounce:hover svg {
  animation: graph-bounce 1.5s infinite ease-in-out;
}

.hover-brain-pulse:hover svg {
  animation: brain-pulse 2s infinite ease-in-out;
}

.hover-ghost-fade:hover svg {
  animation: ghost-fade 1.5s infinite alternate;
}

.hover-key-rotate:hover svg {
  animation: key-rotate 3s infinite linear;
}

.hover-connect-network:hover svg {
  animation: connect-network 2s infinite alternate;
}

.hover-draw-check:hover svg {
  stroke-dasharray: 24;
  animation: draw-check 1.5s ease-in-out forwards;
}
"""
full_css.append(overrides)

css_content = "\n".join(full_css)

# Replace 'InsForge' -> 'RakshEx', etc. inside the CSS
css_content = css_content.replace('InsForge', 'RakshEx')
css_content = css_content.replace('insforge', 'rakshex')
css_content = css_content.replace('INSFORGE', 'RAKSHEX')

# Remove `@layer components;`
css_content = css_content.replace('@layer components;', '')

# We will parse layer declarations:
# - @layer theme {
# - @layer base {
# - @layer utilities {
# and remove their headers and their matching closing braces.

def strip_layer(css_str, layer_name):
    header = f"@layer {layer_name}"
    pos = 0
    while True:
        idx = css_str.find(header, pos)
        if idx == -1:
            break
        
        # find the opening brace '{'
        brace_start = css_str.find('{', idx)
        if brace_start == -1:
            pos = idx + len(header)
            continue
        
        # count braces to find the matching closing brace
        brace_count = 1
        i = brace_start + 1
        while brace_count > 0 and i < len(css_str):
            if css_str[i] == '{':
                brace_count += 1
            elif css_str[i] == '}':
                brace_count -= 1
            i += 1
            
        if brace_count == 0:
            # We found the closing brace!
            # Strip the header and the closing brace
            inner_styles = css_str[brace_start+1:i-1]
            css_str = css_str[:idx] + inner_styles + css_str[i:]
            pos = idx + len(inner_styles)
        else:
            pos = idx + len(header)
            
    return css_str

css_content = strip_layer(css_content, "theme")
css_content = strip_layer(css_content, "base")
css_content = strip_layer(css_content, "utilities")

with open(output_css, "w", encoding="utf-8") as f:
    f.write(css_content)

print("CSS rebuilt and layers stripped successfully.")

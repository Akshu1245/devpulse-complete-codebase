with open(r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Find functions
functions = re.findall(r"function\s+(\w+)\s*\(", content)
print("Functions in page.tsx:")
print(functions)

# Find default export
default_export = re.search(r"export\s+default\s+function\s+(\w+)", content)
if default_export:
    print("\nDefault export:", default_export.group(0))
else:
    print("\nNo default export function found.")

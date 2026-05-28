from bs4 import BeautifulSoup
import os

html_path = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\index.html"

if not os.path.exists(html_path):
    print("HTML file not found!")
    exit(1)

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("Page Title:", soup.title.string if soup.title else "None")

# Print top elements inside body
body = soup.body
if not body:
    print("No body tag found")
    exit(1)

print("\n--- Direct Children of <body> ---")
for child in body.children:
    if child.name:
        classes = child.get('class', [])
        id_val = child.get('id', 'No ID')
        print(f"<{child.name} id='{id_val}' class='{' '.join(classes)}'>")

print("\n--- Searching for header / nav / sections ---")
header = soup.find('header')
if header:
    print(f"Header classes: {' '.join(header.get('class', []))}")
else:
    print("No header element found")

nav = soup.find('nav')
if nav:
    print(f"Nav classes: {' '.join(nav.get('class', []))}")
else:
    print("No nav element found")

sections = soup.find_all('section')
print(f"Found {len(sections)} sections:")
for idx, sec in enumerate(sections):
    classes = sec.get('class', [])
    id_val = sec.get('id', 'No ID')
    print(f"Section {idx+1}: id='{id_val}', classes='{' '.join(classes)}'")

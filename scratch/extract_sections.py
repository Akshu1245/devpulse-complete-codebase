from bs4 import BeautifulSoup
import os

html_path = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\index.html"

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.body

# Let's extract the header/nav
nav = soup.find('nav')
if nav:
    with open("scratch_nav.html", "w", encoding="utf-8") as out:
        out.write(nav.prettify())
    print("Nav written to scratch_nav.html")

# Let's write the first 3 sections, faq, deeplink, cta, platform stats
sections = soup.find_all('section')
for idx, sec in enumerate(sections):
    id_val = sec.get('id', f'sec_{idx+1}')
    classes = " ".join(sec.get('class', []))
    filename = f"scratch_sec_{idx+1}_{id_val}.html"
    with open(filename, "w", encoding="utf-8") as out:
        out.write(f"<!-- Section {idx+1} id={id_val} class={classes} -->\n")
        out.write(sec.prettify())
    print(f"Section {idx+1} ({id_val}) written to {filename}")

# Also find any element before nav (announcement bar)
elements_before_nav = []
if nav:
    curr = nav.previous_sibling
    while curr:
        if curr.name:
            elements_before_nav.append(curr)
        curr = curr.previous_sibling

if elements_before_nav:
    print(f"Found {len(elements_before_nav)} elements before nav:")
    for el in elements_before_nav:
        print(el.name, el.get('class', []), el.get('id', ''))
else:
    print("No elements found before nav in DOM sibling order")

# Let's search inside body for text that might be an announcement
# (e.g. looking for "Launch Week", etc.)
for text in body.find_all(text=True):
    if "launch" in text.lower() or "week" in text.lower():
        parent = text.parent
        print(f"Found match: {text.strip()} (inside <{parent.name} class='{' '.join(parent.get('class', []))}' id='{parent.get('id', '')}'>)")

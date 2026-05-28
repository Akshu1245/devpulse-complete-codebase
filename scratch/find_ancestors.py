from bs4 import BeautifulSoup

with open("scratch_sec_2_features.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

for h3 in soup.find_all("h3"):
    parent = h3.parent
    # walk up until we hit a child of the grid
    while parent and parent.name != "section":
        classes = parent.get("class", [])
        if any(c.startswith("col-") or c.startswith("row-") or "grid" in c for c in classes):
            print(f"H3: '{h3.text.strip()}' -> Ancestor Tag: <{parent.name}> Classes: '{' '.join(classes)}'")
            break
        parent = parent.parent

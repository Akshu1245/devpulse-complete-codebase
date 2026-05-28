from bs4 import BeautifulSoup

html_path = "scratch_sec_2_features.html"
with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

# Find all cards/divs inside the grid
grid = soup.find(class_="flex flex-col items-stretch md:grid md:grid-cols-6 md:grid-rows-[repeat(16,95px)] xl:grid-cols-12 xl:grid-rows-[repeat(8,95px)]")
if grid:
    # direct children
    print("Found grid container children:")
    for idx, child in enumerate(grid.find_all(recursive=False)):
        classes = " ".join(child.get("class", []))
        h3 = child.find("h3")
        title = h3.text.strip() if h3 else "No Title"
        print(f"Child {idx+1}: title='{title}', classes='{classes}'")
else:
    print("Grid container not found")

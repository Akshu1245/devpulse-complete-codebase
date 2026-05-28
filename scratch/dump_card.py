from bs4 import BeautifulSoup

with open("scratch_sec_2_features.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

for h3 in soup.find_all("h3"):
    if "Cloud Storage" in h3.text:
        # walk up to card container
        parent = h3.parent
        while parent and not any(c.startswith("col-") for c in parent.get("class", [])):
            parent = parent.parent
        if parent:
            print(parent.prettify())
            break

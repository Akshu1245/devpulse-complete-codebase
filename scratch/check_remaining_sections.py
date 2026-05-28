import os
from bs4 import BeautifulSoup

sections = [
    ("scratch_sec_5_sec_5.html", "Changelog"),
    ("scratch_sec_6_sec_6.html", "Community"),
    ("scratch_sec_7_faq.html", "FAQ"),
    ("scratch_sec_8_deeplink.html", "Deeplink/AskAI"),
    ("scratch_sec_9_cta.html", "CTA"),
    ("scratch_sec_10_sec_10.html", "Stats"),
    ("scratch_sec_11_sec_11.html", "Footer")
]

for filename, desc in sections:
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        root = soup.find() # get first tag
        if root:
            # print description, tag name, id, classes
            classes = " ".join(root.get("class", []))
            id_val = root.get("id", "No ID")
            print(f"{desc}: <{root.name} id='{id_val}' class='{classes}'>")
            # find first few child tags
            children = [c.name for c in root.children if c.name]
            print(f"  Children: {children[:5]}")
    else:
        print(f"{desc}: File {filename} not found")

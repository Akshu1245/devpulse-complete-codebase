from bs4 import BeautifulSoup

html_path = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\index.html"

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

footer = soup.find('footer')
if footer:
    with open("scratch_footer.html", "w", encoding="utf-8") as out:
        out.write(footer.prettify())
    print("Footer found and written to scratch_footer.html")
else:
    print("No footer tag found. Searching for elements with class containing 'footer'")
    for el in soup.find_all(class_=True):
        if any('footer' in c.lower() for c in el.get('class', [])):
            print(f"Found element with class: {el.name} class={el.get('class', [])}")
            break

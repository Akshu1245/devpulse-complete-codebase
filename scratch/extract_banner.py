from bs4 import BeautifulSoup

html_path = r"C:\Users\aksha\devpulse-complete-codebase\insforge-mirror\insforge.dev\index.html"

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

banner = soup.find(id='event-banner') or soup.find(class_='event-banner') or soup.find(class_='bg-primary-green')
if banner:
    print(banner.prettify())
else:
    # search body for direct child that contains launch week
    body = soup.body
    for child in body.children:
        if child.name and ('banner' in ''.join(child.get('class', [])).lower() or 'event' in ''.join(child.get('class', [])).lower() or 'banner' in str(child).lower()):
            print(child.prettify())
            break

import re
from html.parser import HTMLParser
import json

class HTMLFormatter(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.indent = 0

    def handle_starttag(self, tag, attrs):
        # Exclude scripts and standard nextjs hydration tags from output to keep it clean
        if tag in ['script', 'style', 'link', 'meta']:
            return
        attr_str = " ".join([f'{k}="{v}"' for k, v in attrs])
        attr_str = f" {attr_str}" if attr_str else ""
        self.result.append("  " * self.indent + f"<{tag}{attr_str}>")
        if tag not in ['img', 'br', 'hr', 'input']:
            self.indent += 1

    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'link', 'meta']:
            return
        if tag not in ['img', 'br', 'hr', 'input']:
            self.indent = max(0, self.indent - 1)
        self.result.append("  " * self.indent + f"</{tag}>")

    def handle_data(self, data):
        text = data.strip()
        if text:
            self.result.append("  " * self.indent + text)

with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\insforge.dev\index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Only parse inside <body>
body_match = re.search(r"<body[^>]*>(.*)</body>", html_content, re.DOTALL)
if body_match:
    body_html = body_match.group(1)
else:
    body_html = html_content

parser = HTMLFormatter()
parser.feed(body_html)

with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\parsed_body.html", "w", encoding="utf-8") as f:
    f.write("\n".join(parser.result))

print("Successfully parsed and formatted body HTML.")

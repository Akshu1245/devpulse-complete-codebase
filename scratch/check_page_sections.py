with open(r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in page.tsx: {len(lines)}")

# Search for some terms
terms = [
    "event-banner",
    "Products",
    "Compare",
    "Resources",
    "npx rakshex scan",
    "Everything You Need to Ship Secure AI",
    "If You Use AI Agents, Secure Them with RakshEx",
    "Changelog",
    "Join our Community",
    "Frequently Asked Questions",
    "What's RakshEx? Ask AI.",
    "Platform Statistics",
    "Start Securing Your AI Agents",
    "WaitlistForm",
    "useMutation"
]

for term in terms:
    found = []
    for i, line in enumerate(lines):
        if term in line:
            found.append(i + 1)
    if found:
        print(f"Found '{term}' on lines: {found[:5]} (total: {len(found)} times)")
    else:
        print(f"Did NOT find '{term}'")

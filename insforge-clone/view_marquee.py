with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\clean_body.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "perfectly" in line:
        start = max(0, i - 10)
        end = min(len(lines), i + 100)
        for idx in range(start, end):
            print(f"{idx+1}: {lines[idx]}", end="")
        break

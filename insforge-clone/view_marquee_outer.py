with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\clean_body.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in range(520, 565):
    print(f"{idx+1}: {lines[idx]}", end="")

with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\parsed_body.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

clean_lines = []
for line in lines:
    stripped = line.strip()
    # Skip Javascript statements/script tag contents
    if stripped.startswith('self.__next_f') or stripped.startswith('$R') or stripped.startswith('requestAnimationFrame') or stripped.startswith('(') or stripped.startswith('//') or stripped.startswith(':HL') or stripped.startswith('}'):
        continue
    clean_lines.append(line)

with open(r"C:\Users\aksha\devpulse-complete-codebase\insforge-clone\clean_body.html", "w", encoding="utf-8") as f:
    f.writelines(clean_lines)

print("Created clean_body.html")

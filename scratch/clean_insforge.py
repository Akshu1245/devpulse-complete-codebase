import os

dirs = [r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app", r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\lib"]

for d in dirs:
    if not os.path.exists(d):
        continue
    for root, _, files in os.walk(d):
        for f in files:
            # We don't rename the file globals-insforge.css because that name is requested in Step 3
            # but we can replace its contents.
            if f.endswith(('.tsx', '.ts', '.css')):
                filepath = os.path.join(root, f)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as file_in:
                    content = file_in.read()
                
                # Check for case-insensitive matches (ignoring imports of globals-insforge.css itself)
                # Let's replace 'insforge' with 'rakshex' inside the file, but keep the import name
                # "globals-insforge.css" intact since Next.js expects that import.
                # Actually, let's check what matches exist.
                # A simple replacement:
                if 'insforge' in content.lower():
                    # We can use a regex to replace but preserve 'globals-insforge'
                    new_content = content
                    # Replace all 'insforge' with 'rakshex' except when it's 'globals-insforge'
                    # Let's split by 'globals-insforge' first
                    parts = new_content.split('globals-insforge')
                    new_parts = []
                    for part in parts:
                        # replace in this part
                        # case-insensitive replace of insforge -> rakshex
                        # We'll replace 'InsForge' -> 'RakshEx', 'insforge' -> 'rakshex', '@insforge' -> '@rakshex', etc.
                        # Simple replacements:
                        p = part.replace('InsForge', 'RakshEx')
                        p = p.replace('insforge', 'rakshex')
                        p = p.replace('INSFORGE', 'RAKSHEX')
                        new_parts.append(p)
                    
                    new_content = 'globals-insforge'.join(new_parts)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as file_out:
                            file_out.write(new_content)
                        print(f"Cleaned insforge from: {filepath}")

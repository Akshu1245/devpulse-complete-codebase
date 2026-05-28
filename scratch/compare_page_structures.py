import os
import re

# Read current page.tsx
with open(r"C:\Users\aksha\devpulse-complete-codebase\devpulse-frontend\app\page.tsx", "r", encoding="utf-8") as f:
    page_content = f.read()

# Let's check some CSS class names from scraped sections to see if they exist in page.tsx
# Check navbar classes:
scraped_nav_class = 'sticky h-12 top-0 left-0 bg-[#0F0F0F] w-screen z-50'
if scraped_nav_class in page_content:
    print("Navbar matches scraped class!")
else:
    print("Navbar does NOT match scraped class exactly.")

# Check portal section class
scraped_portal_class = 'w-full max-w-[1280px] mx-auto pt-40 pb-20'
if scraped_portal_class in page_content:
    print("Portal matches scraped class!")
else:
    print("Portal does NOT match scraped class exactly.")

# Check benchmark section class
scraped_benchmark_class = 'relative w-full max-w-[680px] xl:max-w-[1280px] mx-auto flex flex-col items-center justify-center py-30 px-6'
if scraped_benchmark_class in page_content:
    print("Benchmark matches scraped class!")
else:
    print("Benchmark does NOT match scraped class.")

# Let's count some class names
insforge_specific_classes = [
    'PlatformStatsShowcase_section__FNJKE',
    'bg-primary-green',
    'animate-logo-scroll',
    'from-[#232323]',
    'border-neutral-700',
    'bg-linear-106'
]

for cls in insforge_specific_classes:
    count = page_content.count(cls)
    print(f"Class '{cls}' count in page.tsx: {count}")

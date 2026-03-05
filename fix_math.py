import re
import os

files = [
    'ds-guide-frontend/src/app/data-science/eda/page.tsx',
    'ds-guide-frontend/src/app/data-science/feature-engineering/page.tsx',
    'ds-guide-frontend/src/app/data-science/statistical-testing/page.tsx',
    'ds-guide-frontend/src/app/data-science/pre-modelling/page.tsx'
]

def repl(m):
    inner = m.group(1)
    inner = inner.replace('{', '&#123;').replace('}', '&#125;')
    return f"$${inner}$$"

for path in files:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = re.sub(r'\$\$(.*?)\$\$', repl, content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(new_content)
    print(f"Fixed braces in {path}")

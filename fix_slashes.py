import os

files = [
    'ds-guide-frontend/src/app/data-science/eda/page.tsx',
    'ds-guide-frontend/src/app/data-science/feature-engineering/page.tsx',
    'ds-guide-frontend/src/app/data-science/statistical-testing/page.tsx',
    'ds-guide-frontend/src/app/data-science/pre-modelling/page.tsx'
]

# Since we already converted $$...$$ mostly, let's just find and replace all `\` with `\\` inside math blocks safely. 
import re

def escape_slashes(match):
    # match.group(1) is the content inside $$...$$
    content = match.group(1)
    content = content.replace('\\\\', '\\') # revert any existing double slashes to single
    content = content.replace('\\', '\\\\') # make them all double
    return f"$${content}$$"

def inline_escape_slashes(match):
    # Only match if it's not starting with $ and not inside code blocks
    content = match.group(1)
    if '`' in content: return match.group(0)
    content = content.replace('\\\\', '\\').replace('\\', '\\\\')
    return f"${content}$"
    
for path in files:
    if not os.path.exists(path): continue
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
        
    # Replace slashes in block math
    text = re.sub(r'\$\$(.*?)\$\$', escape_slashes, text, flags=re.DOTALL)
    
    # Replace slashes in inline math (careful not to break JS template literals)
    # Inline math is like $something$
    text = re.sub(r'(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)', inline_escape_slashes, text, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Double-escaped backslashes in {path}")

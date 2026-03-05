import os
import re

files = [
    'ds-guide-frontend/src/app/data-science/eda/page.tsx',
    'ds-guide-frontend/src/app/data-science/feature-engineering/page.tsx',
    'ds-guide-frontend/src/app/data-science/statistical-testing/page.tsx',
    'ds-guide-frontend/src/app/data-science/pre-modelling/page.tsx'
]

def inline_braces(match):
    # Match inline math like $...$
    # We will replace { and } with HTML entities, but FIRST we must ensure it doesn't have `{` `{` already 
    # Actually if it already has `&#123;`, `.replace` won't hurt if we are careful, but wait, if it has `&#123;` we don't want to replace `{` in `&#123;`!
    
    # We can just unEntity everything first and then reEntity
    content = match.group(1)
    if '`' in content: return match.group(0) # skip if it contains a backtick, probably template literal
    
    content = content.replace('&#123;', '{').replace('&#125;', '}')
    content = content.replace('{', '&#123;').replace('}', '&#125;')
    return f"${content}$"

for path in files:
    if not os.path.exists(path): continue
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Apply inline braces fix
    text = re.sub(r'(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)', inline_braces, text, flags=re.DOTALL)
    
    # Also fix any rogue `<` `>`
    # We already fixed <25 to &lt;25 manually, but what about others?
    # Make sure we don't break tags `<div>`
    
    text = text.replace(' > 0', ' &gt; 0')
    text = text.replace(' < 0', ' &lt; 0')
    text = text.replace('<<', '&lt;&lt;')
    text = text.replace('>>', '&gt;&gt;')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Fixed braces and arrows in {path}")

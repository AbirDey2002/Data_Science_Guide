import re

def main():
    with open('Reference/pre_modelling.html', 'r', encoding='utf-8') as f:
        html = f.read()

    main_match = re.search(r'<main class="main">(.+?)</main>', html, re.DOTALL)
    if not main_match:
        print("Could not find main tag in pre_modelling.html")
        return
        
    content = main_match.group(1)
    
    # Cleanups for JSX
    content = content.replace('class=', 'className=')
    content = content.replace('for=', 'htmlFor=')
    content = content.replace('<hr className="section-divider">', '<hr className="section-divider" />')
    content = content.replace('<br>', '<br />')
    
    # Inline styles
    content = content.replace('style="color:var(--gold); font-weight:700;"', "style={{ color: 'var(--gold)', fontWeight: '700' }}")
    content = content.replace('style="color:var(--gold);"', "style={{ color: 'var(--gold)' }}")
    content = content.replace('style="margin-bottom:24px;"', "style={{ marginBottom: '24px' }}")
    
    # Escape { and } in code blocks so React doesn't try to parse them as JS
    def escape_braces(match):
        text = match.group(0)
        # We only want to escape inside code blocks
        text = text.replace('{', '&#123;').replace('}', '&#125;')
        return text
        
    content = re.sub(r'<pre><code.*?</code></pre>', escape_braces, content, flags=re.DOTALL)

    # Insert PreModellingTree component after Introduction
    intro_end = content.find('</section>', content.find('id="intro"'))
    if intro_end != -1:
        intro_end += len('</section>') # past the tag
        tree_component = '\n\n<div style={{ margin: "40px -48px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#0d0d1f" }}>\n  <PreModellingTree />\n</div>\n\n'
        content = content[:intro_end] + tree_component + content[intro_end:]
        
    jsx = f"""'use client';
import {{ useEffect }} from 'react';
import PreModellingTree from '@/components/PreModellingTree';

export default function PreModellingPage() {{
  useEffect(() => {{
    if (typeof window !== 'undefined') {{
      // @ts-ignore
      if (window.hljs) window.hljs.highlightAll();
      // @ts-ignore
      if (window.renderMathInElement) {{
        // @ts-ignore
        window.renderMathInElement(document.body, {{
          delimiters: [
            {{ left: '$$', right: '$$', display: true }},
            {{ left: '$', right: '$', display: false }}
          ],
          throwOnError: false
        }});
      }}
    }}
  }}, []);

  return (
    <>
{content}
    </>
  );
}}
"""
    with open('ds-guide-frontend/src/app/data-science/pre-modelling/page.tsx', 'w', encoding='utf-8') as out:
        out.write(jsx)
        print("Successfully wrote page.tsx")

if __name__ == '__main__':
    main()

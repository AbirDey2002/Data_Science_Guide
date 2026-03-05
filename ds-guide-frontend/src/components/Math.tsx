'use client';

/**
 * Renders KaTeX math using dangerouslySetInnerHTML to bypass
 * JavaScript string escape sequences (\f, \b, \t etc.) that corrupt LaTeX commands.
 * 
 * Usage:
 *   <Math display>{'\\frac{1}{n}'}</Math>           — display mode (block)
 *   <Math>{'\\frac{1}{n}'}</Math>                    — inline mode
 *   <Math display raw="\\frac{1}{n}" />              — alternative via prop
 */
export default function Math({
    children,
    display = false,
    raw
}: {
    children?: string;
    display?: boolean;
    raw?: string;
}) {
    const latex = raw || (typeof children === 'string' ? children : '');
    const delim = display ? '$$' : '$';

    return (
        <span
            dangerouslySetInnerHTML={{ __html: `${delim}${latex}${delim}` }}
        />
    );
}

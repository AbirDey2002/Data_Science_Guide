'use client';
import { useEffect } from 'react';

function renderMath() {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  if (window.renderMathInElement) {
    // @ts-ignore
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  } else { setTimeout(renderMath, 100); }
}

export default function PixelPerfectPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.hljs) window.hljs.highlightAll();
      renderMath();
    }
  }, []);

  return (
    <>


      <div className="hero">
        <div className="hero-eyebrow">ZS ADS Interview Prep — Project 4</div>
        <h1>Pixel Perfect — UI Visual Regression Testing</h1>
        <p className="hero-sub">Figma Design vs Live Application · Multimodal LLM · SSIM-Gated Sliding Window · AWS · Playwright</p>
        <div className="badge-row">
          <span className="badge badge-blue">SSIM Routing Gate</span>
          <span className="badge badge-teal">SSIM Masking</span>
          <span className="badge badge-purple">Claude Sonnet (Multimodal)</span>
          <span className="badge badge-green">Sliding Window Comparison</span>
          <span className="badge badge-amber">Playwright DOM Capture</span>
          <span className="badge badge-red">Figma Connector</span>
        </div>
      </div>


      <section id="pipeline">
        <div className="topic-card">
          <h3>End-to-End Pipeline</h3>
          <div className="flow">
            <div className="flow-step">Figma Design</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step warn">Figma Connector → HTML</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step warn">Playwright Screenshot + DOM</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step ml">Frame Scaling</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step ml">Global SSIM Score</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step ml">Route: Full vs Window</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step ml">SSIM Mask (window path)</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step llm">MM LLM Comparison</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step llm">LLM Aggregation</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step good">Issue Report → Jira</div>
          </div>

          <div className="callout callout-info">
            <div className="callout-title">Core Design Philosophy</div>
            The ML layer (SSIM) does not detect issues — it decides <em>how</em> to present the images to the LLM so the LLM can detect issues most effectively. SSIM is the routing and masking intelligence; the MM LLM is the semantic understanding layer. Neither can do the job of the other.
          </div>
        </div>
      </section>


      <section id="situation">
        <div className="topic-card">
          <div className="star-header">
            <div className="star-letter star-s">S</div>
            <div>
              <div className="star-title">Situation</div>
              <div className="star-subtitle">Context, environment, and the problem that existed</div>
            </div>
          </div>
          <p>I built Pixel Perfect — a UI visual regression testing system that, given a Figma design and a live application URL, automatically compared them and surfaced UI discrepancies classified into three categories. The goal was to replace manual pixel-by-pixel UI review with an automated pipeline that could catch both large structural mismatches and subtle pixel-level differences.</p>

          <div className="issue-grid">
            <div className="issue-card essential">
              <h4>UI Essentials</h4>
              <ul>
                <li>Element positioning</li>
                <li>Element presence / absence</li>
                <li>Text content</li>
                <li>Spelling errors</li>
              </ul>
            </div>
            <div className="issue-card theme">
              <h4>Theme</h4>
              <ul>
                <li>Color delta</li>
                <li>Element overlay / pixel diff</li>
                <li>Font differentiation</li>
                <li>Text size mismatch</li>
              </ul>
            </div>
            <div className="issue-card layout">
              <h4>Layout Structure</h4>
              <ul>
                <li>HTML tree similarity</li>
                <li>DOM structure diff</li>
                <li>Component hierarchy</li>
              </ul>
            </div>
          </div>

          <h3>The Core Technical Problem</h3>
          <p>Multimodal LLMs are excellent at detecting large, obvious UI differences — a missing section, a wrong layout, a completely wrong colour scheme. However, they consistently failed to capture subtle differences: a 2px misalignment, a slightly off hex colour, a font weight change. These are exactly the issues that matter most in pixel-perfect UI testing.</p>

          <p>The challenge was building a system that handled both the large-mismatch case and the small-mismatch case with appropriate techniques — without wasting token cost by always running the expensive small-mismatch pipeline on images where the difference was already obvious.</p>
        </div>
      </section>


      <section id="task">
        <div className="topic-card">
          <div className="star-header">
            <div className="star-letter star-t">T</div>
            <div>
              <div className="star-title">Task</div>
              <div className="star-subtitle">What I was responsible for building</div>
            </div>
          </div>
          <p>My task was to design and build the full comparison pipeline on AWS with Playwright for capture, a Figma connector for design extraction, and Claude Sonnet as the multimodal LLM. The key engineering challenge was solving the LLM's small-difference blindness without blowing up token costs for every comparison.</p>

          <h3>The Two-Case Problem</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Case</th><th>Characteristic</th><th>LLM Behaviour</th><th>Solution</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>Large mismatch</strong></td>
                  <td>SSIM score below 0.95 — significant pixel-level differences globally</td>
                  <td>LLM detects correctly on full image</td>
                  <td>Send full image pair directly to MM LLM</td>
                </tr>
                <tr>
                  <td><strong>Small mismatch</strong></td>
                  <td>SSIM score above 0.95 — images mostly similar, differences subtle</td>
                  <td>LLM misses differences on full image — drowned out by visual similarity</td>
                  <td>Sliding window + SSIM masking to surface only dissimilar pixels</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="callout callout-insight">
            <div className="callout-title">Why SSIM as the Router and Not the Detector</div>
            SSIM tells you the <em>degree</em> of pixel-level difference — it does not tell you <em>what</em> is different or <em>why</em> it matters. A colour theme change and a missing button can produce identical SSIM scores. SSIM's job is purely to decide which LLM presentation strategy to use — the semantic understanding of what the difference means is the LLM's job.
          </div>
        </div>
      </section>


      <section id="action">
        <div className="topic-card">
          <div className="star-header">
            <div className="star-letter star-a">A</div>
            <div>
              <div className="star-title">Action</div>
              <div className="star-subtitle">Technical steps — in detail</div>
            </div>
          </div>


          <section id="capture">
            <h2>Step 1 — Screenshot Capture and DOM Extraction</h2>
            <p>I used Playwright via a FastAPI service on AWS to automate screenshot capture from the live application URL. Playwright gave me two artifacts per page: a full-page screenshot and the serialised DOM tree — both needed for different issue categories. The DOM was used for layout structure comparison; the screenshot was used for visual comparison.</p>

            <div className="code-annotated">
              <pre><code className="language-python">{`from playwright.async_api import async_playwright
from fastapi import FastAPI

app = FastAPI()

async def capture_page(url: str) -> dict:
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page    = await browser.new_page()

        await page.set_viewport_size({"width": 1440, "height": 900})
        await page.goto(url, wait_until="networkidle")

        screenshot = await page.screenshot(full_page=True)
        dom_html   = await page.content()

        await browser.close()
        return {
            "screenshot": screenshot,   # PNG bytes
            "dom":        dom_html,      # full HTML string
            "viewport":   (1440, 900)
        }`}</code></pre>
              <div className="annotations">
                <div className="annotation-line"><span>L8</span> Chromium — headless, consistent rendering across environments</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L11</span> Fixed viewport — 1440x900 standard desktop; must match Figma artboard dimensions after scaling</div>
                <div className="annotation-line"><span>L12</span> wait_until="networkidle" — ensures all async assets loaded before screenshot</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L14</span> Full-page screenshot — captures below-fold content</div>
                <div className="annotation-line"><span>L15</span> Full DOM HTML — used for layout structure / HTML tree comparison category</div>
              </div>
            </div>
          </section>


          <section id="figma">
            <h2>Step 2 — Figma Design Extraction</h2>
            <p>I used a third-party Figma connector to extract the Figma design as rendered HTML — giving us both a screenshot-equivalent render of the design and its underlying DOM structure. This meant we could compare not just visually but structurally at the HTML tree level for the layout structure issue category.</p>

            <div className="callout callout-info">
              <div className="callout-title">Why HTML from Figma, Not Just a Figma Screenshot</div>
              Exporting a Figma frame as a PNG gives us only the visual layer. By extracting the Figma HTML, we get the component hierarchy and element structure — enabling the DOM tree similarity comparison for the layout structure category. A purely visual comparison would miss structural issues like wrong nesting or missing semantic elements even if the visual output looked identical.
            </div>
          </section>


          <section id="scaling">
            <h2>Step 3 — Frame Dimension Scaling <span className="ml-tag cv-tag">CV</span></h2>
            <p>Before any comparison, I normalised both images to the same frame dimensions. Figma designs are authored at specific artboard sizes that often differ from the live application's rendered viewport. Without scaling, pixel-level comparison is meaningless — a 1-pixel difference could simply be a scaling artefact, not a real UI issue.</p>

            <div className="callout callout-warn">
              <div className="callout-title">Why Scaling Must Happen Before SSIM</div>
              SSIM computes structural similarity at the pixel level. If the two images have different dimensions, SSIM either fails or produces a meaningless score dominated by the dimension mismatch rather than actual content differences. Scaling to identical dimensions is a hard prerequisite, not an optimisation.
            </div>

            <div className="code-annotated">
              <pre><code className="language-python">{`from PIL import Image
import numpy as np

def scale_to_same_frame(
    figma_img:  Image.Image,
    app_img:    Image.Image
) -> tuple[np.ndarray, np.ndarray]:

    # Use Figma artboard as the reference frame
    target_w, target_h = figma_img.size

    # Resize app screenshot to match Figma dimensions
    app_resized = app_img.resize(
        (target_w, target_h),
        resample=Image.LANCZOS   # high-quality downsampling
    )

    figma_arr = np.array(figma_img.convert("RGB"))
    app_arr   = np.array(app_resized.convert("RGB"))

    return figma_arr, app_arr  # identical dimensions, ready for SSIM`}</code></pre>
              <div className="annotations">
                <div className="annotation-line"><span>L8</span> Figma artboard is the ground truth — app screenshot conforms to it, not vice versa</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L11-14</span> LANCZOS resampling — best quality for downscaling, minimises aliasing artefacts that could inflate SSIM diff</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L16-17</span> Convert both to RGB numpy arrays — SSIM and masking operate on numpy, not PIL</div>
                <div className="annotation-line"><span>L19</span> Both arrays now identical dimensions — SSIM can compute meaningful scores</div>
              </div>
            </div>
          </section>


          <section id="ssim-routing">
            <h2>Step 4 — Global SSIM Routing Gate <span className="ml-tag cv-tag">CV</span></h2>
            <p>After scaling, I computed a single global SSIM score on the full image pair. This score was the sole routing signal — it decided whether to take the full-image path or the sliding window + masking path.</p>

            <div className="callout callout-info">
              <div className="callout-title">SSIM Formula</div>
              {<span dangerouslySetInnerHTML={{ __html: '$$\\text{SSIM}(x,y) = \\frac{(2\\mu_x\\mu_y + c_1)(2\\sigma_{xy} + c_2)}{(\\mu_x^2 + \\mu_y^2 + c_1)(\\sigma_x^2 + \\sigma_y^2 + c_2)}$$' }} />}
              <p style={{ 'fontSize': '0.82rem', 'color': '#8b949e', 'marginTop': '0.5rem' }}>
                {<span dangerouslySetInnerHTML={{ __html: '$\\mu_x, \\mu_y$' }} />} = local means, {<span dangerouslySetInnerHTML={{ __html: '$\\sigma_x^2, \\sigma_y^2$' }} />} = local variances, {<span dangerouslySetInnerHTML={{ __html: '$\\sigma_{xy}$' }} />} = cross-covariance, {<span dangerouslySetInnerHTML={{ __html: '$c_1, c_2$' }} />} = stability constants. Score ranges 0–1: 1.0 = identical, values above 0.95 indicate high structural similarity with only subtle local differences remaining.
              </p>
            </div>

            <div className="decision-tree">
              <div className="dt-row">
                <div className="dt-node ml">Compute global SSIM</div>
                <div className="dt-arrow">→ score &lt; 0.95 →</div>
                <div className="dt-node llm">Full image pair → MM LLM</div>
                <div className="dt-arrow">→</div>
                <div className="dt-node good">Large mismatch detected</div>
              </div>
              <div className="dt-row">
                <div className="dt-node ml">Compute global SSIM</div>
                <div className="dt-arrow">→ score ≥ 0.95 →</div>
                <div className="dt-node ml">Sliding window + SSIM masking</div>
                <div className="dt-arrow">→</div>
                <div className="dt-node llm">Masked window pairs → MM LLM</div>
              </div>
            </div>

            <div className="code-annotated">
              <pre><code className="language-python">{`from skimage.metrics import structural_similarity as ssim
import cv2

SSIM_THRESHOLD = 0.95  # tuned threshold

def compute_global_ssim(
    figma_arr: np.ndarray,
    app_arr:   np.ndarray
) -> float:
    figma_gray = cv2.cvtColor(figma_arr, cv2.COLOR_RGB2GRAY)
    app_gray   = cv2.cvtColor(app_arr,   cv2.COLOR_RGB2GRAY)

    score, _ = ssim(
        figma_gray, app_gray,
        full=True,      # also returns SSIM map — used in masking
        data_range=255
    )
    return score

def route_comparison(figma_arr, app_arr) -> str:
    score = compute_global_ssim(figma_arr, app_arr)
    return "full_image" if score < SSIM_THRESHOLD else "sliding_window"`}</code></pre>
              <div className="annotations">
                <div className="annotation-line"><span>L4</span> 0.95 fixed threshold — images above this are structurally very similar; LLM needs help finding subtle diffs</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L10-11</span> Convert to grayscale for SSIM — SSIM measures structural luminance patterns, not colour</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L13-16</span> full=True returns the pixel-wise SSIM map — reused in the masking step to identify which pixels are dissimilar</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L20</span> Single routing decision — no LLM involved, pure pixel-level computation</div>
              </div>
            </div>
          </section>


          <section id="full-image">
            <h2>Step 5a — Full-Image LLM Path (Large Mismatch)</h2>
            <p>When SSIM score falls below 0.95, the differences are large enough that the MM LLM can detect them reliably on the full image pair. Both images are sent together with a structured prompt instructing Claude Sonnet to classify findings into the three issue categories and assign severity.</p>

            <div className="code-entry">
              <div className="code-label"><span className="lang-dot"></span>python — full image MM LLM comparison</div>
              <pre><code className="language-python">{`import anthropic, base64

client = anthropic.Anthropic()

def compare_full_image(figma_arr: np.ndarray, app_arr: np.ndarray) -> dict:
    figma_b64 = encode_image(figma_arr)
    app_b64   = encode_image(app_arr)

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": figma_b64}},
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": app_b64}},
                {"type": "text", "text": """
Compare the Figma design (image 1) against the live application (image 2).
Classify all differences into:
1. UI Essentials: positioning, element presence/absence, text, spelling
2. Theme: color delta, pixel differences, font, text size
3. Layout Structure: structural/hierarchy differences

For each issue: description, category, severity (critical/minor), location.
Return structured JSON."""}
            ]
        }]
    )
    return parse_issues(response.content[0].text)`}</code></pre>
            </div>
          </section>


          <section id="sliding-window">
            <h2>Step 5b — Sliding Window Path (Small Mismatch) <span className="ml-tag cv-tag">CV</span></h2>
            <p>When SSIM score is above 0.95, differences are subtle and the LLM misses them on the full image — the small differences are drowned out by the overwhelming visual similarity. I divided both images into a 2x2 grid of four equal windows and sent each window pair to the MM LLM separately, with SSIM masking applied to each window before sending.</p>

            <div className="callout callout-success">
              <div className="callout-title">Why Windowing Helps the LLM</div>
              By zooming into a quarter of the image, subtle differences occupy proportionally more of the LLM's visual context. A 2px misalignment that covers 0.1% of the full image covers 0.4% of a 2x2 window — four times more visually prominent. Combined with SSIM masking that removes similar pixels, the LLM is effectively shown a zoomed-in, noise-filtered view of only the differences.
            </div>

            <div className="code-annotated">
              <pre><code className="language-python">{`def split_into_windows(img: np.ndarray, grid=(2,2)) -> list[np.ndarray]:
    h, w = img.shape[:2]
    rows, cols = grid
    wh, ww = h // rows, w // cols
    windows = []
    for r in range(rows):
        for c in range(cols):
            window = img[r*wh:(r+1)*wh, c*ww:(c+1)*ww]
            windows.append(window)
    return windows  # 4 windows: top-left, top-right, bottom-left, bottom-right

async def compare_sliding_window(figma_arr, app_arr) -> list[dict]:
    figma_windows = split_into_windows(figma_arr)
    app_windows   = split_into_windows(app_arr)

    all_issues = []
    for i, (fw, aw) in enumerate(zip(figma_windows, app_windows)):
        fw_masked, aw_masked = apply_ssim_mask(fw, aw)
        issues = await compare_full_image(fw_masked, aw_masked)
        issues = tag_window_position(issues, window_idx=i)
        all_issues.extend(issues)

    return aggregate_issues(all_issues)`}</code></pre>
              <div className="annotations">
                <div className="annotation-line"><span>L1-9</span> Split both images into 2x2 grid — 4 equal windows preserving spatial layout</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L16</span> Apply SSIM mask to each window pair before sending to LLM — removes similar regions, highlights differences</div>
                <div className="annotation-line"><span>L17</span> Reuse same full-image comparison function — masked windows are treated as "images" by the LLM</div>
                <div className="annotation-line"><span>L18</span> Tag each issue with its window position — used for spatial dedup in aggregation</div>
                <div className="annotation-line"><span>L21</span> Aggregate across all 4 windows — LLM dedup pass removes cross-window duplicate findings</div>
              </div>
            </div>
          </section>


          <section id="ssim-masking">
            <h2>Step 6 — SSIM Masking <span className="ml-tag cv-tag">CV</span></h2>
            <p>Within the sliding window path, before each window pair was sent to the LLM, I applied SSIM masking — using the pixel-wise SSIM map (computed with <code>full=True</code>) to grey out regions where the two windows were already similar, leaving only the dissimilar pixels visible. This spoon-fed the LLM exactly where the differences were, eliminating the signal-to-noise problem that caused it to miss subtle differences on the full image.</p>

            <div className="callout callout-info">
              <div className="callout-title">SSIM Double Duty</div>
              The SSIM computation does two things in one pass: (1) the scalar score routes the pipeline, (2) the pixel-wise SSIM map (<code>full=True</code>) drives the mask. No redundant computation — both outputs come from a single <code>ssim(full=True)</code> call.
            </div>

            <div className="code-annotated">
              <pre><code className="language-python">{`from skimage.metrics import structural_similarity as ssim
import numpy as np, cv2

MASK_THRESHOLD = 0.95  # per-pixel SSIM below this = dissimilar = keep visible

def apply_ssim_mask(
    figma_w: np.ndarray,
    app_w:   np.ndarray
) -> tuple[np.ndarray, np.ndarray]:

    fg = cv2.cvtColor(figma_w, cv2.COLOR_RGB2GRAY)
    ag = cv2.cvtColor(app_w,   cv2.COLOR_RGB2GRAY)

    _, ssim_map = ssim(fg, ag, full=True, data_range=255)

    # Build binary mask: 1 = dissimilar (show), 0 = similar (grey out)
    diff_mask = (ssim_map < MASK_THRESHOLD).astype(np.uint8)

    # Dilate mask to include context around difference regions
    kernel    = np.ones((10, 10), np.uint8)
    diff_mask = cv2.dilate(diff_mask, kernel, iterations=2)

    # Apply: grey out similar regions on both images
    grey = np.full_like(figma_w, 200)  # neutral grey
    figma_masked = np.where(diff_mask[:,:,None], figma_w, grey)
    app_masked   = np.where(diff_mask[:,:,None], app_w,   grey)

    return figma_masked, app_masked`}</code></pre>
              <div className="annotations">
                <div className="annotation-line"><span>L4</span> Per-pixel threshold — same value as global routing threshold for consistency</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L11-12</span> Grayscale conversion — SSIM operates on luminance, same as routing step</div>
                <div className="annotation-line"><span>L14</span> full=True — returns pixel-wise SSIM map alongside scalar score</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L16-17</span> Binary mask — 1 where SSIM is low (dissimilar pixels), 0 where SSIM is high (similar, grey out)</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L19-20</span> Dilate mask — adds context around each difference region so LLM sees the surrounding element, not just isolated pixels</div>
                <div className="annotation-line">&nbsp;</div>
                <div className="annotation-line"><span>L22-24</span> Apply mask — similar regions replaced with neutral grey on both images. LLM now sees only dissimilar regions in context</div>
              </div>
            </div>
          </section>


          <section id="classification">
            <h2>Step 7 — Issue Classification by Category <span className="ml-tag llm-tag">LLM</span></h2>
            <p>The MM LLM classified each detected difference into one of the three issue categories and assigned severity. The DOM HTML extracted by Playwright was used alongside the visual comparison for the layout structure category — the LLM compared the HTML trees directly to detect structural mismatches that might not be visually obvious.</p>

            <div className="table-wrap">
              <table>
                <thead><tr><th>Category</th><th>Input to LLM</th><th>What LLM Looks For</th></tr></thead>
                <tbody>
                  <tr><td><strong>UI Essentials</strong></td><td>Masked screenshot pair</td><td>Missing elements, wrong positions, text errors, spelling</td></tr>
                  <tr><td><strong>Theme</strong></td><td>Masked screenshot pair + colour values</td><td>Colour delta, font weight/size differences, pixel overlay mismatches</td></tr>
                  <tr><td><strong>Layout Structure</strong></td><td>Figma HTML + Playwright DOM</td><td>HTML tree structure differences, wrong nesting, missing semantic elements</td></tr>
                </tbody>
              </table>
            </div>
          </section>


          <section id="aggregation">
            <h2>Step 8 — LLM Aggregation and Deduplication <span className="ml-tag llm-tag">LLM</span></h2>
            <p>After per-window comparisons, a final LLM aggregation pass consolidated findings across all four windows. Its job was to deduplicate issues flagged in adjacent windows (the same element appearing in two windows would be flagged twice), resolve conflicting severity classifications for the same element, and produce a single clean issue list per category exported to Jira.</p>

            <div className="code-entry">
              <div className="code-label"><span className="lang-dot"></span>python — LLM aggregation pass</div>
              <pre><code className="language-python">{`def aggregate_issues(all_window_issues: list[dict]) -> dict:
    """
    LLM aggregation pass — deduplicates cross-window findings,
    resolves conflicting severities, produces final categorised report.
    """
    issues_json = json.dumps(all_window_issues, indent=2)

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""
You are reviewing UI comparison findings from a 4-window sliding comparison.
The same UI element may have been flagged in multiple adjacent windows.

Raw findings across all windows:
{issues_json}

Tasks:
1. Deduplicate issues referring to the same UI element across windows
2. For duplicates with conflicting severity, use the higher severity
3. Consolidate into final categorised list: UI Essentials / Theme / Layout Structure
4. Return structured JSON with issue_count per category and full issue list.
"""
        }]
    )
    return parse_final_report(response.content[0].text)`}</code></pre>
            </div>
          </section>

        </div>
      </section>


      <section id="result">
        <div className="topic-card">
          <div className="star-header">
            <div className="star-letter star-r">R</div>
            <div>
              <div className="star-title">Result</div>
              <div className="star-subtitle">Measurable outcomes across all problem axes</div>
            </div>
          </div>
          <div className="metrics">
            <div className="metric-card"><span className="metric-val">Both cases</span><span className="metric-label">Large and subtle mismatches handled</span></div>
            <div className="metric-card"><span className="metric-val">SSIM-gated</span><span className="metric-label">Token cost saved on large mismatch path</span></div>
            <div className="metric-card"><span className="metric-val">3 categories</span><span className="metric-label">Structured issue classification</span></div>
            <div className="metric-card"><span className="metric-val">Jira export</span><span className="metric-label">Direct integration into QA workflow</span></div>
          </div>
          <ul>
            <li><strong>Subtle difference detection:</strong> The sliding window + SSIM masking combination solved the core LLM blindness problem for small mismatches — differences that were invisible to the LLM on the full image were reliably detected when presented in a zoomed, masked window.</li>
            <li><strong>Cost efficiency:</strong> The SSIM routing gate ensured the sliding window pipeline was only triggered when needed. Large mismatches were handled with a single full-image LLM call — no unnecessary windowing, no wasted tokens.</li>
            <li><strong>Structured output:</strong> The three-category classification gave QA teams an actionable, prioritised issue list — UI essentials for blocking issues, theme for visual polish, layout structure for architectural problems.</li>
            <li><strong>DOM-level coverage:</strong> By comparing HTML trees in addition to screenshots, the system caught structural issues invisible to pure visual comparison — wrong element nesting, missing ARIA attributes, incorrect component hierarchy.</li>
            <li><strong>Jira integration:</strong> Direct export into Jira tickets with severity, category, and screenshot evidence reduced manual QA reporting effort to zero for UI regression cycles.</li>
          </ul>
        </div>
      </section>


      <section id="concept-table">
        <div className="topic-card">
          <h2>All Concepts at a Glance</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Concept</th><th>What It Is</th><th>When to Use</th><th>Key Detail</th></tr></thead>
              <tbody>
                <tr><td><strong>SSIM</strong></td><td>Structural Similarity Index — pixel-level image similarity metric</td><td>Routing gate + masking signal</td><td>{<span dangerouslySetInnerHTML={{ __html: '$\\text{SSIM}(x,y) = \\frac{(2\\mu_x\\mu_y+c_1)(2\\sigma_{xy}+c_2)}{(\\mu_x^2+\\mu_y^2+c_1)(\\sigma_x^2+\\sigma_y^2+c_2)}$' }} />}</td></tr>
                <tr><td><strong>SSIM as Router</strong></td><td>Global scalar score decides full-image vs sliding window path</td><td>When you have two distinct handling strategies for different mismatch magnitudes</td><td>Score &lt; 0.95 → full image path; Score ≥ 0.95 → window + mask path</td></tr>
                <tr><td><strong>SSIM as Mask</strong></td><td>Pixel-wise SSIM map greys out similar regions, exposing dissimilar pixels</td><td>Reducing LLM visual noise in the small-mismatch case</td><td>full=True returns both scalar score and pixel map in one call</td></tr>
                <tr><td><strong>Sliding Window</strong></td><td>2x2 grid subdivision of image pair for localised comparison</td><td>When subtle differences are drowned out at full-image scale</td><td>4x zoom on differences relative to full image — increases LLM sensitivity</td></tr>
                <tr><td><strong>Frame Scaling</strong></td><td>Resize both images to identical dimensions before comparison</td><td>Always — prerequisite for meaningful SSIM computation</td><td>Figma artboard is ground truth; app screenshot conforms to it via LANCZOS resampling</td></tr>
                <tr><td><strong>Mask Dilation</strong></td><td>Expand binary difference mask to include context around flagged pixels</td><td>After SSIM masking — gives LLM element context, not isolated pixels</td><td>10x10 kernel, 2 iterations — shows the surrounding UI element, not just the diff pixel</td></tr>
                <tr><td><strong>Playwright</strong></td><td>Browser automation framework for screenshot + DOM capture</td><td>Capturing live application state for comparison</td><td>networkidle wait ensures all async assets loaded before capture</td></tr>
                <tr><td><strong>Figma Connector</strong></td><td>Third-party tool extracting Figma frames as rendered HTML</td><td>Getting both visual and structural representation of design</td><td>HTML extraction enables DOM tree comparison for layout structure category</td></tr>
                <tr><td><strong>MM LLM (Claude Sonnet)</strong></td><td>Multimodal LLM for semantic interpretation of visual differences</td><td>Understanding what a pixel difference means — not just that it exists</td><td>SSIM tells you where; LLM tells you what and why</td></tr>
                <tr><td><strong>LLM Aggregation</strong></td><td>Final LLM pass deduplicating cross-window findings</td><td>After sliding window — same element flagged in adjacent windows</td><td>Resolves conflicting severities, uses higher severity for duplicates</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      <section id="code-appendix">
        <div className="topic-card">
          <h2>Code Reference</h2>

          <div className="code-entry">
            <div className="code-label"><span className="lang-dot"></span>python — full pipeline orchestrator</div>
            <pre><code className="language-python">{`async def run_pixel_perfect(figma_url: str, app_url: str) -> dict:
    # Step 1: Capture
    app_capture   = await capture_page(app_url)
    figma_capture = await extract_figma(figma_url)  # Figma connector

    # Step 2: Scale to same frame
    figma_arr, app_arr = scale_to_same_frame(
        Image.open(figma_capture["screenshot"]),
        Image.open(app_capture["screenshot"])
    )

    # Step 3: Route via global SSIM
    route = route_comparison(figma_arr, app_arr)  # "full_image" or "sliding_window"

    # Step 4: Compare
    if route == "full_image":
        issues = compare_full_image(figma_arr, app_arr)
    else:
        issues = await compare_sliding_window(figma_arr, app_arr)

    # Step 5: DOM structure comparison (always runs)
    layout_issues = compare_dom_structure(figma_capture["dom"], app_capture["dom"])
    issues["layout_structure"].extend(layout_issues)

    # Step 6: Export to Jira
    return export_to_jira(issues)`}</code></pre>
          </div>

          <div className="code-entry">
            <div className="code-label"><span className="lang-dot"></span>python — SSIM routing + masking complete implementation</div>
            <pre><code className="language-python">{`from skimage.metrics import structural_similarity as ssim
import numpy as np, cv2

SSIM_THRESHOLD = 0.95
MASK_THRESHOLD = 0.95

def compute_global_ssim(a: np.ndarray, b: np.ndarray) -> tuple[float, np.ndarray]:
    ag = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY)
    bg = cv2.cvtColor(b, cv2.COLOR_RGB2GRAY)
    score, ssim_map = ssim(ag, bg, full=True, data_range=255)
    return score, ssim_map

def apply_ssim_mask(figma_w, app_w):
    _, ssim_map   = compute_global_ssim(figma_w, app_w)
    diff_mask     = (ssim_map < MASK_THRESHOLD).astype(np.uint8)
    kernel        = np.ones((10, 10), np.uint8)
    diff_mask     = cv2.dilate(diff_mask, kernel, iterations=2)
    grey          = np.full_like(figma_w, 200)
    return (np.where(diff_mask[:,:,None], figma_w, grey),
            np.where(diff_mask[:,:,None], app_w,   grey))`}</code></pre>
          </div>
        </div>
      </section>


      <section id="interview-qa">
        <div className="topic-card">
          <h2>Interview Q&A — Likely ZS Probes</h2>

          <h3>Q: Why use SSIM for routing instead of just always using the sliding window approach?</h3>
          <p>When differences are large — a missing section, a completely wrong layout, a full colour scheme change — the LLM detects them reliably on the full image. Running the sliding window pipeline in this case adds latency and token cost with zero benefit. The SSIM gate ensures the expensive pipeline is only triggered when it's actually needed: when images are highly similar and the LLM's small-difference blindness becomes the bottleneck.</p>

          <h3>Q: Why does windowing help the LLM detect subtle differences?</h3>
          <p>A subtle difference occupying 0.1% of a full-image frame occupies 0.4% of a 2x2 window — four times more visually prominent in the LLM's context. Combined with SSIM masking that removes the surrounding similar pixels, the LLM is effectively shown a zoomed-in, noise-filtered view of exactly the differences. The LLM's attention is forced onto the right regions rather than being distributed across the entire image.</p>

          <h3>Q: Why does SSIM do double duty as both router and mask — are those the same threshold?</h3>
          <p>Both use 0.95 in this implementation, but they're conceptually independent. The global scalar threshold routes the pipeline. The per-pixel threshold drives the mask. They happen to share the same value because the same definition of "sufficiently similar" applies at both the global and local level — but they could be tuned independently if needed. For example, a stricter masking threshold of 0.98 would expose more pixel context to the LLM, potentially helping with very subtle colour differences.</p>

          <h3>Q: Why grey out similar regions rather than cropping them out entirely?</h3>
          <p>Cropping would destroy spatial context — the LLM would see an isolated patch of pixels with no frame of reference for where in the UI it sits. Greying out preserves the spatial layout of the full window while visually suppressing similar regions. The LLM can still reason about the position of differences relative to other elements — "the button is misaligned relative to the input field above it" — which is critical for the UI Essentials category.</p>

          <h3>Q: Why compare DOM HTML trees in addition to screenshots?</h3>
          <p>Visual comparison alone cannot catch structural issues that are visually identical. Wrong element nesting, missing ARIA attributes, incorrect component hierarchy — these can all produce a visually correct output while having wrong DOM structure. By extracting HTML from both Figma (via the connector) and the live app (via Playwright), we can compare tree structure directly for the layout structure category, catching issues that pure pixel comparison would miss entirely.</p>

          <div className="callout callout-insight">
            <div className="callout-title">One-liner to land the answer</div>
            "The core ML contribution was using SSIM as an intelligent pre-processor for the MM LLM — routing between two handling strategies based on mismatch magnitude, and masking visual noise so the LLM only sees what it needs to see. SSIM tells you where and how much; the LLM tells you what it means and why it matters. Neither can do the job of the other."
          </div>
        </div>
      </section>


    </>
  );
}

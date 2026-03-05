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

export default function TCGPage() {
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
    <div className="hero-eyebrow">ZS ADS Interview Prep — Project 3</div>
    <h1>Test Case Generation Agent (TCG)</h1>
    <p className="hero-sub">Agentic QA Automation · CR / BRD / FSD Ingestion · RAG-Augmented Test Artifact Generation</p>
    <div className="badge-row">
      <span className="badge badge-purple">RAG + Cross-Encoder Reranker</span>
      <span className="badge badge-blue">Criticality Classifier</span>
      <span className="badge badge-teal">BERTScore Coverage Fidelity</span>
      <span className="badge badge-green">Cross-Scenario Deduplication</span>
      <span className="badge badge-amber">LLM Structured Output</span>
      <span className="badge badge-red">JSON / YAML Artifacts</span>
    </div>
  </div>

  
  <section id="pipeline">
    <div className="topic-card">
      <h3>End-to-End Pipeline</h3>
      <div className="flow">
        <div className="flow-step">CR / BRD / FSD</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Ingestion + Chunking</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Requirement Extraction</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">Criticality Classifier</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step rag">RAG Retrieval</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step rag">Cross-Encoder Reranker</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">TC Generation Agent</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">BERTScore Fidelity Check</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">Cross-Scenario Dedup</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step good">JSON / YAML Output</div>
      </div>
      <div className="callout callout-info">
        <div className="callout-title">Document Types</div>
        The pipeline ingests three document types — Change Requests (CR), Business Requirements Documents (BRD), and Functional Specifications Documents (FSD). Each produces a structured hierarchy: requirement header → requirement content → test scenarios → test cases, with product knowledge injected at every generation stage via RAG.
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
      <p>I built the Test Case Generation (TCG) agent as a fully agentic workflow that consumed software specification documents — Change Requests, Business Requirements Documents, and Functional Specification Documents — and automatically produced structured test artifacts: requirement headers, requirement content, test scenarios, and test cases, all in a structured JSON/YAML format ready for test management tooling.</p>
      <p>Previously, QA engineers manually read these documents and hand-authored test cases — a time-consuming process with inconsistent coverage quality, no systematic use of historical test knowledge, and no mechanism for catching redundant test cases across similar requirements.</p>

      <h3>Core Pain Points</h3>
      <ul>
        <li><strong>Manual effort:</strong> Writing test cases from a large BRD manually took days per document cycle and was bottlenecked on QA engineer bandwidth.</li>
        <li><strong>No product knowledge leverage:</strong> Engineers had tacit knowledge of product behaviour, regulatory rules, and historical defect patterns — none of this was systematically applied during test case authoring.</li>
        <li><strong>Flat requirement treatment:</strong> All requirements were treated with equal priority regardless of business risk, regulatory exposure, or historical defect rate — meaning trivial UI requirements got the same test effort as core payment processing logic.</li>
        <li><strong>No quality signal on output:</strong> Generated test cases had no validation against their parent requirements — semantically drifted or hallucinated test cases would pass through silently.</li>
        <li><strong>Cross-scenario redundancy:</strong> Semantically similar requirements across different sections of the document independently generated near-identical test cases — silently bloating the test suite.</li>
      </ul>
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
      <p>My task was to design the full TCG agentic pipeline — from raw document ingestion to structured test artifact emission — with ML layers inserted at the four key uncertainty points in the pipeline: retrieval quality, requirement prioritization, output fidelity, and cross-scenario redundancy.</p>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Stage</th><th>GenAI Component</th><th>ML Augmentation</th><th>What It Solves</th></tr></thead>
          <tbody>
            <tr><td>RAG Retrieval</td><td>Bi-encoder vector search</td><td>Cross-encoder reranker</td><td>Relevance over similarity — better context = better test cases</td></tr>
            <tr><td>Requirement Ingestion</td><td>LLM structured extraction</td><td>Criticality classifier</td><td>Risk-tiered generation effort — more scenarios for high-risk reqs</td></tr>
            <tr><td>Test Case Generation</td><td>LLM structured output (JSON)</td><td>BERTScore coverage fidelity</td><td>Detects semantically drifted or hallucinated test cases</td></tr>
            <tr><td>Post-generation</td><td>Raw JSON/YAML emission</td><td>Cross-scenario cosine dedup</td><td>Eliminates redundant test cases across different parent scenarios</td></tr>
          </tbody>
        </table>
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

      
      <section id="ingestion">
        <h2>Step 1 — Document Ingestion and Structured Chunking</h2>
        <p>I ingested CR, BRD, and FSD documents and chunked them by section structure — not by fixed token windows. Section-aware chunking preserves the semantic coherence of each requirement block, which is critical for both RAG retrieval quality and downstream extraction accuracy.</p>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — section-aware chunking</div>
          <pre><code className="language-python">{`import pymupdf
import re

def chunk_by_section(pdf_path: str) -> list[dict]:
    """
    Chunk document by detected section headers rather than fixed token windows.
    Preserves semantic coherence of requirement blocks.
    """
    doc = pymupdf.open(pdf_path)
    full_text = "\n".join(page.get_text() for page in doc)

    # Detect section boundaries by heading patterns (e.g. "3.1 Payment Processing")
    section_pattern = re.compile(r"(\d+\.\d+[\.\d]*\s+[A-Z][^\n]+)", re.MULTILINE)
    boundaries = [(m.start(), m.group()) for m in section_pattern.finditer(full_text)]

    chunks = []
    for i, (start, header) in enumerate(boundaries):
        end = boundaries[i+1][0] if i+1 < len(boundaries) else len(full_text)
        chunks.append({
            "header":  header.strip(),
            "content": full_text[start:end].strip(),
            "doc_type": detect_doc_type(full_text),  # CR / BRD / FSD
        })
    return chunks`}</code></pre>
        </div>
      </section>

      
      <section id="extraction">
        <h2>Step 2 — Requirement Extraction</h2>
        <p>Each section chunk was passed to a requirement extraction agent that used LLM structured output (JSON mode) to decompose the section into a typed requirement object — header, functional content, acceptance criteria, and linked scenarios. Every generated test case traces back to a specific parent requirement through this structure.</p>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — requirement schema (Pydantic + LLM)</div>
          <pre><code className="language-python">{`from pydantic import BaseModel
from typing import Optional

class Requirement(BaseModel):
    req_id:              str               # e.g. "REQ-3.1.2"
    header:              str               # short title
    content:             str               # full functional description
    acceptance_criteria: list[str]         # measurable pass conditions
    doc_type:            str               # CR / BRD / FSD
    section_ref:         str               # source section in document
    risk_tier:           Optional[str]     # filled by criticality classifier

class TestScenario(BaseModel):
    scenario_id:   str
    parent_req_id: str
    description:   str
    test_cases:    list["TestCase"]        # all TCs generated in single agent call

class TestCase(BaseModel):
    tc_id:           str
    scenario_id:     str
    tc_type:         str                   # positive / negative / edge
    precondition:    str
    steps:           list[str]
    expected_result: str
    bertscore:       Optional[float]       # filled post-generation
    is_duplicate:    Optional[bool]        # filled post-generation`}</code></pre>
        </div>
      </section>

      
      <section id="criticality">
        <h2>Step 3 — Requirement Criticality Classifier <span className="ml-tag">ML</span></h2>
        <p>Before test case generation, I ran each extracted requirement through a criticality classifier that assigned it a risk tier — P0, P1, or P2. This tier controlled how many test scenarios the generation agent was instructed to produce: P0 requirements (payment processing, regulatory rules) got more scenarios and mandatory negative/edge cases. P2 requirements (UI labels, display formatting) got minimal coverage.</p>

        <h3>Features Used</h3>
        <ul>
          <li><strong>Regulatory keyword presence:</strong> TF-IDF weighted keywords — "compliance", "AML", "KYC", "settlement", "credit limit" — extracted from requirement content.</li>
          <li><strong>Requirement type signal:</strong> Functional vs. non-functional classification from document section metadata.</li>
          <li><strong>Historical defect rate proxy:</strong> Cosine similarity between the requirement and a corpus of historically high-defect requirements from past BRDs — higher similarity = higher risk tier.</li>
          <li><strong>Dependency count:</strong> Number of other requirements referencing this requirement ID — higher dependency = higher risk.</li>
        </ul>

        <div className="callout callout-info">
          <div className="callout-title">Why This Is an ML Problem Not a Rules Problem</div>
          A rule like "if contains 'payment' → P0" fails immediately — "display payment history" is P2, "process payment settlement" is P0. The criticality signal is contextual, not keyword-based. A classifier trained on historical defect data learns this context automatically.
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
import numpy as np

# Feature: TF-IDF on requirement content
# Feature: historical defect similarity score
# Feature: dependency count (numeric)
# Label:   P0 / P1 / P2 (from historical QA records)

def build_feature_vector(req: Requirement, hist_matrix, hist_tfidf) -> np.ndarray:
    content_vec = req_tfidf.transform([req.content])
    hist_sim    = cosine_similarity(content_vec, hist_matrix).max()
    dep_count   = count_dependencies(req.req_id, all_requirements)
    is_func     = 1 if req.doc_type == "FSD" else 0
    return np.array([[hist_sim, dep_count, is_func]])

criticality_clf = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1,2))),
    ("clf",   LogisticRegression(multi_class="multinomial"))
])

def get_risk_tier(req: Requirement) -> str:
    features = build_feature_vector(req, hist_matrix, hist_tfidf)
    return criticality_clf.predict([req.content])[0]  # "P0" / "P1" / "P2"`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L9-13</span> Build feature vector per requirement — historical defect similarity, dependency count, doc type signal</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L14</span> hist_sim — cosine sim to historically high-defect requirements; proxy for risk without labeled defect data per requirement</div>
            <div className="annotation-line"><span>L15</span> dep_count — requirements with many dependents are higher risk; breaking them causes cascade failures</div>
            <div className="annotation-line"><span>L16</span> is_func — FSD requirements are more likely functional with specific pass/fail criteria</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L18-21</span> Pipeline: TF-IDF on content + Logistic Regression — multinomial for 3-class P0/P1/P2 output</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L23-25</span> At inference — tier drives how many scenarios the generation agent is prompted to produce</div>
          </div>
        </div>
      </section>

      
      <section id="rag">
        <h2>Step 4 — RAG with Cross-Encoder Reranker <span className="ml-tag rag-tag">RAG</span></h2>
        <p>Before test case generation, I injected relevant product knowledge into the generation context using a two-stage RAG pipeline. The knowledge base contained product manuals, historical test cases, and regulatory compliance documents.</p>

        <h3>Why Two-Stage RAG?</h3>
        <p>Standard single-stage RAG uses a bi-encoder for retrieval — fast, but optimizes for embedding similarity, not contextual relevance to the specific requirement. A cross-encoder reads the requirement and each candidate chunk together and scores their joint relevance — far more accurate, but too slow to run over the full knowledge base. The two-stage approach gets the best of both.</p>

        <div className="callout callout-info">
          <div className="callout-title">Bi-Encoder vs Cross-Encoder</div>
          {<span dangerouslySetInnerHTML={{__html: '$$\\text{Bi-encoder: } \\text{sim}(E(q), E(d)) \\quad \\text{Cross-encoder: } \\text{score}(q \\oplus d)$$'}} />}
          <p style={{'fontSize': '0.82rem', 'color': '#8b949e', 'marginTop': '0.5rem'}}>Bi-encoder embeds query and document independently — fast but loses cross-attention between them. Cross-encoder concatenates query and document and scores jointly — slower but captures fine-grained relevance. Use bi-encoder for candidate retrieval, cross-encoder for reranking top-k.</p>
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sentence_transformers import SentenceTransformer, CrossEncoder
import numpy as np

bi_encoder    = SentenceTransformer("all-MiniLM-L6-v2")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def retrieve_context(requirement: Requirement, kb_chunks: list[str],
                     top_k_bi=20, top_k_cross=5) -> list[str]:

    # Stage 1: Bi-encoder — fast candidate retrieval
    req_emb    = bi_encoder.encode(requirement.content)
    chunk_embs = bi_encoder.encode(kb_chunks)
    scores     = np.dot(chunk_embs, req_emb)
    top_k_idx  = np.argsort(scores)[::-1][:top_k_bi]
    candidates = [kb_chunks[i] for i in top_k_idx]

    # Stage 2: Cross-encoder reranking — relevance over similarity
    pairs  = [(requirement.content, chunk) for chunk in candidates]
    scores = cross_encoder.predict(pairs)
    ranked = sorted(zip(scores, candidates), reverse=True)

    return [chunk for _, chunk in ranked[:top_k_cross]]`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L4</span> Bi-encoder — lightweight, produces independent embeddings for fast ANN search</div>
            <div className="annotation-line"><span>L5</span> Cross-encoder — reads requirement + candidate together, produces joint relevance score</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L8-13</span> Stage 1: embed requirement, compute dot product against all KB chunks, take top-20 candidates</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L15-18</span> Stage 2: cross-encoder scores each (requirement, candidate) pair jointly — far more contextually accurate than cosine similarity alone</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L20</span> Return top-5 reranked chunks as generation context — injected into TC generation prompt</div>
          </div>
        </div>
      </section>

      
      <section id="generation">
        <h2>Step 5 — Test Case Generation Agent</h2>
        <p>For each requirement, the generation agent received: the structured requirement object, its risk tier (from the criticality classifier), the reranked RAG context (product knowledge + historical test cases + regulatory rules), and a schema-enforced output format.</p>
        <p>All test cases for a given scenario were generated in a single agent call — giving the LLM full within-scenario context so it could naturally produce complementary positive, negative, and edge cases without intra-scenario duplication.</p>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — generation agent call</div>
          <pre><code className="language-python">{`SCENARIO_COUNT_MAP = {"P0": 5, "P1": 3, "P2": 1}  # risk tier → scenario budget

async def generate_test_cases(req: Requirement, context_chunks: list[str]) -> list[TestScenario]:
    scenario_count = SCENARIO_COUNT_MAP[req.risk_tier]
    rag_context    = "\n\n".join(context_chunks)

    prompt = f"""
You are a QA expert for a Digital Transactional Banking platform.

REQUIREMENT:
ID: {req.req_id}
Header: {req.header}
Content: {req.content}
Acceptance Criteria: {req.acceptance_criteria}

PRODUCT KNOWLEDGE CONTEXT:
{rag_context}

INSTRUCTIONS:
Generate exactly {scenario_count} test scenarios for this requirement.
For each scenario, generate ALL test cases (positive, negative, edge) in a single response.
Return structured JSON matching the TestScenario schema.
Each test case must directly address the requirement content above.
"""
    response = await llm_client.chat(prompt, response_format={"type": "json_object"})
    return [TestScenario(**s) for s in response["scenarios"]]`}</code></pre>
        </div>

        <div className="callout callout-success">
          <div className="callout-title">Why All TCs Per Scenario in One Call</div>
          Generating all test cases for a scenario in a single LLM call gives the model full within-scenario context — it can see the positive TC it just wrote when producing the negative TC, ensuring natural complementarity and eliminating intra-scenario duplication without any post-processing.
        </div>
      </section>

      
      <section id="bertscore">
        <h2>Step 6 — BERTScore Coverage Fidelity Check <span className="ml-tag">ML</span></h2>
        <p>After generation, I scored each test case against its parent requirement using BERTScore — a semantic similarity metric based on contextual token embeddings. A test case that scores low against its parent requirement has semantically drifted from the requirement it was supposed to test — likely hallucinated or off-topic. These are flagged for regeneration.</p>

        <h3>Why BERTScore Over Cosine Similarity?</h3>
        <p>Standard cosine similarity on sentence embeddings compresses the entire test case into a single vector — losing fine-grained token-level alignment. BERTScore computes token-level precision and recall between the requirement and test case using contextual embeddings, making it far more sensitive to partial coverage and semantic drift.</p>

        <div className="callout callout-info">
          <div className="callout-title">BERTScore Formula</div>
          {<span dangerouslySetInnerHTML={{__html: '$$P_{BERT} = \\frac{1}{|\\hat{y}|} \\sum_{\\hat{y}_j \\in \\hat{y}} \\max_{y_i \\in y} \\mathbf{x}_i^\\top \\mathbf{x}_j$$'}} />}
          {<span dangerouslySetInnerHTML={{__html: '$$R_{BERT} = \\frac{1}{|y|} \\sum_{y_i \\in y} \\max_{\\hat{y}_j \\in \\hat{y}} \\mathbf{x}_i^\\top \\mathbf{x}_j$$'}} />}
          {<span dangerouslySetInnerHTML={{__html: '$$F_{BERT} = 2 \\cdot \\frac{P_{BERT} \\cdot R_{BERT}}{P_{BERT} + R_{BERT}}$$'}} />}
          <p style={{'fontSize': '0.82rem', 'color': '#8b949e', 'marginTop': '0.5rem'}}>$y$ = requirement tokens, {<span dangerouslySetInnerHTML={{__html: '$\\hat{y}$'}} />} = test case tokens, {<span dangerouslySetInnerHTML={{__html: '$\\mathbf{x}$'}} />} = contextual BERT embeddings. $F_{"{"}BERT{"}"}$ below threshold indicates the test case does not adequately cover its parent requirement — flag for regeneration.</p>
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from bert_score import score as bert_score

FIDELITY_THRESHOLD = 0.75  # F_BERT below this = drifted TC

def score_test_case_fidelity(
    requirement: Requirement,
    test_cases:  list[TestCase]
) -> list[TestCase]:

    references = [requirement.content] * len(test_cases)
    candidates = [
        f"{tc.precondition} {' '.join(tc.steps)} {tc.expected_result}"
        for tc in test_cases
    ]

    P, R, F = bert_score(
        cands=candidates,
        refs=references,
        lang="en",
        model_type="distilbert-base-uncased"
    )

    for tc, f_score in zip(test_cases, F.tolist()):
        tc.bertscore = f_score
        if f_score < FIDELITY_THRESHOLD:
            tc = regenerate_test_case(tc, requirement)  # targeted retry

    return test_cases`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L3</span> Threshold tuned on a validation set of known good/bad TCs — 0.75 is a reasonable starting point</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L8-12</span> Build candidate strings by concatenating precondition + steps + expected result — full TC surface area</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L13-18</span> BERTScore computes token-level precision, recall, F1 between requirement and each TC using DistilBERT contextual embeddings</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L20-23</span> Attach F score to TC object — stored in output JSON for audit trail. Low-scoring TCs are flagged and regenerated with tighter constraint prompting</div>
          </div>
        </div>
      </section>

      
      <section id="dedup">
        <h2>Step 7 — Cross-Scenario Deduplication <span className="ml-tag">ML</span></h2>
        <p>After all scenarios were generated and fidelity-checked, I ran cross-scenario deduplication. The key insight here is that intra-scenario duplication is structurally impossible — all test cases for a scenario are generated in a single LLM call with full within-context awareness. The real redundancy risk is cross-scenario: two different requirement scenarios that are semantically similar independently generate near-identical test cases because the LLM has no cross-call memory.</p>

        <div className="callout callout-warn">
          <div className="callout-title">Why NOT flag within-scenario pairs</div>
          A positive TC and its negative TC for the same scenario will typically score 0.70-0.85 cosine similarity — they share the same precondition, same feature under test, same steps with one variable changed. This is correct and expected. Flagging these as duplicates would destroy valid test coverage. The dedup filter only runs across different parent scenarios.
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

embedder = SentenceTransformer("all-MiniLM-L6-v2")
DEDUP_THRESHOLD = 0.92  # high bar — only flag near-identical TCs

def dedup_cross_scenario(all_scenarios: list[TestScenario]) -> list[TestCase]:
    all_tcs = [tc for s in all_scenarios for tc in s.test_cases]

    tc_texts = [
        f"{tc.precondition} {' '.join(tc.steps)} {tc.expected_result}"
        for tc in all_tcs
    ]
    embeddings = embedder.encode(tc_texts)
    sim_matrix = cosine_similarity(embeddings)

    flagged = set()
    for i in range(len(all_tcs)):
        for j in range(i+1, len(all_tcs)):
            same_scenario = all_tcs[i].scenario_id == all_tcs[j].scenario_id
            if not same_scenario and sim_matrix[i][j] >= DEDUP_THRESHOLD:
                # Flag the later-generated TC as duplicate — keep the first
                flagged.add(all_tcs[j].tc_id)
                all_tcs[j].is_duplicate = True

    return [tc for tc in all_tcs if tc.tc_id not in flagged]`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L5</span> 0.92 threshold — deliberately high to only catch near-identical TCs, not semantically related ones</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L7-8</span> Flatten all TCs across all scenarios into a single list for cross-scenario comparison</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L10-14</span> Embed full TC text (precondition + steps + expected result) — same representation as BERTScore stage</div>
            <div className="annotation-line"><span>L15</span> Compute full pairwise similarity matrix in one vectorised op</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L17-23</span> Only flag pairs from DIFFERENT parent scenarios above threshold — within-scenario pairs are explicitly skipped</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L25</span> Return deduplicated TC list — flagged TCs retained in output JSON with is_duplicate=True for audit trail</div>
          </div>
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
        <div className="metric-card"><span className="metric-val">Days → Hours</span><span className="metric-label">TC authoring cycle time</span></div>
        <div className="metric-card"><span className="metric-val">Risk-tiered</span><span className="metric-label">Generation effort by requirement criticality</span></div>
        <div className="metric-card"><span className="metric-val">BERTScore</span><span className="metric-label">Quality floor on every TC</span></div>
        <div className="metric-card"><span className="metric-val">Cross-scenario</span><span className="metric-label">Dedup keeps test suite lean</span></div>
      </div>
      <ul>
        <li><strong>Speed:</strong> Manual test case authoring from a full BRD went from days to hours — the agent handled extraction, RAG-augmented generation, fidelity scoring, and deduplication end-to-end.</li>
        <li><strong>Coverage quality:</strong> The criticality classifier ensured P0 payment and regulatory requirements received proportionally more test scenarios — fixing the flat-coverage problem of treating all requirements equally.</li>
        <li><strong>RAG quality:</strong> The cross-encoder reranker significantly improved the relevance of product knowledge injected into the generation context — directly improving test case accuracy for edge cases requiring product-specific knowledge.</li>
        <li><strong>Output integrity:</strong> BERTScore fidelity checks created a measurable quality floor — semantically drifted test cases were caught and regenerated before emission rather than silently entering the test suite.</li>
        <li><strong>Suite leanness:</strong> Cross-scenario deduplication kept the test suite clean without touching valid within-scenario positive/negative pairs — maintaining coverage while eliminating maintenance overhead from redundant cases.</li>
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
            <tr><td><strong>Section-Aware Chunking</strong></td><td>Chunk documents by structural section boundaries, not fixed token windows</td><td>Documents with logical section hierarchy (BRD, FSD)</td><td>Preserves semantic coherence of requirement blocks for better RAG retrieval</td></tr>
            <tr><td><strong>Bi-Encoder</strong></td><td>Encodes query and document independently into embeddings for fast ANN search</td><td>Stage 1 candidate retrieval over large knowledge bases</td><td>Fast but loses cross-attention — use for candidate shortlisting only</td></tr>
            <tr><td><strong>Cross-Encoder Reranker</strong></td><td>Scores (query, document) pairs jointly using full attention</td><td>Stage 2 reranking of bi-encoder candidates</td><td>{<span dangerouslySetInnerHTML={{__html: '$\\text{score}(q \\oplus d)$'}} />} — contextually accurate, too slow for full KB</td></tr>
            <tr><td><strong>Criticality Classifier</strong></td><td>ML classifier assigning risk tier (P0/P1/P2) to requirements</td><td>Allocating generation effort proportionally to business risk</td><td>Features: regulatory keyword presence, historical defect similarity, dependency count</td></tr>
            <tr><td><strong>BERTScore</strong></td><td>Token-level semantic similarity using contextual BERT embeddings</td><td>Measuring how well a TC covers its parent requirement</td><td>$F_{"{"}BERT{"}"}$ below threshold = semantically drifted TC — flag for regeneration</td></tr>
            <tr><td><strong>BERTScore Precision</strong></td><td>Fraction of TC tokens matched to requirement tokens</td><td>Detecting hallucinated content in TCs</td><td>{<span dangerouslySetInnerHTML={{__html: '$P_{BERT} = \\frac{1}{|\\hat{y}|}\\sum \\max_{y_i} \\mathbf{x}_i^\\top\\mathbf{x}_j$'}} />}</td></tr>
            <tr><td><strong>BERTScore Recall</strong></td><td>Fraction of requirement tokens covered by TC tokens</td><td>Detecting incomplete coverage in TCs</td><td>{<span dangerouslySetInnerHTML={{__html: '$R_{BERT} = \\frac{1}{|y|}\\sum \\max_{\\hat{y}_j} \\mathbf{x}_i^\\top\\mathbf{x}_j$'}} />}</td></tr>
            <tr><td><strong>Cross-Scenario Dedup</strong></td><td>Cosine similarity on TC embeddings across different parent scenarios</td><td>Post-generation — eliminating redundant TCs from similar requirements</td><td>0.92+ threshold, within-scenario pairs explicitly excluded</td></tr>
            <tr><td><strong>Single-Call Scenario Generation</strong></td><td>All TCs for a scenario generated in one LLM call</td><td>Ensuring within-scenario complementarity without post-processing</td><td>LLM has full context of all TCs it wrote — naturally avoids intra-scenario duplication</td></tr>
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
        <pre><code className="language-python">{`async def run_tcg_pipeline(pdf_path: str) -> list[TestCase]:
    # Step 1: Ingest + chunk
    chunks = chunk_by_section(pdf_path)

    # Step 2: Extract requirements
    requirements = [extract_requirement(chunk) for chunk in chunks]

    # Step 3: Classify criticality
    for req in requirements:
        req.risk_tier = get_risk_tier(req)

    # Step 4+5: RAG + generate per requirement
    all_scenarios = []
    for req in requirements:
        context = retrieve_context(req, kb_chunks)          # bi-encoder + cross-encoder
        scenarios = await generate_test_cases(req, context) # single call per scenario
        all_scenarios.extend(scenarios)

    # Step 6: BERTScore fidelity check
    for scenario in all_scenarios:
        req = get_requirement(scenario.parent_req_id)
        scenario.test_cases = score_test_case_fidelity(req, scenario.test_cases)

    # Step 7: Cross-scenario deduplication
    final_tcs = dedup_cross_scenario(all_scenarios)

    return final_tcs`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — two-stage RAG retrieval</div>
        <pre><code className="language-python">{`from sentence_transformers import SentenceTransformer, CrossEncoder
import numpy as np

bi_encoder    = SentenceTransformer("all-MiniLM-L6-v2")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def retrieve_context(req: Requirement, kb_chunks: list[str],
                     top_k_bi: int = 20, top_k_cross: int = 5) -> list[str]:
    req_emb    = bi_encoder.encode(req.content)
    chunk_embs = bi_encoder.encode(kb_chunks)
    bi_scores  = np.dot(chunk_embs, req_emb)
    candidates = [kb_chunks[i] for i in np.argsort(bi_scores)[::-1][:top_k_bi]]

    pairs        = [(req.content, c) for c in candidates]
    cross_scores = cross_encoder.predict(pairs)
    ranked       = sorted(zip(cross_scores, candidates), reverse=True)
    return [c for _, c in ranked[:top_k_cross]]`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — BERTScore fidelity scoring</div>
        <pre><code className="language-python">{`from bert_score import score as bert_score

FIDELITY_THRESHOLD = 0.75

def score_test_case_fidelity(req: Requirement, tcs: list[TestCase]) -> list[TestCase]:
    refs  = [req.content] * len(tcs)
    cands = [f"{tc.precondition} {' '.join(tc.steps)} {tc.expected_result}" for tc in tcs]
    _, _, F = bert_score(cands=cands, refs=refs, lang="en", model_type="distilbert-base-uncased")
    for tc, f in zip(tcs, F.tolist()):
        tc.bertscore = f
        if f < FIDELITY_THRESHOLD:
            tc = regenerate_test_case(tc, req)
    return tcs`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — cross-scenario deduplication</div>
        <pre><code className="language-python">{`from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

embedder = SentenceTransformer("all-MiniLM-L6-v2")
DEDUP_THRESHOLD = 0.92

def dedup_cross_scenario(scenarios: list[TestScenario]) -> list[TestCase]:
    all_tcs  = [tc for s in scenarios for tc in s.test_cases]
    tc_texts = [f"{tc.precondition} {' '.join(tc.steps)} {tc.expected_result}" for tc in all_tcs]
    sim_mat  = cosine_similarity(embedder.encode(tc_texts))

    flagged = set()
    for i in range(len(all_tcs)):
        for j in range(i+1, len(all_tcs)):
            diff_scenario = all_tcs[i].scenario_id != all_tcs[j].scenario_id
            if diff_scenario and sim_mat[i][j] >= DEDUP_THRESHOLD:
                flagged.add(all_tcs[j].tc_id)
                all_tcs[j].is_duplicate = True

    return [tc for tc in all_tcs if tc.tc_id not in flagged]`}</code></pre>
      </div>
    </div>
  </section>

  
  <section id="interview-qa">
    <div className="topic-card">
      <h2>Interview Q&A — Likely ZS Probes</h2>

      <h3>Q: Why add a reranker on top of vector search? Isn't cosine similarity enough?</h3>
      <p>Cosine similarity measures proximity in embedding space — two chunks can be close in vector space without being relevant to a specific requirement's context. A cross-encoder reads the requirement and each candidate chunk together with full attention, scoring their joint relevance. For a requirement about "payment settlement timeout behaviour", a bi-encoder might retrieve generic timeout documentation because the embeddings are similar. A cross-encoder understands the specific combination and ranks payment-specific timeout handling above generic content. Better retrieval directly produces better test cases.</p>

      <h3>Q: Why not just use rules to prioritize requirements by keyword?</h3>
      <p>A rule like "if contains 'payment' → P0" fails immediately in practice — "display payment history" is P2, "process payment settlement" is P0. The criticality signal is contextual, not keyword-based. A classifier trained on historical defect data learns this distinction automatically. Additionally, features like dependency count and historical defect similarity from past BRDs cannot be encoded in keyword rules — they require learned representations.</p>

      <h3>Q: Why BERTScore and not simple cosine similarity for fidelity checking?</h3>
      <p>Sentence-level cosine similarity compresses the entire test case into a single vector, losing token-level alignment information. BERTScore computes token-level precision and recall between the requirement and test case using contextual BERT embeddings — it's sensitive to whether specific requirement concepts appear in the test case, not just whether the overall topic is similar. A test case about "timeout handling" for a "settlement processing" requirement would score well on cosine similarity but poorly on BERTScore recall — correctly detecting incomplete coverage.</p>

      <h3>Q: Why is the deduplication threshold set high at 0.92?</h3>
      <p>Positive and negative test cases of the same scenario — or test cases for functionally related scenarios like "payment timeout" and "collection timeout" — will naturally score 0.70-0.85 similarity. These are valid, complementary cases that should not be deduplicated. Setting the threshold at 0.92 ensures only near-identical test cases — same precondition, same steps, same expected result with trivial variation — are flagged. The threshold was validated on a sample of known duplicate and non-duplicate pairs from historical test suites.</p>

      <h3>Q: Why generate all test cases for a scenario in one agent call?</h3>
      <p>Generating all TCs for a scenario in a single call gives the LLM full within-scenario context — it can see the positive TC it just wrote when producing the negative TC, ensuring natural complementarity and making intra-scenario duplication structurally impossible. Splitting into separate calls would require a separate dedup pass within each scenario, adding latency and complexity with no benefit.</p>

      <div className="callout callout-insight">
        <div className="callout-title">One-liner to land the answer</div>
        "The core contribution was not the LLM generation — every team can prompt an LLM to write test cases. The contribution was the ML layer around it: a reranker that makes RAG context actually relevant, a criticality classifier that allocates generation effort by business risk, BERTScore checks that create a quality floor, and cross-scenario dedup that keeps the output suite lean. Together these turn a PoC-quality GenAI pipeline into a production-quality QA automation system."
      </div>
    </div>
  </section>


        </>
    );
}

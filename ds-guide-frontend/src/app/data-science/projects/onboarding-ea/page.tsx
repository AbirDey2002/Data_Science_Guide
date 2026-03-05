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

export default function OnboardingEAPage() {
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
    <div className="hero-eyebrow">ZS ADS Interview Prep — Project 2</div>
    <h1>Onboarding Expert Agent</h1>
    <p className="hero-sub">Digital Transactional Banking · Payments · Collections · Trade Finance · Supply Chain · KYC Automation</p>
    <div className="badge-row">
      <span className="badge badge-blue">TF-IDF + Logistic Regression</span>
      <span className="badge badge-teal">Amazon Textract OCR</span>
      <span className="badge badge-purple">Isolation Forest</span>
      <span className="badge badge-green">Fuzzy Entity Matching</span>
      <span className="badge badge-amber">HITL Review Loop</span>
      <span className="badge badge-red">Pydantic Validation</span>
    </div>
  </div>

  
  <section id="system-flow">
    <div className="topic-card">
      <h3>End-to-End Pipeline</h3>
      <p>The full onboarding pipeline from raw PDF document to KYC-mapped JSON sent to the DTB application:</p>
      <div className="flow">
        <div className="flow-step">Incoming PDF</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">Doc Classifier <span className="ml-tag">ML</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-step hitl">Low Confidence? → HITL</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Textract OCR</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Specialized Agent</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Pydantic Validation</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">Anomaly Detection <span className="ml-tag">ML</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-step ml">Entity Resolution <span className="ml-tag">ML</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-step hitl">Low Similarity? → HITL</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step good">KYC ISO JSON → DTB</div>
      </div>
      <div className="callout callout-info">
        <div className="callout-title">Product Context</div>
        Digital Transactional Banking (DTB) is a unified product line spanning payments, collections, receivables, liquidity management, trade finance, and supply chain. Onboarding a corporate client requires processing multiple document types across all these sub-products — a process that previously took weeks of manual work across multiple Points of Application.
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

      <p>I worked on the Onboarding Expert Agent for our Digital Transactional Banking product line — a unified platform covering payments, collections, receivables, liquidity, trade finance, and supply chain. Onboarding a new corporate client onto DTB required processing multiple document types: channel onboarding forms, corporate onboarding documents, board resolutions, KYC declarations, and more.</p>

      <p>The existing process was entirely manual. Personnel had to receive documents at different Points of Application, extract relevant fields by hand, validate them against regulatory and formatting requirements, and submit them to the DTB application for approval — waiting on human reviewers at every stage. A full onboarding cycle took weeks.</p>

      <h3>Core Pain Points</h3>
      <ul>
        <li><strong>Manual classification:</strong> Every incoming document was manually triaged to the right team — slow, error-prone, and a bottleneck when document volumes spiked.</li>
        <li><strong>Inconsistent extraction:</strong> Different personnel extracted fields differently from the same document type, leading to downstream data quality issues in KYC records.</li>
        <li><strong>No anomaly detection:</strong> Validation was purely format-based — a correctly formatted credit limit of $50B would pass without flag. Plausibility was entirely a human judgement call.</li>
        <li><strong>Duplicate onboarding risk:</strong> The same corporate entity could be onboarded multiple times under slightly different name variations — creating downstream KYC conflicts and compliance exposure.</li>
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

      <p>My task was to design and build a fully agentic onboarding pipeline on Azure using FastAPI as the orchestration layer — replacing the manual multi-week process with an automated system that could handle classification, extraction, validation, anomaly detection, entity resolution, and KYC mapping end-to-end, with Human-in-the-Loop checkpoints at low-confidence decision points.</p>

      <h3>ML Touchpoints I Was Responsible For</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Stage</th><th>What I Built</th><th>Why ML Over Rules</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Document Classification</td>
              <td>TF-IDF + Logistic Regression classifier with confidence gating</td>
              <td>Confidence scores enable HITL routing — LLM classification gives labels but no calibrated probability</td>
            </tr>
            <tr>
              <td>Field Extraction</td>
              <td>Amazon Textract OCR → specialized LLM agent → structured output with per-field confidence scores</td>
              <td>Textract's confidence scores expose extraction uncertainty at field level — not available with pure LLM extraction</td>
            </tr>
            <tr>
              <td>Validation</td>
              <td>Pydantic schema validation (format, type, regional currency rules)</td>
              <td>Catches structural errors; does not catch plausibility errors — that's anomaly detection's job</td>
            </tr>
            <tr>
              <td>Anomaly Detection</td>
              <td>Isolation Forest on numeric fields trained on historical onboarding records</td>
              <td>Rules validate format; ML validates plausibility — catching values that pass format checks but are statistically implausible</td>
            </tr>
            <tr>
              <td>Entity Resolution</td>
              <td>TF-IDF cosine similarity + HITL for low-similarity matches</td>
              <td>Exact-match rules fail on legal name variations; fuzzy matching catches aliases and subsidiaries</td>
            </tr>
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

      
      <section id="classifier">
        <h2>Step 1 — Document Classifier <span className="ml-tag">ML</span></h2>
        <p>The first agent I built was a document type classifier. Incoming PDFs were converted to text using PyMuPDF, then classified into one of ~10 document types: channel onboarding, corporate onboarding, board resolution, KYC declaration, trade finance mandate, and so on.</p>

        <h3>Why Not LLM Classification?</h3>
        <p>This is a closed, finite label set. Using an LLM for a 10-class classification problem is expensive overkill. More importantly, an LLM gives you a label — it does not give you a calibrated confidence probability. I needed a confidence score to route ambiguous documents to human review. A trained classifier gives me exactly that.</p>

        <div className="callout callout-warn">
          <div className="callout-title">Interview Gotcha</div>
          If asked "why not just prompt the LLM to also output a confidence score?" — LLM self-reported confidence is not calibrated. A logistic regression's output probability IS calibrated (or can be calibrated with Platt scaling). These are not the same thing.
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
import pymupdf

def extract_text(pdf_path: str) -> str:
    doc = pymupdf.open(pdf_path)
    return " ".join(page.get_text() for page in doc)

# Training
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    stop_words="english"
)
X_train = vectorizer.fit_transform(train_texts)
clf = LogisticRegression(max_iter=1000, C=1.0)
calibrated_clf = CalibratedClassifierCV(clf, cv=5)
calibrated_clf.fit(X_train, train_labels)

# Inference
def classify_document(pdf_path: str):
    text = extract_text(pdf_path)
    X = vectorizer.transform([text])
    proba = calibrated_clf.predict_proba(X)[0]
    pred_class = calibrated_clf.classes_[proba.argmax()]
    confidence = proba.max()
    return pred_class, confidence`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L1-3</span> Sklearn classifier + Platt scaling calibration</div>
            <div className="annotation-line"><span>L4</span> PyMuPDF for PDF text extraction</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L6-8</span> Extract raw text from all pages of incoming PDF</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L11-15</span> TF-IDF with bigrams — captures phrases like "board resolution", "trade finance mandate"</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L16-18</span> Logistic Regression wrapped in CalibratedClassifierCV — Platt scaling produces calibrated probabilities</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L21-27</span> At inference: classify + extract confidence score — confidence gates the HITL routing decision</div>
          </div>
        </div>

        <h3>HITL Confidence Gating</h3>
        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — confidence gate</div>
          <pre><code className="language-python">{`CONFIDENCE_THRESHOLD = 0.80  # tuned on validation set

def route_document(pdf_path: str):
    doc_type, confidence = classify_document(pdf_path)

    if confidence < CONFIDENCE_THRESHOLD:
        # Route to human review queue — do not proceed
        flag_for_human_review(pdf_path, predicted=doc_type, confidence=confidence)
        return None

    # High confidence — proceed to specialized extraction agent
    return dispatch_to_agent(doc_type, pdf_path)`}</code></pre>
        </div>
      </section>

      
      <section id="ocr">
        <h2>Step 2 — OCR + Per-Field Confidence Scoring</h2>
        <p>Once classified, the document was sent to Amazon Textract for OCR. I used Textract's <code>AnalyzeDocument</code> API which returns not just extracted text but a per-block confidence score for every detected field — a critical signal for downstream quality control.</p>

        <p>The extracted fields and their confidence scores were then passed to a specialized LLM agent (one per document type) which structured them into a typed JSON output. Low-confidence Textract fields were explicitly flagged in the structured output so downstream validation knew which fields needed extra scrutiny.</p>

        <div className="code-annotated">
          <pre><code className="language-python">{`import boto3

textract = boto3.client("textract", region_name="us-east-1")

def extract_fields(pdf_bytes: bytes) -> list[dict]:
    response = textract.analyze_document(
        Document={"Bytes": pdf_bytes},
        FeatureTypes=["FORMS"]
    )
    fields = []
    for block in response["Blocks"]:
        if block["BlockType"] == "KEY_VALUE_SET":
            if "KEY" in block.get("EntityTypes", []):
                fields.append({
                    "key":        get_text(block, response),
                    "value":      get_value_text(block, response),
                    "confidence": block["Confidence"] / 100.0
                })
    return fields  # [{"key": "Company Name", "value": "Tata Steel", "confidence": 0.97}]`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L3</span> Textract client — deployed on Azure but calling AWS Textract via SDK</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L5-9</span> AnalyzeDocument with FORMS feature — extracts key-value pairs from structured forms</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L10-18</span> Iterate blocks, filter to KEY_VALUE_SET — each key-value pair has a Confidence score from Textract's internal model</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L19</span> Return list of fields with confidence — passed to LLM agent for structuring + to anomaly detector</div>
          </div>
        </div>
      </section>

      
      <section id="validation">
        <h2>Step 3 — Pydantic Validation</h2>
        <p>After the LLM agent structured the extracted fields into a typed output, I ran Pydantic validation to enforce format correctness: date formats, currency by regional and ISO standards, entity ID formats, and required field presence.</p>

        <div className="callout callout-warn">
          <div className="callout-title">Key Distinction — What Pydantic Cannot Catch</div>
          Pydantic validates type and format. It cannot validate plausibility. A credit limit of $500,000,000,000 is a valid float. A date of 2087-01-01 is a valid date. Catching these requires anomaly detection — which is the next step.
        </div>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — pydantic schema example</div>
          <pre><code className="language-python">{`from pydantic import BaseModel, validator
from datetime import date
from typing import Literal

class CorporateOnboardingFields(BaseModel):
    company_name:       str
    incorporation_date: date
    credit_limit_usd:   float
    currency_code:      str   # ISO 4217
    region:             Literal["IN", "US", "UK", "SG", "AE"]

    @validator("currency_code")
    def validate_currency(cls, v, values):
        regional_map = {"IN": ["INR"], "US": ["USD"], "UK": ["GBP"], "SG": ["SGD"], "AE": ["AED"]}
        region = values.get("region")
        if region and v not in regional_map.get(region, []) + ["USD"]:
            raise ValueError(f"Currency {v} not valid for region {region}")
        return v`}</code></pre>
        </div>
      </section>

      
      <section id="anomaly">
        <h2>Step 4 — Anomaly Detection on Numeric Fields <span className="ml-tag">ML</span></h2>
        <p>After Pydantic validation passed, I ran an Isolation Forest anomaly detector on numeric fields — credit limits, transaction volumes, entity age, number of directors — trained on historical onboarding records from the DTB platform.</p>

        <h3>Why Isolation Forest?</h3>
        <ul>
          <li><strong>Unsupervised:</strong> I didn't have labeled "anomalous onboarding" records — Isolation Forest works without labels by learning what normal looks like.</li>
          <li><strong>Interpretable:</strong> The anomaly score is a continuous value between 0 and 1, which I could threshold and log — important for compliance audit trails.</li>
          <li><strong>Fast at inference:</strong> Tree-based, runs in milliseconds on a small feature vector per document — no latency impact on the pipeline.</li>
        </ul>

        <div className="callout callout-info">
          <div className="callout-title">Isolation Forest — How It Works</div>
          {<span dangerouslySetInnerHTML={{__html: '$$\\text{AnomalyScore}(x) = 2^{-\\frac{E[h(x)]}{c(n)}}$$'}} />}
          <p style={{'fontSize': '0.82rem', 'color': '#8b949e', 'marginTop': '0.5rem'}}>Where $h(x)$ is the path length to isolate point $x$ in a random tree, $c(n)$ is the expected path length for a dataset of size $n$. Anomalies have short path lengths — they are easy to isolate — giving a score close to 1. Normal points have scores close to 0.5.</p>
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sklearn.ensemble import IsolationForest
import numpy as np

# Training on historical onboarding records
iso_forest = IsolationForest(
    n_estimators=200,
    contamination=0.05,  # expect ~5% anomalous
    random_state=42
)
iso_forest.fit(X_train_numeric)

ANOMALY_THRESHOLD = -0.1  # decision_function score

def detect_anomalies(fields: dict) -> dict:
    feature_vec = np.array([[
        fields["credit_limit_usd"],
        fields["annual_turnover_usd"],
        fields["num_directors"],
        fields["years_incorporated"]
    ]])

    score = iso_forest.decision_function(feature_vec)[0]
    is_anomalous = score < ANOMALY_THRESHOLD

    return {
        "anomaly_score": float(score),
        "is_anomalous":  is_anomalous,
        "fields":        fields
    }`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L4-9</span> Train Isolation Forest — contamination=0.05 tells the model ~5% of training data may be anomalous</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L11</span> decision_function returns signed score — negative = anomalous, positive = normal</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L13-20</span> Build feature vector from numeric fields — credit limit, turnover, director count, company age</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L22-27</span> Return anomaly score + boolean flag — score logged to audit trail, anomalous records routed to compliance review</div>
          </div>
        </div>
      </section>

      
      <section id="entity-resolution">
        <h2>Step 5 — Fuzzy Entity Resolution <span className="ml-tag">ML</span></h2>
        <p>Before mapping to KYC ISO JSON and sending to DTB, I ran entity resolution against the existing customer master to detect if the incoming corporate entity was a duplicate, a subsidiary, or a known alias.</p>

        <h3>Why Not Exact Match?</h3>
        <p>In wholesale banking, the same legal entity appears under many name variations — "Tata Steel Ltd", "Tata Steel Limited", "TSL India", "Tata Steel (India) Ltd". Exact-match rules miss all of these. I used TF-IDF cosine similarity on company names and registration IDs as a learned similarity signal.</p>

        <div className="code-annotated">
          <pre><code className="language-python">{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Build TF-IDF matrix over customer master names
master_names = load_customer_master_names()
tfidf = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
master_matrix = tfidf.fit_transform(master_names)

MATCH_THRESHOLD    = 0.85  # high confidence auto-match
REVIEW_THRESHOLD   = 0.60  # ambiguous — route to HITL

def resolve_entity(incoming_name: str) -> dict:
    query_vec = tfidf.transform([incoming_name])
    scores = cosine_similarity(query_vec, master_matrix)[0]
    best_idx   = np.argmax(scores)
    best_score = scores[best_idx]

    if best_score >= MATCH_THRESHOLD:
        return {"status": "matched", "match": master_names[best_idx], "score": best_score}

    elif best_score >= REVIEW_THRESHOLD:
        flag_for_hitl(incoming_name, master_names[best_idx], best_score)
        return {"status": "review", "candidate": master_names[best_idx], "score": best_score}

    else:
        return {"status": "new_entity", "score": best_score}`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L7-8</span> char_wb analyzer + 2-4 char ngrams — captures partial name matches, handles abbreviations and typos</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L10-11</span> Two thresholds — auto-match above 0.85, HITL between 0.60-0.85, new entity below 0.60</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L13-16</span> Embed incoming name, compute cosine similarity against entire customer master in one matrix op</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L18-20</span> High confidence — auto-match, no human needed</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L22-24</span> Ambiguous match — HITL queue: human confirms or rejects the candidate match</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L26</span> No match — treated as genuinely new entity, proceed to fresh onboarding</div>
          </div>
        </div>

        <div className="callout callout-insight">
          <div className="callout-title">Why char_wb ngrams over word-level TF-IDF?</div>
          Word-level TF-IDF fails on abbreviations ("TSL" vs "Tata Steel Limited") and hyphenated names. Character ngrams (2-4 chars) capture sub-word similarity — "Tata" and "Tata Steel" share many character bigrams even though they share only one word token. This is the same principle behind FastText embeddings.
        </div>
      </section>

      
      <section id="hitl">
        <h2>Step 6 — Human-in-the-Loop (HITL) Review Loop <span className="hitl-tag ml-tag">HITL</span></h2>
        <p>HITL was not an afterthought — it was a designed checkpoint at every low-confidence ML decision point in the pipeline. I built a FastAPI review endpoint that surfaced flagged items to a compliance officer with full context: the predicted label, the confidence score, the candidate match, and the raw document extract.</p>

        <ul>
          <li><strong>Document classifier:</strong> Confidence &lt; 0.80 → human assigns correct document type, feedback logged for classifier retraining.</li>
          <li><strong>Anomaly detection:</strong> Anomaly score below threshold → flagged to compliance team with anomalous field values highlighted.</li>
          <li><strong>Entity resolution:</strong> Similarity between 0.60–0.85 → human confirms or rejects candidate match. Decision written back to customer master to improve future matching.</li>
        </ul>

        <div className="callout callout-success">
          <div className="callout-title">HITL as a Training Data Engine</div>
          Every human decision in the HITL loop was logged with full context and used as labeled training data. Over time this meant the classifier got more accurate, the anomaly threshold got better calibrated, and the entity resolution coverage expanded — the system improved with use rather than requiring separate retraining sprints.
        </div>
      </section>

      
      <section id="mapping">
        <h2>Step 7 — KYC ISO Mapping and DTB Submission</h2>
        <p>Once all checks passed, validated fields were mapped to their respective KYC ISO-standard JSON containers using a deterministic field mapping layer and submitted to the DTB application via a secure Azure API Management endpoint. The mapping was rule-based — no ML needed here, as ISO field definitions are fixed standards.</p>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — KYC ISO mapping</div>
          <pre><code className="language-python">{`from datetime import datetime

def map_to_kyc_iso(validated_fields: dict, doc_type: str) -> dict:
    """
    Maps validated fields to KYC ISO 20022 standard JSON container.
    Field mappings are deterministic — defined per document type.
    """
    mapping = KYC_FIELD_MAP[doc_type]  # loaded from config
    kyc_payload = {
        "msgId":       generate_message_id(),
        "creDtTm":     datetime.utcnow().isoformat(),
        "docType":     doc_type,
        "party": {
            "nm":      validated_fields[mapping["company_name"]],
            "regNb":   validated_fields[mapping["registration_number"]],
            "incDt":   validated_fields[mapping["incorporation_date"]],
        },
        "riskProfile": {
            "creditLimit": validated_fields[mapping["credit_limit_usd"]],
            "anomalyScore": validated_fields.get("anomaly_score"),  # logged for audit
        }
    }
    return kyc_payload`}</code></pre>
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
        <div className="metric-card">
          <span className="metric-val">Weeks → Hours</span>
          <span className="metric-label">Onboarding cycle time reduction</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">Zero</span>
          <span className="metric-label">Manual PoA touchpoints for high-confidence docs</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">HITL</span>
          <span className="metric-label">Low-confidence docs reviewed with full context</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">Self-improving</span>
          <span className="metric-label">HITL decisions fed back as training data</span>
        </div>
      </div>

      <ul>
        <li><strong>Speed:</strong> What previously took weeks of manual work across multiple Points of Application was reduced to hours for high-confidence documents — the agent handled classification, extraction, validation, anomaly detection, and KYC mapping end-to-end.</li>
        <li><strong>Compliance safety:</strong> The HITL checkpoints ensured that no low-confidence or anomalous document was auto-approved — every flagged case had a human decision in the audit trail.</li>
        <li><strong>Duplicate prevention:</strong> Fuzzy entity resolution prevented the same corporate entity from being onboarded multiple times under name variations — a real KYC compliance risk in wholesale banking.</li>
        <li><strong>Self-improvement:</strong> Human decisions at every HITL checkpoint were logged as labeled training data, making the classifier and entity resolver more accurate with every cycle.</li>
        <li><strong>Auditability:</strong> Every ML decision — classifier confidence, anomaly score, entity resolution score — was logged to the audit trail alongside the raw document and human override if applicable.</li>
      </ul>
    </div>
  </section>

  
  <section id="concept-table">
    <div className="topic-card">
      <h2>All Concepts at a Glance</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Concept</th><th>What It Is</th><th>When to Use</th><th>Key Detail</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>TF-IDF</strong></td><td>Term frequency weighted by inverse document frequency — sparse text representation</td><td>Text classification on a finite label set</td><td>Bigrams capture phrases like "board resolution"</td></tr>
            <tr><td><strong>Logistic Regression</strong></td><td>Linear classifier with softmax output probabilities</td><td>Multi-class classification with calibrated confidence needed</td><td>Wrap in CalibratedClassifierCV for Platt scaling</td></tr>
            <tr><td><strong>Platt Scaling</strong></td><td>Post-hoc calibration of classifier output probabilities</td><td>When you need calibrated confidence scores for HITL gating</td><td>LLM self-reported confidence is NOT calibrated — this is</td></tr>
            <tr><td><strong>Amazon Textract</strong></td><td>AWS OCR service for key-value extraction from PDFs and forms</td><td>Structured field extraction from scanned documents</td><td>Returns per-block confidence scores — flag low-confidence fields</td></tr>
            <tr><td><strong>Pydantic</strong></td><td>Python schema validation library</td><td>Enforcing type, format, and regional rules on extracted fields</td><td>Catches format errors; does NOT catch plausibility errors</td></tr>
            <tr><td><strong>Isolation Forest</strong></td><td>Unsupervised anomaly detector based on random tree path length</td><td>Detecting statistically implausible numeric values without labeled anomalies</td><td>{<span dangerouslySetInnerHTML={{__html: '$\\text{Score} = 2^{-E[h(x)]/c(n)}$'}} />} — score near 1 = anomalous</td></tr>
            <tr><td><strong>Fuzzy Entity Matching</strong></td><td>TF-IDF cosine similarity on character ngrams for name matching</td><td>Deduplication against customer master when exact match fails</td><td>char_wb analyzer + 2-4 ngrams handles abbreviations and typos</td></tr>
            <tr><td><strong>HITL</strong></td><td>Human-in-the-Loop — human review at low-confidence ML decision points</td><td>Regulated contexts where auto-approval of ambiguous cases creates compliance risk</td><td>Human decisions logged as training data — HITL improves the model over time</td></tr>
            <tr><td><strong>KYC ISO 20022</strong></td><td>International standard for KYC financial messaging JSON containers</td><td>Mapping extracted fields to DTB application submission format</td><td>Deterministic field mapping — no ML needed here, fixed standard</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  
  <section id="code-appendix">
    <div className="topic-card">
      <h2>Code Reference</h2>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — full pipeline orchestrator (FastAPI)</div>
        <pre><code className="language-python">{`from fastapi import FastAPI, UploadFile
app = FastAPI()

@app.post("/onboard")
async def onboard_document(file: UploadFile):
    pdf_bytes = await file.read()

    # Step 1: Classify
    doc_type, confidence = classify_document(pdf_bytes)
    if confidence < CONFIDENCE_THRESHOLD:
        return flag_for_human_review(pdf_bytes, doc_type, confidence)

    # Step 2: OCR + extraction
    raw_fields = extract_fields(pdf_bytes)  # Textract

    # Step 3: LLM agent structures fields
    structured = await call_specialist_agent(doc_type, raw_fields)

    # Step 4: Pydantic validation
    validated = validate_schema(doc_type, structured)

    # Step 5: Anomaly detection
    anomaly_result = detect_anomalies(validated)
    if anomaly_result["is_anomalous"]:
        return flag_for_compliance_review(validated, anomaly_result)

    # Step 6: Entity resolution
    entity_result = resolve_entity(validated["company_name"])
    if entity_result["status"] == "review":
        return flag_for_hitl(validated, entity_result)

    # Step 7: KYC mapping + DTB submission
    kyc_payload = map_to_kyc_iso(validated, doc_type)
    return submit_to_dtb(kyc_payload)`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — isolation forest training</div>
        <pre><code className="language-python">{`from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pandas as pd

# Load historical onboarding records
df = pd.read_parquet("historical_onboardings.parquet")
numeric_cols = ["credit_limit_usd", "annual_turnover_usd", "num_directors", "years_incorporated"]

scaler = StandardScaler()
X = scaler.fit_transform(df[numeric_cols].dropna())

iso = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
iso.fit(X)

# Save for inference
import joblib
joblib.dump({"model": iso, "scaler": scaler, "cols": numeric_cols}, "isolation_forest.pkl")`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — entity resolution with dual threshold</div>
        <pre><code className="language-python">{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

master_names = load_customer_master_names()
tfidf = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
master_matrix = tfidf.fit_transform(master_names)

MATCH_THRESHOLD  = 0.85
REVIEW_THRESHOLD = 0.60

def resolve_entity(incoming_name: str) -> dict:
    query_vec  = tfidf.transform([incoming_name])
    scores     = cosine_similarity(query_vec, master_matrix)[0]
    best_idx   = np.argmax(scores)
    best_score = float(scores[best_idx])

    if best_score >= MATCH_THRESHOLD:
        return {"status": "matched",    "match":     master_names[best_idx], "score": best_score}
    elif best_score >= REVIEW_THRESHOLD:
        return {"status": "review",     "candidate": master_names[best_idx], "score": best_score}
    else:
        return {"status": "new_entity",                                       "score": best_score}`}</code></pre>
      </div>
    </div>
  </section>

  
  <section id="interview-qa">
    <div className="topic-card">
      <h2>Interview Q&A — Likely ZS Probes</h2>

      <h3>Q: Why use a trained classifier instead of prompting the LLM to classify?</h3>
      <p>Three reasons. First, this is a closed, finite label set — a 10-class classifier is not a hard problem and LLM is expensive overkill. Second, and more importantly, an LLM gives you a label — it does not give you a calibrated probability. I needed a confidence score to gate HITL routing. A logistic regression wrapped in CalibratedClassifierCV gives me a true probability. Third, in a regulated banking context, a deterministic, auditable classifier is far easier to justify to compliance than "the LLM said so."</p>

      <h3>Q: What is the difference between Pydantic validation and anomaly detection?</h3>
      <p>Pydantic validates format and type — it tells you if a date is a valid date, if a currency code is a valid ISO 4217 string. It cannot tell you if the values are plausible. A credit limit of $500B passes Pydantic. Isolation Forest detects that it falls 6 standard deviations outside the distribution of historical credit limits and flags it. Rules validate structure; ML validates plausibility.</p>

      <h3>Q: Why Isolation Forest specifically for anomaly detection?</h3>
      <p>I didn't have labeled anomalous records to train a supervised model — Isolation Forest is unsupervised and learns what normal looks like from historical onboarding data. It's also fast at inference (tree-based), interpretable (the anomaly score is a continuous signal I can log to an audit trail), and handles moderate-dimensional feature spaces well without needing hyperparameter tuning for the feature distribution.</p>

      <h3>Q: Why character ngrams for entity resolution instead of word-level TF-IDF?</h3>
      <p>Word-level TF-IDF fails on abbreviations and legal name variations — "TSL" and "Tata Steel Limited" share zero word tokens. Character ngrams (2-4 chars) capture sub-word similarity — the same principle behind FastText. "Tata" and "Tata Steel Ltd" share many character bigrams even though they look very different at word level.</p>

      <h3>Q: How does the HITL loop improve the system over time?</h3>
      <p>Every human decision at a HITL checkpoint is logged with full context — the document, the predicted label or candidate match, the confidence score, and the human's decision. This creates a continuously growing labeled dataset. The classifier is periodically retrained on these new labeled examples, the anomaly threshold is recalibrated, and confirmed entity matches are added to the customer master — expanding entity resolution coverage. The system gets better with use rather than requiring separate retraining sprints.</p>

      <div className="callout callout-insight">
        <div className="callout-title">One-liner to land the answer</div>
        "The core ML contribution was layering intelligence at every uncertainty point in the pipeline — a calibrated classifier for routing, confidence-scored OCR for extraction quality, Isolation Forest for plausibility validation, and fuzzy entity matching for deduplication — with HITL checkpoints that double as a training data engine. The result is a system that's both safe for a regulated banking context and self-improving over time."
      </div>
    </div>
  </section>


        </>
    );
}

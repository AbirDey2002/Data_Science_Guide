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

export default function NLtoSQLPage() {
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
    <div className="hero-eyebrow">ZS ADS Interview Prep — Project 1</div>
    <h1>NL-to-SQL Intelligent Query Engine</h1>
    <p className="hero-sub">Wholesale Banking · Credit Line Operations · GenAI + Retrieval Engineering</p>
    <div className="badge-row">
      <span className="badge badge-blue">spaCy en_core_web_sm</span>
      <span className="badge badge-teal">Weaviate on Kubernetes</span>
      <span className="badge badge-green">Google Cloud Run</span>
      <span className="badge badge-purple">GPT-4 / Azure OAI</span>
      <span className="badge badge-amber">Scale-to-Zero Infra</span>
    </div>
  </div>

  
  <section id="system-flow">
    <div className="topic-card">
      <h3>End-to-End System Flow</h3>
      <p>The user fires a natural language query. The Expert Agent processes it — converting NL to SQL, executing it, fetching results, and explaining them back in plain language.</p>
      <div className="flow">
        <div className="flow-step">User NL Query</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Ops-EA / RM-EA Agent</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">NL-to-SQL Pipeline</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Execute SQL</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Fetch Results</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">Explain to User</div>
      </div>
      <div className="callout callout-info">
        <div className="callout-title">Key Design Insight</div>
        The agent is not just a translator — it closes the loop by explaining results in plain language. This is critical for non-technical RM and Ops users in a regulated lending context.
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

      <p>In our wholesale banking division, I worked on a conversational query system where business users — Operations teams and Relationship Managers — would fire natural language queries like <em>"Show me the top 5 credit lines for Tata Steel in Q3 2023"</em>. The query was picked up by an Expert Agent (Ops-EA or RM-EA) that I helped build: it converted the NL input to SQL, executed it against our lending database, fetched the results, and explained them back to the user in plain language.</p>

      <h3>Core Pain Points</h3>
      <ul>
        <li><strong>Output variance:</strong> The same NL query across different runs generated structurally different SQL — eroding trust with business users in a regulated lending environment.</li>
        <li><strong>Scaling token costs:</strong> As the DB schema grew in complexity (more tables, joins, business rules), prompt sizes ballooned, driving inference costs up exponentially.</li>
        <li><strong>Latency:</strong> Cold LLM generation for every query introduced unacceptable response times for real-time agent workflows.</li>
        <li><strong>Infrastructure immaturity:</strong> The team was at PoC stage with no dedicated GPU infrastructure, ruling out self-hosted fine-tuned model inference.</li>
      </ul>
    </div>
  </section>

  
  <section id="task">
    <div className="topic-card">
      <div className="star-header">
        <div className="star-letter star-t">T</div>
        <div>
          <div className="star-title">Task</div>
          <div className="star-subtitle">What I was responsible for solving</div>
        </div>
      </div>

      <p>My task was to redesign the NL-to-SQL pipeline to eliminate output variance for recurring query patterns, reduce token consumption and latency, and build a self-improving system — all on zero-idle-cost serverless infrastructure.</p>

      <h3>Why Not Fine-Tune a Model?</h3>
      <ul>
        <li><strong>Data scarcity:</strong> Labeled NL-SQL pairs were scarce and noisy — the data quality overhead would have been too high.</li>
        <li><strong>Schema drift:</strong> Our lending DB schema was actively evolving. A fine-tuned model would be brittle to schema changes and require expensive retraining cycles.</li>
        <li><strong>No GPU budget:</strong> At PoC stage we had no GPU infrastructure. A retrieval-based system on GCR + Weaviate could scale to zero under no traffic — near-zero idle cost.</li>
      </ul>

      <div className="callout callout-insight">
        <div className="callout-title">ML Translation Point</div>
        Framing the problem as retrieval-first rather than generation-first is the key architectural decision. The LLM becomes a fallback generator, not the primary inference engine. This is what ZS ADS rounds evaluate — business-aware model selection, not just technical execution.
      </div>
    </div>
  </section>

  
  <section id="action">
    <div className="topic-card">
      <div className="star-header">
        <div className="star-letter star-a">A</div>
        <div>
          <div className="star-title">Action</div>
          <div className="star-subtitle">Technical steps I took — in detail</div>
        </div>
      </div>

      
      <section id="eda">
        <h2>Step 1 — EDA on the NL Query Corpus</h2>
        <p>I want to be precise here: EDA alone tells you what is <em>common</em>, not what is <em>discriminative</em>. I did this in two stages.</p>

        <h3>Stage A — EDA as Candidate Generation</h3>
        <p>I ran frequency distributions of POS tags and named entity types across the query corpus, co-occurrence patterns, and query length histograms. This gave me a candidate list of which token types appeared most often — but not which ones actually drove SQL variance.</p>

        <div className="callout callout-warn">
          <div className="callout-title">Common Interview Mistake</div>
          Saying "EDA revealed the strongest features" is technically incorrect. EDA reveals distribution, not importance. Discriminative power requires a separate test — mutual information, chi-square, or sensitivity analysis.
        </div>
      </section>

      
      <section id="mi-scoring">
        <h2>Step 2 — Mutual Information Scoring</h2>
        <p>To move from observation to feature importance, I used Mutual Information scoring between entity types and SQL structural patterns.</p>

        <p>I labelled queries by their SQL structure — for example, queries that produced a <code>LIMIT</code> clause vs. those that did not — and measured which POS/entity types had the highest MI with those structural labels.</p>

        <div className="callout callout-info">
          <div className="callout-title">MI Formula</div>
          {<span dangerouslySetInnerHTML={{__html: '$$MI(X;Y) = \\sum_{x \\in X} \\sum_{y \\in Y} P(x,y) \\log \\frac{P(x,y)}{P(x)P(y)}$$'}} />}
          <p style={{'marginTop': '0.6rem', 'fontSize': '0.82rem', 'color': '#8b949e'}}>Where $X$ = entity type presence (e.g., TIME entity: yes/no), $Y$ = SQL structural label (e.g., has date-range clause: yes/no)</p>
        </div>

        <p>I also ran a sensitivity analysis: mask each entity type, re-run the generator, and measure how much the SQL output changed. High output change = high feature importance.</p>

        <h3>Final Feature Set (by MI rank)</h3>
        <ul>
          <li><strong>TIME entities</strong> — e.g., "Q3 2023", "last 6 months", "FY2022" → highest MI with date-range clauses in SQL</li>
          <li><strong>NOUN chunks / proper nouns</strong> — e.g., company names like "Tata Steel", "HDFC Ltd" → highest MI with <code>WHERE</code> clause predicates</li>
          <li><strong>Ordinal numbers / cardinals</strong> — e.g., "top 5", "bottom 10" → highest MI with <code>ORDER BY</code> + <code>LIMIT</code> clauses</li>
        </ul>

        <div className="callout callout-success">
          <div className="callout-title">Formal Fallback</div>
          If challenged in an audit or peer review, a chi-square test against SQL structure labels would be the formal validation step. The MI signal was strong and consistent enough that it was sufficient for this use case, but chi-square gives you a p-value to cite.
        </div>
      </section>

      
      <section id="pos-tagging">
        <h2>Step 3 — POS Tagging with spaCy</h2>
        <p>I used spaCy's <code>en_core_web_sm</code> model to run a full POS-tagging and NER pipeline across all queries.</p>

        <div className="code-annotated">
          <pre><code className="language-python">{`import spacy

nlp = spacy.load("en_core_web_sm")

query = "Show me top 5 loans for Tata Steel in Q3 2023"
doc = nlp(query)

for token in doc:
    print(token.text, token.pos_, token.ent_type_)

# Named entities only
for ent in doc.ents:
    print(ent.text, ent.label_)`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L1</span> Import spaCy NLP library</div>
            <div className="annotation-line"><span>L3</span> Load small English model — CPU-only, no GPU needed, fast inference</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L5</span> Example NL query from a RM user</div>
            <div className="annotation-line"><span>L6</span> Tokenize + tag POS + detect named entities in one pass</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L8-9</span> Print each token with its POS tag and entity type — used to build POS distribution for EDA</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L11-12</span> Extract named entities — TIME, ORG (company names), CARDINAL — these are the slot candidates</div>
          </div>
        </div>

        <h3>Expected Output for the Example Query</h3>
        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>output</div>
          <pre><code className="language-python">{`# token.text    token.pos_   token.ent_type_
# Show          VERB
# me            PRON
# top           ADJ
# 5             NUM          CARDINAL       ← ordinal/cardinal slot
# loans         NOUN
# for           ADP
# Tata          PROPN        ORG            ← company name slot
# Steel         PROPN        ORG
# in            ADP
# Q3            NOUN         DATE           ← time entity slot
# 2023          NUM          DATE`}</code></pre>
        </div>
      </section>

      
      <section id="templatization">
        <h2>Step 4 — SQL Templatization & Weaviate Indexing</h2>
        <p>I mirrored the NLP analysis on the SQL side. Using regex and SQL parsing, I extracted the SQL phrases corresponding to each NL slot type, replaced them with ordered placeholders, and stored the templates in Weaviate.</p>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>sql — before and after templatization</div>
          <pre><code className="language-sql">{`-- ORIGINAL SQL (LLM-generated from first run)
SELECT client, credit_limit, outstanding
FROM credit_lines
WHERE client = 'Tata Steel'
  AND quarter = 'Q3-2023'
ORDER BY credit_limit DESC
LIMIT 5;

-- TEMPLATIZED SQL stored in Weaviate
SELECT client, credit_limit, outstanding
FROM credit_lines
WHERE client = '{NOUN_1}'        -- slot 1: company name
  AND quarter = '{TIME_1}'       -- slot 2: time period
ORDER BY credit_limit DESC
LIMIT {ORD_1};                   -- slot 3: top-k value`}</code></pre>
        </div>

        <h3>Weaviate Document Schema</h3>
        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — indexing templates into Weaviate</div>
          <pre><code className="language-python">{`import weaviate

client = weaviate.Client("http://weaviate-service:8080")

# Each template document stored with:
template_doc = {
    "nl_query":       "Show me top 5 loans for [ORG] in [DATE]",  # canonical form
    "sql_template":   "SELECT ... WHERE client='{NOUN_1}' AND quarter='{TIME_1}' LIMIT {ORD_1}",
    "slot_count":     3,
    "slot_types":     ["NOUN", "TIME", "ORD"],   # positional order matters
    "slot_order":     [1, 2, 3],                  # sequential fill index
}

# The NL query embedding becomes the retrieval key
# Weaviate auto-vectorizes using the configured embedding model
client.data_object.create(template_doc, class_name="QueryTemplate")`}</code></pre>
        </div>

        <div className="callout callout-info">
          <div className="callout-title">Why slot order matters</div>
          At inference time, spaCy extracts slots from the NL query in left-to-right order. The template must store slots in the same positional order so sequential fill-in produces correct SQL. Misalignment here is a silent bug — the SQL executes but returns wrong results.
        </div>
      </section>

      
      <section id="retrieval">
        <h2>Step 5 — Retrieval + Sequential Slot Filling</h2>
        <p>At inference time, I designed the pipeline to work as follows:</p>

        <div className="flow">
          <div className="flow-step">Embed NL Query</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Weaviate Cosine Search</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Confidence Check</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">spaCy Slot Extraction</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Sequential Fill</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Execute SQL</div>
        </div>

        <div className="code-annotated">
          <pre><code className="language-python">{`def run_nl_to_sql(nl_query: str) -> str:
    # 1. Embed the incoming query
    embedding = embed(nl_query)

    # 2. Retrieve best matching template
    result = weaviate_client.query\
        .get("QueryTemplate", ["sql_template","slot_types"])\
        .with_near_vector({"vector": embedding})\
        .with_additional(["distance"])\
        .with_limit(1).do()

    template = result["data"]["Get"]["QueryTemplate"][0]
    distance = template["_additional"]["distance"]

    # 3. Confidence gate — route to LLM if low similarity
    if distance > SIMILARITY_THRESHOLD:
        return llm_generate_and_store(nl_query)

    # 4. Extract slots from NL query using spaCy
    slots = extract_slots(nl_query, slot_types=template["slot_types"])

    # 5. Sequential slot fill
    sql = fill_sequential(template["sql_template"], slots)

    return sql`}</code></pre>
          <div className="annotations">
            <div className="annotation-line"><span>L3</span> Embed using same model as indexing time — consistency is critical</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L5-10</span> Weaviate cosine search — returns top-1 template + distance score</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L12</span> Extract cosine distance from Weaviate metadata</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L15-16</span> If similarity is too low, no template match — fall back to LLM generation and store new pair in Weaviate</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L19</span> spaCy extracts slots in same positional order as template slot_types list</div>
            <div className="annotation-line">&nbsp;</div>
            <div className="annotation-line"><span>L22</span> Fill placeholders sequentially — {"{"}NOUN_1{"}"}, {"{"}TIME_1{"}"}, {"{"}ORD_1{"}"} in order</div>
          </div>
        </div>
      </section>

      
      <section id="fallback">
        <h2>Step 6 — Fallback & Error Handling</h2>
        <p>Wrong SQL is caught at two levels before surfacing to the user:</p>

        <ul>
          <li><strong>Tier 1 — Syntactic:</strong> SQL execution throws an error. The error message is appended as context and LLM regeneration is triggered — constrained, cheaper than cold start.</li>
          <li><strong>Tier 2 — Semantic:</strong> Query runs but returns empty results, nulls, or implausibly large counts. Flagged for RM review before surfacing — critical in regulated lending.</li>
          <li><strong>Logging:</strong> All failures logged with NL query, retrieved template, error type, and corrected SQL — forming a labeled failure dataset for future reranker improvement.</li>
        </ul>

        <div className="code-entry">
          <div className="code-label"><span className="lang-dot"></span>python — two-tier fallback</div>
          <pre><code className="language-python">{`def execute_with_fallback(sql: str, nl_query: str, template: dict):
    try:
        result = db.execute(sql)

        # Tier 2: semantic sanity check
        if result is None or len(result) == 0:
            flag_for_review(nl_query, sql, reason="empty_result")
            return None

        if result["amount"].max() > IMPLAUSIBLE_THRESHOLD:
            flag_for_review(nl_query, sql, reason="anomalous_value")
            return None

        return result

    except SQLExecutionError as e:
        # Tier 1: syntax/execution error — constrained LLM regeneration
        corrected_sql = llm_regenerate(
            nl_query=nl_query,
            failed_sql=sql,
            error_message=str(e)       # error appended as context
        )
        log_failure(nl_query, template, sql, str(e), corrected_sql)
        return db.execute(corrected_sql)`}</code></pre>
        </div>
      </section>

      
      <section id="infra">
        <h2>Step 7 — Infrastructure: Scale-to-Zero</h2>
        <p>I designed the entire stack to have zero idle cost — critical for a PoC-stage team with no infrastructure budget.</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Technology</th>
                <th>Scale-to-Zero Mechanism</th>
                <th>Why This Choice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backend API</td>
                <td>Google Cloud Run</td>
                <td>Native — billed per request, zero idle cost</td>
                <td>No server management, instant PoC deployment</td>
              </tr>
              <tr>
                <td>Vector DB</td>
                <td>Weaviate on Kubernetes</td>
                <td>KEDA — pod count scales to 0 on no traffic</td>
                <td>Open source, self-hosted, schema-flexible</td>
              </tr>
              <tr>
                <td>Embedding Model</td>
                <td>FastAPI on GCR</td>
                <td>Same GCR scale-to-zero pattern</td>
                <td>Decoupled from main API, independently scalable</td>
              </tr>
              <tr>
                <td>LLM (fallback)</td>
                <td>Azure OpenAI GPT-4</td>
                <td>Pay-per-token, no idle cost</td>
                <td>Only invoked on cache miss — minimized token spend</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout callout-info">
          <div className="callout-title">Other Scale-to-Zero VDB Options</div>
          <strong>Pinecone Serverless</strong> — fully managed, pay per query. <strong>Qdrant Cloud</strong> — serverless tier available. <strong>Upstash Vector</strong> — explicitly designed for scale-to-zero, great for low-traffic PoC stages. <strong>Supabase pgvector</strong> — Postgres-based, serverless friendly.
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
          <span className="metric-val">~65%</span>
          <span className="metric-label">Token cost reduction for repeat patterns</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">~85%</span>
          <span className="metric-label">Query corpus covered by templates</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">Zero</span>
          <span className="metric-label">Output variance for template-matched queries</span>
        </div>
        <div className="metric-card">
          <span className="metric-val">Zero</span>
          <span className="metric-label">Idle infrastructure cost at PoC stage</span>
        </div>
      </div>

      <ul>
        <li><strong>Business trust:</strong> Deterministic outputs for known patterns built confidence with RM and Ops users — particularly important in regulated wholesale lending.</li>
        <li><strong>Schema resilience:</strong> When the schema changed, I only needed to update affected templates in Weaviate — no model retraining, no downtime.</li>
        <li><strong>Self-improvement:</strong> The VDB coverage expanded organically with every new query-SQL pair added, steadily reducing LLM fallback frequency over time.</li>
        <li><strong>Infrastructure:</strong> GCR + Weaviate on K8s with KEDA meant zero overhead during off-hours — making the business case easy to justify at PoC stage.</li>
      </ul>
    </div>
  </section>

  
  <section id="concept-table">
    <div className="topic-card">
      <h2>All Concepts at a Glance</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Concept</th>
              <th>What It Is</th>
              <th>When to Use</th>
              <th>Key Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>POS Tagging</strong></td>
              <td>Assigns grammatical role to each token (NOUN, VERB, NUM...)</td>
              <td>NLP feature extraction on text corpora</td>
              <td>spaCy en_core_web_sm — CPU-only, fast</td>
            </tr>
            <tr>
              <td><strong>Named Entity Recognition</strong></td>
              <td>Detects real-world entities: ORG, DATE, CARDINAL</td>
              <td>Extracting slot values from NL queries</td>
              <td>Built into spaCy pipeline alongside POS</td>
            </tr>
            <tr>
              <td><strong>EDA on Text Corpus</strong></td>
              <td>Frequency distributions, co-occurrence, length histograms</td>
              <td>Candidate generation — tells you what is common</td>
              <td>Does NOT tell you what is discriminative</td>
            </tr>
            <tr>
              <td><strong>Mutual Information</strong></td>
              <td>Measures statistical dependence between feature and label</td>
              <td>Feature selection — tells you what is discriminative</td>
              <td>{<span dangerouslySetInnerHTML={{__html: '$MI(X;Y) = \\sum P(x,y) \\log \\frac{P(x,y)}{P(x)P(y)}$'}} />}</td>
            </tr>
            <tr>
              <td><strong>Sensitivity Analysis</strong></td>
              <td>Mask each feature, measure output change</td>
              <td>Validating feature importance empirically</td>
              <td>High output change = high feature importance</td>
            </tr>
            <tr>
              <td><strong>Chi-Square Test</strong></td>
              <td>Tests statistical association between categorical vars</td>
              <td>Formal validation of feature-label association</td>
              <td>Use when you need a p-value for audit/peer review</td>
            </tr>
            <tr>
              <td><strong>SQL Templatization</strong></td>
              <td>Replace slot values with ordered placeholders</td>
              <td>Reducing variance by separating structure from values</td>
              <td>Slot order must match NL entity extraction order</td>
            </tr>
            <tr>
              <td><strong>Vector DB (Weaviate)</strong></td>
              <td>Stores embeddings + metadata for semantic retrieval</td>
              <td>Retrieving most similar NL query template</td>
              <td>Cosine similarity with confidence threshold gating</td>
            </tr>
            <tr>
              <td><strong>Semantic Retrieval</strong></td>
              <td>Embed query, find nearest neighbour in vector space</td>
              <td>Matching new NL queries to known templates</td>
              <td>Replace generation with retrieval for known patterns</td>
            </tr>
            <tr>
              <td><strong>Sequential Slot Filling</strong></td>
              <td>Fill template placeholders in positional order</td>
              <td>Constructing SQL from retrieved template + NL entities</td>
              <td>Positional alignment between NL and SQL is critical</td>
            </tr>
            <tr>
              <td><strong>KEDA</strong></td>
              <td>Kubernetes Event-Driven Autoscaling</td>
              <td>Scaling Weaviate pods to zero on no traffic</td>
              <td>Zero idle cost for low-traffic PoC deployments</td>
            </tr>
            <tr>
              <td><strong>Google Cloud Run</strong></td>
              <td>Serverless container platform</td>
              <td>Backend API with zero idle cost</td>
              <td>Billed per request, scales to zero natively</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  
  <section id="code-appendix">
    <div className="topic-card">
      <h2>Code Reference</h2>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — spaCy POS + NER pipeline</div>
        <pre><code className="language-python">{`import spacy

nlp = spacy.load("en_core_web_sm")

def extract_slots(nl_query: str, slot_types: list) -> list:
    """
    Extract slot values from NL query in positional order.
    slot_types: ["NOUN", "TIME", "ORD"] — must match template order.
    """
    doc = nlp(nl_query)
    slots = []

    type_map = {
        "TIME": ["DATE", "TIME"],       # spaCy entity labels for time
        "NOUN": ["ORG", "PERSON", "GPE"],  # entity labels for proper nouns
        "ORD":  ["CARDINAL", "ORDINAL"]    # entity labels for numbers
    }

    for slot_type in slot_types:
        for ent in doc.ents:
            if ent.label_ in type_map[slot_type]:
                slots.append(ent.text)
                break  # take first match per slot type

    return slots  # ["Tata Steel", "Q3-2023", "5"]`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — sequential slot fill</div>
        <pre><code className="language-python">{`def fill_sequential(sql_template: str, slots: list) -> str:
    """
    Fill SQL template placeholders in sequential order.
    Template: "WHERE client='{NOUN_1}' AND quarter='{TIME_1}' LIMIT {ORD_1}"
    Slots:    ["Tata Steel", "Q3-2023", "5"]
    """
    import re
    placeholders = re.findall(r'\{[A-Z_0-9]+\}', sql_template)

    if len(placeholders) != len(slots):
        raise SlotMismatchError(f"Expected {len(placeholders)} slots, got {len(slots)}")

    result = sql_template
    for placeholder, value in zip(placeholders, slots):
        result = result.replace(placeholder, f"'{value}'" if not value.isdigit() else value, 1)

    return result`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — full inference pipeline</div>
        <pre><code className="language-python">{`SIMILARITY_THRESHOLD = 0.25  # Weaviate distance (lower = more similar)

def run_nl_to_sql(nl_query: str) -> str:
    embedding = embed(nl_query)

    result = weaviate_client.query \
        .get("QueryTemplate", ["sql_template", "slot_types"]) \
        .with_near_vector({"vector": embedding}) \
        .with_additional(["distance"]) \
        .with_limit(1).do()

    template = result["data"]["Get"]["QueryTemplate"][0]
    distance = template["_additional"]["distance"]

    # Route to LLM if no confident template match
    if distance > SIMILARITY_THRESHOLD:
        return llm_generate_and_store(nl_query)

    slots = extract_slots(nl_query, slot_types=template["slot_types"])
    sql   = fill_sequential(template["sql_template"], slots)
    return sql`}</code></pre>
      </div>

      <div className="code-entry">
        <div className="code-label"><span className="lang-dot"></span>python — two-tier fallback</div>
        <pre><code className="language-python">{`def execute_with_fallback(sql: str, nl_query: str, template: dict):
    try:
        result = db.execute(sql)

        # Semantic sanity checks
        if result is None or len(result) == 0:
            flag_for_review(nl_query, sql, reason="empty_result")
            return None

        return result

    except SQLExecutionError as e:
        # Constrained LLM regeneration with error context
        corrected_sql = llm_regenerate(
            nl_query=nl_query,
            failed_sql=sql,
            error_message=str(e)
        )
        log_failure(nl_query, template, sql, str(e), corrected_sql)
        return db.execute(corrected_sql)`}</code></pre>
      </div>
    </div>
  </section>

  
  <section id="interview-qa">
    <div className="topic-card">
      <h2>Interview Q&A — Likely ZS Probes</h2>

      <h3>Q: Why retrieval over fine-tuning?</h3>
      <p>Three reasons: data was scarce and noisy; schema was actively evolving making fine-tuned models brittle; no GPU budget at PoC stage. A retrieval system on GCR + Weaviate scales to zero — zero idle cost.</p>

      <h3>Q: What if the generated SQL is wrong?</h3>
      <p>Two-tier fallback: syntax errors trigger constrained LLM regeneration with the error appended as context. Semantic anomalies (empty results, implausible values) are flagged for RM review. All failures are logged to build a labeled dataset for future reranker improvement.</p>

      <h3>Q: Did EDA tell you which features were most important?</h3>
      <p>No — EDA tells you what is common, not what is discriminative. I used Mutual Information scoring between entity types and SQL structural labels to identify feature importance. I also ran a sensitivity analysis — masking each entity type and measuring SQL output change. Chi-square against SQL structure labels would be the formal validation step if a p-value were needed.</p>

      <h3>Q: How does the system handle schema changes?</h3>
      <p>Only the affected SQL templates in Weaviate need updating — no model retraining, no downtime. The NL-side pipeline (spaCy) is schema-agnostic. This is one of the core advantages of the retrieval approach over fine-tuning.</p>

      <h3>Q: How does the self-improvement loop work?</h3>
      <p>Novel queries that fall below the similarity threshold are routed to the LLM. If the LLM generates a valid SQL, I templatize it and write it back into Weaviate. This means retrieval coverage grows organically with every new query, reducing LLM fallback frequency over time.</p>

      <div className="callout callout-insight">
        <div className="callout-title">One-liner to land the answer</div>
        "The core intellectual contribution was not the LLM — it was the classical NLP + information retrieval pipeline underneath: POS-based feature extraction, mutual information scoring, template induction, and semantic retrieval. The LLM was relegated to a fallback generator. That shift from generation-first to retrieval-first is the architectural decision with direct cost, reliability, and auditability implications."
      </div>
    </div>
  </section>


        </>
    );
}

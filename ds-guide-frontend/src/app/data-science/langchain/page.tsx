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
  } else {
    setTimeout(renderMath, 100);
  }
}

export default function LangchainPage() {
  useEffect(() => {
    // @ts-ignore
    if (window.hljs) window.hljs.highlightAll();
    renderMath();
  }, []);

  return (
    <div className="langchain-container">
      {/* Main layout content */}


      <div className="hero">
        <h1>RAG Mastery — Complete Study Guide</h1>
        <p className="subtitle">End-to-end reference: splitting → embeddings → vector stores → FAISS indexes → retrieval strategies → HyDE → rerankers → ReAct agents → RAGAS evaluation. All code uses LangChain 0.3+ compatible imports.</p>
        <div className="badge-row">
          <span className="badge">LangChain 0.3+</span>
          <span className="badge">FAISS</span>
          <span className="badge">Chroma · Pinecone · Qdrant · Weaviate</span>
          <span className="badge">HyDE · MultiQuery · Hybrid</span>
          <span className="badge">FlashRank · Cohere · Cross-Encoder</span>
          <span className="badge">ReAct Agents · LangGraph</span>
          <span className="badge">RAGAS</span>
        </div>
      </div>

      {/*  ── INSTALL ──  */}
      <div className="install-banner" id="install">
        <h3>Install Reference — Add Only What You Need</h3>
        <pre><code className="language-bash">{`# ── Core (always install) ──────────────────────────────────────────────────
pip install langchain langchain-core langchain-community langchain-text-splitters

# ── LLM + Embeddings ──────────────────────────────────────────────────────
pip install langchain-google-genai          # Gemini LLM + embeddings
pip install langchain-openai                # OpenAI (optional)

# ── Vector Stores (pick one or more) ─────────────────────────────────────
pip install faiss-cpu                       # FAISS — local, in-memory
pip install chromadb                        # Chroma — local + persistent
pip install pinecone-client langchain-pinecone   # Pinecone — cloud managed
pip install qdrant-client                   # Qdrant — local or cloud
pip install weaviate-client                 # Weaviate — hybrid-native

# ── Rerankers (pick one) ──────────────────────────────────────────────────
pip install flashrank                       # FlashRank — free, local
pip install sentence-transformers           # Cross-encoder — free, local
pip install langchain-cohere cohere         # Cohere — API, best quality

# ── Retrieval improvements ────────────────────────────────────────────────
pip install rank-bm25                       # BM25 keyword retrieval
pip install langchain-experimental          # SemanticChunker, HyDE

# ── Document loaders ──────────────────────────────────────────────────────
pip install pypdf unstructured

# ── Agents ────────────────────────────────────────────────────────────────
pip install langgraph                       # LangGraph ReAct (recommended)
pip install langchain-community             # Classic AgentExecutor (legacy)

# ── Evaluation ────────────────────────────────────────────────────────────
pip install ragas datasets

# ── Note on langchain-classic ─────────────────────────────────────────────
# Only needed for legacy notebooks using old import paths:
pip install langchain-classic`}</code></pre>
      </div>

      {/*  ── FOUNDATION ──  */}
      <div className="section-divider"><h2>Foundation</h2></div>

      <section className="topic-card" id="rag-pipeline">
        <h2>RAG Pipeline Overview</h2>
        <p className="topic-intro">An architectural framework that explicitly retrieves relevant factual data from a proprietary knowledge base and injects it into an LLM's prompt. It replaces purely relying on static training weights for knowledge retrieval. It completely solves hallucination on proprietary data and enables dynamic, domain-specific answering without requiring expensive or static model fine-tuning. RAG is deployed whenever applications must answer questions reliably over private, rapidly updating, or strictly factual documents.</p>
        <ol>
          <li><strong>Load</strong> — ingest raw documents (PDF, HTML, CSV, web…)</li>
          <li><strong>Split</strong> — chunk into overlapping pieces with a text splitter</li>
          <li><strong>Embed</strong> — convert each chunk to a dense vector</li>
          <li><strong>Store</strong> — persist vectors in a vector store (FAISS, Chroma, Pinecone…)</li>
          <li><strong>Retrieve</strong> — at query time, find top-k similar chunks (keyword / semantic / hybrid)</li>
          <li><strong>Improve</strong> — optionally apply HyDE, MultiQuery, ParentDocument, etc.</li>
          <li><strong>Rerank</strong> — optional second-pass cross-encoder scoring</li>
          <li><strong>Generate</strong> — inject top chunks into LLM prompt and produce answer</li>
          <li><strong>Evaluate</strong> — score with RAGAS metrics</li>
        </ol>
        <div className="gotcha"><strong>Gotcha:</strong> Answer quality is bounded by retrieval quality. A bad retriever produces bad answers regardless of LLM capability.</div>
      </section>

      {/*  ── SPLITTING ──  */}
      <div className="section-divider"><h2>Text Splitting</h2></div>

      <section className="topic-card" id="splitters">
        <h2>All LangChain Text Splitters</h2>
        <p className="topic-intro">Algorithmic segmentation of massive documents into standardized, ingestible vectors. It replaces attempting to pass infinitely long documents directly into restricted LLM context windows. It solves context overflow and ensures that semantic embedding models only encode tightly focused topics at one time. Splitting is executed via RecursiveCharacterTextSplitter with deliberate overlap directly after initial document loading but before embedding.</p>
        <table className="cmp-table">
          <thead><tr><th>Splitter</th><th>Strategy</th><th>Best For</th><th>Key Params</th></tr></thead>
          <tbody>
            <tr><td><strong>RecursiveCharacterTextSplitter</strong></td><td>Tries \n\n → \n → space → char</td><td>General purpose — the default choice</td><td>chunk_size, chunk_overlap</td></tr>
            <tr><td><strong>CharacterTextSplitter</strong></td><td>Single separator character</td><td>Simple structured text with clear delimiters</td><td>separator, chunk_size</td></tr>
            <tr><td><strong>TokenTextSplitter</strong></td><td>Split by token count (tiktoken)</td><td>When you must respect exact LLM token limits</td><td>chunk_size (tokens)</td></tr>
            <tr><td><strong>MarkdownHeaderTextSplitter</strong></td><td>Splits at Markdown H1/H2/H3</td><td>Markdown docs, wikis, README files</td><td>headers_to_split_on</td></tr>
            <tr><td><strong>HTMLHeaderTextSplitter</strong></td><td>Splits at HTML header tags</td><td>Web pages, HTML documents</td><td>headers_to_split_on</td></tr>
            <tr><td><strong>Language (RecursiveCharacter)</strong></td><td>Language-aware separators (functions, classes)</td><td>Source code — Python, JS, Go, Java, C++…</td><td>language=Language.PYTHON</td></tr>
            <tr><td><strong>SemanticChunker</strong></td><td>Embeds sentences, splits at semantic breakpoints</td><td>When chunks must be topically coherent</td><td>embeddings, breakpoint_threshold_type</td></tr>
            <tr><td><strong>SentenceTransformersTokenTextSplitter</strong></td><td>Token count via SentenceTransformer tokenizer</td><td>When embeddings come from SentenceTransformers</td><td>chunk_overlap, tokens_per_chunk</td></tr>
            <tr><td><strong>SpacyTextSplitter</strong></td><td>Sentence boundary via spaCy NLP</td><td>Natural language text, multi-language</td><td>chunk_size, pipeline</td></tr>
            <tr><td><strong>NLTKTextSplitter</strong></td><td>Sentence tokenization via NLTK</td><td>English prose, lightweight alternative to spaCy</td><td>chunk_size</td></tr>
          </tbody>
        </table>
        <pre><code className="language-python">{`from langchain_text_splitters import (
    RecursiveCharacterTextSplitter, CharacterTextSplitter,
    MarkdownHeaderTextSplitter, TokenTextSplitter, Language,
)
from langchain_experimental.text_splitter import SemanticChunker

# Default — best starting point
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# Token-based (respects LLM context windows exactly)
token_splitter = TokenTextSplitter(chunk_size=256, chunk_overlap=20)

# Markdown-aware
md_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "H1"), ("##", "H2"), ("###", "H3")]
)

# Code-aware (Python)
code_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON, chunk_size=300, chunk_overlap=30
)

# Semantic (embedding-based — most intelligent, slowest)
semantic_splitter = SemanticChunker(
    embeddings,
    breakpoint_threshold_type="percentile"  # or "standard_deviation", "interquartile"
)`}</code></pre>
        <div className="tip"><strong>Tip:</strong> Start with RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50). Only switch once you see retrieval quality suffering from bad chunk boundaries.</div>
      </section>

      {/*  ── EMBEDDINGS & STORES ──  */}
      <div className="section-divider"><h2>Embeddings &amp; Vector Stores</h2></div>

      <section className="topic-card" id="embeddings">
        <h2>Google Generative AI Embeddings</h2>
        <p className="topic-intro">The mathematical translation layer converting human text into dense semantic numeric vectors that encode abstract meaning. It replaces primitive exact-keyword matching systems. It allows vector stores to retrieve documents based entirely on conceptual similarity rather than exact spelling. Embedding is applied to every single chunk prior to storage in FAISS or Pinecone, translating raw ideas into calculable geometry.</p>
        <pre><code className="language-python">{`import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

os.environ["GOOGLE_API_KEY"] = "your-key-here"

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# Always probe dimension before building FAISS index
embedding_dim = len(embeddings.embed_query("test"))
print(f"Embedding dimension: {embedding_dim}")  # typically 3072`}</code></pre>
        <div className="gotcha"><strong>Gotcha:</strong> Always probe the dimension with a dummy query first — mismatched dimensions cause cryptic FAISS runtime errors.</div>
      </section>

      <section className="topic-card" id="vector-stores">
        <h2>Vector Stores — Full Comparison</h2>
        <p className="topic-intro">Specialized databases engineered exclusively to index and retrieve high-dimensional geometric arrays natively at lightning speed. They replace standard SQL databases that fundamentally cannot calculate cosine similarities. Vector stores solve the bottleneck of rapidly scanning millions of documents to find conceptually related text. They form the foundational retrieval infrastructure, queried immediately upon receiving user input before injecting results into an LLM prompt.</p>

        <h3>FAISS (Facebook AI Similarity Search)</h3>
        <div className="pro-con-grid">
          <div className="pro-box"><h4>Pros</h4><ul><li>Fully local — no server or API needed</li><li>Extremely fast in-memory search</li><li>Multiple index types (HNSW, IVF, Flat, LSH)</li><li>Free forever</li><li>Simple save/load to disk</li></ul></div>
          <div className="con-box"><h4>Cons</h4><ul><li>No built-in metadata filtering</li><li>Doesn't scale beyond RAM</li><li>No built-in persistence (manual save/load)</li><li>Single-node only</li></ul></div>
        </div>
        <pre><code className="language-python">{`import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore

index = faiss.IndexHNSWFlat(embedding_dim, 32)
vs = FAISS(embedding_function=embeddings, index=index,
           docstore=InMemoryDocstore(), index_to_docstore_id={})
vs.add_documents(chunks)
vs.save_local("faiss_index")
vs2 = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)`}</code></pre>

        <h3>Chroma</h3>
        <div className="pro-con-grid">
          <div className="pro-box"><h4>Pros</h4><ul><li>Persistent storage out of the box</li><li>Metadata filtering natively supported</li><li>Easiest setup for local prototyping</li><li>Free and open-source</li><li>Has a managed cloud option</li></ul></div>
          <div className="con-box"><h4>Cons</h4><ul><li>Slower than FAISS for pure ANN search</li><li>Limited horizontal scalability</li><li>Not ideal for production at 10M+ vectors</li></ul></div>
        </div>
        <pre><code className="language-python">{`from langchain_community.vectorstores import Chroma

vs = Chroma.from_documents(
    documents=chunks, embedding=embeddings,
    persist_directory="./chroma_db"  # auto-persists
)
# Metadata filtering
results = vs.similarity_search("query", k=5, filter={"source": "doc1.pdf"})`}</code></pre>

        <h3>Pinecone</h3>
        <div className="pro-con-grid">
          <div className="pro-box"><h4>Pros</h4><ul><li>Fully managed cloud — zero ops</li><li>Scales to billions of vectors</li><li>Rich metadata filtering</li><li>Namespaces for multi-tenancy</li><li>Sub-millisecond query latency</li></ul></div>
          <div className="con-box"><h4>Cons</h4><ul><li>Paid (free tier has limits)</li><li>Data leaves your infrastructure</li><li>Cold start latency on serverless tier</li><li>Vendor lock-in</li></ul></div>
        </div>
        <pre><code className="language-python">{`from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

pc = Pinecone(api_key="your-pinecone-key")
pc.create_index(
    name="my-index", dimension=embedding_dim, metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)
vs = PineconeVectorStore.from_documents(chunks, embeddings, index_name="my-index")`}</code></pre>

        <h3>Qdrant</h3>
        <div className="pro-con-grid">
          <div className="pro-box"><h4>Pros</h4><ul><li>Advanced JSON payload filtering</li><li>Runs locally (Docker) or cloud</li><li>Fast HNSW with payload indexing</li><li>Open-source, no vendor lock-in</li><li>Named vectors (multi-vector per document)</li></ul></div>
          <div className="con-box"><h4>Cons</h4><ul><li>More setup than Chroma for local use</li><li>Smaller community than Pinecone</li><li>Self-hosted requires infra ops</li></ul></div>
        </div>
        <pre><code className="language-python">{`from langchain_community.vectorstores import Qdrant

vs = Qdrant.from_documents(
    chunks, embeddings,
    location=":memory:",        # or url="http://localhost:6333"
    collection_name="my_docs"
)`}</code></pre>

        <h3>Weaviate</h3>
        <div className="pro-con-grid">
          <div className="pro-box"><h4>Pros</h4><ul><li>Native hybrid search (BM25 + vector) built-in</li><li>GraphQL-based query interface</li><li>Built-in generative search modules</li><li>Multi-tenancy and RBAC</li></ul></div>
          <div className="con-box"><h4>Cons</h4><ul><li>Steeper learning curve (GraphQL)</li><li>Heavy local Docker setup</li><li>Cloud version paid beyond free tier</li></ul></div>
        </div>
        <pre><code className="language-python">{`import weaviate
from langchain_community.vectorstores import Weaviate

client = weaviate.Client("http://localhost:8080")
vs = Weaviate.from_documents(chunks, embeddings, client=client,
                              index_name="MyDocs", by_text=False)`}</code></pre>

        <h3>Quick-Select Guide</h3>
        <table className="cmp-table">
          <thead><tr><th>Need</th><th>Best Choice</th></tr></thead>
          <tbody>
            <tr><td>Fast local prototype, no persistence needed</td><td>FAISS</td></tr>
            <tr><td>Local prototype WITH persistence + metadata filtering</td><td>Chroma</td></tr>
            <tr><td>Production scale, managed, low-ops</td><td>Pinecone</td></tr>
            <tr><td>Self-hosted production with rich filtering</td><td>Qdrant</td></tr>
            <tr><td>Native hybrid search built-in</td><td>Weaviate</td></tr>
          </tbody>
        </table>
      </section >

      <section className="topic-card" id="faiss-indexes">
        <h2>FAISS Index Types</h2>
        <p className="topic-intro">Pre-compiled distance calculation algorithms deployed to rapidly query millions of vectors simultaneously. They replace brute-force Euclidean distance calculations across the entire database. They solve the computationally impossible task of mathematically comparing a query vector against every single stored chunk in real-time. Index types are carefully chosen based on the strict engineering trade-off between absolute recall accuracy, RAM constraints, and required millisecond inference speeds immediately upon building the initial vector store.</p>
        <div className="tag-row">
          <span className="tag when">Small dataset: FlatL2</span>
          <span className="tag when">Production default: HNSWFlat</span>
          <span className="tag when">Large + memory-constrained: IVFFlat or IVFPQ</span>
        </div>
        <table className="cmp-table">
          <thead><tr><th>Index</th><th>Algorithm</th><th>Exact?</th><th>Speed</th><th>Memory</th><th>Needs Training</th><th>Best For</th></tr></thead>
          <tbody>
            <tr><td><strong>IndexFlatL2</strong></td><td>Brute-force L2 distance</td><td className="yes">Yes</td><td>Slow at scale</td><td>High</td><td className="no">No</td><td>Baseline, small datasets (&lt;100k)</td></tr>
            <tr><td><strong>IndexFlatIP</strong></td><td>Brute-force inner product</td><td className="yes">Yes</td><td>Slow at scale</td><td>High</td><td className="no">No</td><td>Cosine similarity, small datasets</td></tr>
            <tr><td><strong>IndexHNSWFlat</strong></td><td>Graph-based ANN (HNSW)</td><td className="no">Approx</td><td>Very fast</td><td>Medium-High</td><td className="no">No</td><td>Default production choice</td></tr>
            <tr><td><strong>IndexIVFFlat</strong></td><td>Cluster + flat search per cluster</td><td className="no">Approx</td><td>Fast</td><td>Medium</td><td className="yes">Yes</td><td>Large datasets (100k–10M)</td></tr>
            <tr><td><strong>IndexIVFPQ</strong></td><td>IVF + Product Quantization (lossy)</td><td className="no">Approx</td><td>Very fast</td><td>Low</td><td className="yes">Yes</td><td>Very large, memory-constrained</td></tr>
            <tr><td><strong>IndexLSH</strong></td><td>Locality Sensitive Hashing</td><td className="no">Approx</td><td>Fast</td><td>Low</td><td className="no">No</td><td>High-dim, low-memory budget</td></tr>
            <tr><td><strong>IndexPQ</strong></td><td>Product Quantization only</td><td className="no">Approx</td><td>Medium</td><td>Very Low</td><td className="yes">Yes</td><td>Extreme memory savings</td></tr>
          </tbody>
        </table>
        <div className="formula-block">
          {String.raw`$$\text{nlist}_{\text{IVF}} = 4 \cdot \sqrt{N_{\text{docs}}} \qquad \text{nbits}_{\text{LSH}} = \text{dim} \times 4$$`}
          <p className="formula-label">Rule-of-thumb sizing parameters.</p>
        </div>
        <pre><code className="language-python">{`import faiss
dim = 3072

index_flat   = faiss.IndexFlatL2(dim)                        # exact
index_hnsw   = faiss.IndexHNSWFlat(dim, 32)                 # recommended default
nlist = 100
quantizer    = faiss.IndexFlatL2(dim)
index_ivf    = faiss.IndexIVFFlat(quantizer, dim, nlist)    # needs .train()
index_ivfpq  = faiss.IndexIVFPQ(quantizer, dim, nlist, 8, 8) # needs .train()
index_lsh    = faiss.IndexLSH(dim, dim * 4)`}</code></pre>
      </section>

      {/*  ── RETRIEVAL ──  */}
      <div className="section-divider"><h2>Retrieval Methods</h2></div>

      <section className="topic-card" id="retrieval-methods">
        <h2>Keyword, Semantic &amp; Hybrid Retrieval</h2>
        <p className="topic-intro">The three fundamental, algorithmically distinct strategies employed to find relevant text chunks corresponding to a user's query. They replace simple, unstructured grep-style string matching. They solve the critical failure modes of search—specifically that keyword search fails on synonyms, while semantic search fails on highly technical explicit proper nouns or IDs. Retrieval strategies, especially Reciprocal Rank Fusion hybrids, are integrated directly into the core query pipeline to vastly increase the probability that the requested factual knowledge is returned in the top-k results.</p>

        <h3>1 — Keyword-Based (BM25 / Sparse)</h3>
        <p className="topic-intro">Exact lexical scoring algorithms relying heavily on TF-IDF principles. It replaces naive Boolean AND/OR searches. It solves the need to instantly and reliably retrieve documents containing exact technical configurations, unique alphanumeric IDs, or specific product names where semantic meaning is completely irrelevant. BM25 parameters are tuned whenever semantic search fails to surface explicitly mentioned critical nouns.</p>
        <div className="formula-block">
          {String.raw`$$\text{BM25}(q,d) = \sum_{t \in q} \text{IDF}(t) \cdot \frac{f(t,d)\cdot(k_1+1)}{f(t,d)+k_1\cdot\left(1-b+b\cdot\frac{|d|}{\text{avgdl}}\right)}$$`}
          <p className="formula-label">{String.raw`$k_1 \approx 1.5$`}, {String.raw`$b \approx 0.75$`}, {String.raw`$f(t,d)$`} = term frequency, avgdl = average document length</p>
        </div>
        <pre><code className="language-python">{`from langchain_community.retrievers import BM25Retriever

bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 5
results = bm25_retriever.invoke("async SDK capabilities")`}</code></pre>

        <h3>2 — Semantic (Dense Vector) Retrieval</h3>
        <p className="topic-intro">The foundational mathematical process of retrieving texts based entirely on their abstract conceptual meaning rather than exact spelling. It replaces rigid keyword requirements. It solves the "synonym problem" where users ask entirely valid questions using vocabulary completely absent from the official documentation. Semantic retrieval is the assumed default operation within modern RAG systems, typically executing nearest-neighbor algorithms in high-dimensional space.</p>
        <pre><code className="language-python">{`# similarity = cosine/L2 top-k (default)
# mmr = Maximal Marginal Relevance (diverse results)
# similarity_score_threshold = only return results above a cutoff score
retriever = vs.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)
results = retriever.invoke("async SDK capabilities")`}</code></pre>

        <h3>3 — Hybrid Retrieval (Keyword + Semantic)</h3>
        <p className="topic-intro">The systematic algorithmic fusion of both exact BM25 keyword matching and dense conceptual semantic similarity searches. It replaces forcing architectural trade-offs between precision and recall. It solves the fundamental reality that complex queries often simultaneously demand both the broad conceptual understanding of vectors and the strict exact-match rigidity of algorithms like BM25. Hybrid models deploy Reciprocal Rank Fusion immediately following parallel retrievals to seamlessly weave both lists together for the LLM.</p>
        <div className="formula-block">
          {String.raw`$$\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d)}, \quad k = 60$$`}
          <p className="formula-label">Merges ranked lists from different retrievers. {String.raw`$k=60$`} prevents top-ranked documents from dominating.</p>
        </div>
        <pre><code className="language-python">{`from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

bm25 = BM25Retriever.from_documents(chunks, k=5)
dense = vs.as_retriever(search_kwargs={"k": 5})

hybrid = EnsembleRetriever(
    retrievers=[bm25, dense],
    weights=[0.4, 0.6]   # tune: more weight to semantic usually wins
)
results = hybrid.invoke("async capabilities")`}</code></pre>

        <h3>Search Type Comparison</h3>
        <table className="cmp-table">
          <thead><tr><th>Method</th><th>Handles Synonyms</th><th>Handles Exact Terms</th><th>Diverse Results</th><th>Best For</th></tr></thead>
          <tbody>
            <tr><td>BM25 (keyword)</td><td className="no">No</td><td className="yes">Yes</td><td className="no">No</td><td>Exact term queries, IDs, codes</td></tr>
            <tr><td>Dense (semantic)</td><td className="yes">Yes</td><td className="no">No</td><td className="no">No</td><td>Natural language, concept queries</td></tr>
            <tr><td>Hybrid (RRF)</td><td className="yes">Yes</td><td className="yes">Yes</td><td className="no">No</td><td>Production default</td></tr>
            <tr><td>MMR</td><td className="yes">Yes</td><td className="no">No</td><td className="yes">Yes</td><td>When results are too similar/redundant</td></tr>
          </tbody>
        </table>
      </section>

      <section className="topic-card" id="retrieval-improvement">
        <h2>Retrieval Improvement Techniques</h2>
        <p className="topic-intro">Advanced query transformation techniques executing immediately prior to standard vector retrieval. They replace naive, one-to-one embedding query-matching. They solve the inherent problem where the exact phrasing queried by the user is completely incongruent with the phrasing statically indexed in the document store. Retrieval improvements like HyDE and MultiQuery are turned on anytime baseline semantic retrieval proves insufficient for vague, ambiguous, or extremely short user questions.</p>

        <h3>HyDE — Hypothetical Document Embeddings</h3>
        <p className="topic-intro">Instead of embedding the raw user query, ask the LLM to generate a hypothetical answer document and embed that instead. The hypothesis lives in the same semantic space as real documents — often much closer to the target chunk than the bare query.</p>
        <div className="formula-block">
          {String.raw`$$\hat{d} = \text{LLM}(q), \quad \text{retrieve}\!\left(\text{embed}(\hat{d})\right) \approx \text{retrieve}\!\left(\text{embed}(d^*)\right)$$`}
          <p className="formula-label">{String.raw`$\hat{d}$`} = hypothetical generated answer, {String.raw`$d^*$`} = true answer document, {String.raw`$q$`} = user query</p>
        </div>
        <pre><code className="language-python">{`from langchain.chains import HypotheticalDocumentEmbedder

hyde_embeddings = HypotheticalDocumentEmbedder.from_llm(
    llm=llm, base_embeddings=embeddings
)
# Build store using HyDE embeddings
hyde_vs = FAISS.from_documents(chunks, hyde_embeddings)
results = hyde_vs.similarity_search("What are the async capabilities?", k=5)`}</code></pre>
        <div className="tip"><strong>When to use HyDE:</strong> Short or vague queries ("tell me about async stuff") where document language is much richer than the query. Not useful when queries are already detailed and well-phrased.</div>

        <h3>MultiQuery Retrieval</h3>
        <p className="topic-intro">LLM generates multiple reformulations of the query, runs each separately, and deduplicates + merges results. Handles ambiguity and different phrasings automatically.</p>
        <pre><code className="language-python">{`from langchain.retrievers.multi_query import MultiQueryRetriever

mq_retriever = MultiQueryRetriever.from_llm(
    retriever=vs.as_retriever(search_kwargs={"k": 5}),
    llm=llm
)
# Internally generates ~3 query variants and merges results
results = mq_retriever.invoke("What can this SDK do asynchronously?")`}</code></pre>

        <h3>Parent Document Retriever</h3>
        <p className="topic-intro">Indexes small chunks for precise retrieval but returns the full parent chunk for richer LLM context. Best of both worlds: small search granularity, large context window usage.</p>
        <pre><code className="language-python">{`from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

child_splitter = RecursiveCharacterTextSplitter(chunk_size=200)
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)

store = InMemoryStore()
retriever = ParentDocumentRetriever(
    vectorstore=vs, docstore=store,
    child_splitter=child_splitter, parent_splitter=parent_splitter,
)
retriever.add_documents(docs)
results = retriever.invoke("async capabilities")`}</code></pre>

        <h3>Self-Query Retriever</h3>
        <p className="topic-intro">LLM parses the query to extract a semantic search term AND metadata filters (e.g. "find docs about Python from 2024"). Useful when documents have rich structured metadata.</p>
        <pre><code className="language-python">{`from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(name="source", description="Source PDF filename", type="string"),
    AttributeInfo(name="page", description="Page number", type="integer"),
]
retriever = SelfQueryRetriever.from_llm(
    llm=llm, vectorstore=vs,
    document_contents="SDK documentation",
    metadata_field_info=metadata_field_info,
)
results = retriever.invoke("async features from the SDK guide")`}</code></pre>

        <h3>Technique Comparison</h3>
        <table className="cmp-table">
          <thead><tr><th>Technique</th><th>Problem It Solves</th><th>Extra Cost</th></tr></thead>
          <tbody>
            <tr><td>HyDE</td><td>Short/vague queries don't match document embedding space</td><td>1 LLM call per query</td></tr>
            <tr><td>MultiQuery</td><td>Single phrasing misses differently-worded relevant chunks</td><td>1 LLM call + N retrievals</td></tr>
            <tr><td>ParentDocument</td><td>Small chunks lack enough surrounding context for LLM</td><td>Extra storage</td></tr>
            <tr><td>SelfQuery</td><td>Query implies metadata filters (date, source, type…)</td><td>1 LLM call per query</td></tr>
            <tr><td>Hybrid (EnsembleRetriever)</td><td>Pure semantic misses exact terms; BM25 misses synonyms</td><td>2× retrieval time</td></tr>
            <tr><td>Reranking</td><td>Top-k ranking from retrieval is suboptimal</td><td>1 reranker inference</td></tr>
          </tbody>
        </table>
      </section>

      {/*  ── RERANKING ──  */}
      <div className="section-divider"><h2>Reranking</h2></div>

      <section className="topic-card" id="rerankers">
        <h2>All Rerankers</h2>
        <p className="topic-intro">Second-pass cross-encoder models that computationally score query and document chunk pairs jointly rather than comparing their separated embeddings. It replaces relying strictly on fast-but-inaccurate bi-encoder cosine similarity for the final context ranking. It solves the issue where vector math retrieves tangentially related context but incorrectly ranks the single most factually accurate chunk at position 8 instead of position 1. Reranking operates immediately after an initial large-k retrieval, aggressively filtering the results down to the most relevant top 3-5 chunks before an LLM views them.</p>
        <div className="tag-row">
          <span className="tag when">When: top chunk isn't always the most relevant</span>
          <span className="tag when">When: casting wide net (k=10–20) then filtering to 3–5</span>
          <span className="tag when">When: noisy context is hurting answer quality</span>
        </div>

        <h3>FlashRank — Local, Free, Fast</h3>
        <p className="topic-intro">Lightweight cross-encoder running locally. Fast and free. Multiple model sizes. Best default when you don't want API costs.</p>
        <pre><code className="language-python">{`from langchain.retrievers import ContextualCompressionRetriever
from langchain_community.document_compressors import FlashrankRerank

base_retriever = vs.as_retriever(search_kwargs={"k": 10})
reranker = FlashrankRerank(top_n=5)  # default model: ms-marco-MiniLM-L-12-v2

retriever = ContextualCompressionRetriever(
    base_compressor=reranker, base_retriever=base_retriever
)
docs = retriever.invoke("your query")`}</code></pre>

        <h3>Cohere Rerank — Cloud API, Best Quality</h3>
        <p className="topic-intro">Cohere's <code>rerank-english-v3.0</code> is among the best rerankers available. API-based — requires a Cohere API key. Excellent quality, especially for English text.</p>
        <pre><code className="language-python">{`from langchain_cohere import CohereRerank
from langchain.retrievers import ContextualCompressionRetriever
import os

os.environ["COHERE_API_KEY"] = "your-cohere-key"

reranker = CohereRerank(model="rerank-english-v3.0", top_n=5)
retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)
docs = retriever.invoke("your query")`}</code></pre>

        <h3>Cross-Encoder (SentenceTransformers) — Local, High Quality</h3>
        <p className="topic-intro">HuggingFace cross-encoder models that jointly encode query + document. More accurate than bi-encoders. Runs locally. Slightly slower than FlashRank but more flexible model choice.</p>
        <pre><code className="language-python">{`from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

model = HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
reranker = CrossEncoderReranker(model=model, top_n=5)

retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)
docs = retriever.invoke("your query")`}</code></pre>

        <h3>LLM-Based Filter — Most Accurate, Most Expensive</h3>
        <p className="topic-intro">Uses a full LLM to score each chunk's relevance. Highest accuracy but highest cost. Use when quality is paramount.</p>
        <pre><code className="language-python">{`from langchain.retrievers.document_compressors import LLMChainFilter
from langchain.retrievers import ContextualCompressionRetriever

llm_filter = LLMChainFilter.from_llm(llm)
retriever = ContextualCompressionRetriever(
    base_compressor=llm_filter,
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)`}</code></pre>

        <h3>Reranker Comparison</h3>
        <table className="cmp-table">
          <thead><tr><th>Reranker</th><th>Speed</th><th>Quality</th><th>Cost</th><th>Local</th><th>Best For</th></tr></thead>
          <tbody>
            <tr><td>FlashRank</td><td>Fast</td><td>Good</td><td>Free</td><td className="yes">Yes</td><td>Default — local, no cost</td></tr>
            <tr><td>Cross-Encoder (SBERT)</td><td>Medium</td><td>Very Good</td><td>Free</td><td className="yes">Yes</td><td>Local, higher quality than FlashRank</td></tr>
            <tr><td>Cohere Rerank v3</td><td>Fast (API)</td><td>Excellent</td><td>Paid</td><td className="no">No</td><td>Production, best English quality</td></tr>
            <tr><td>LLM Filter</td><td>Slow</td><td>Best</td><td>High</td><td>Depends</td><td>When accuracy trumps cost</td></tr>
          </tbody>
        </table>
        <div className="tip"><strong>Pattern:</strong> Retrieve large k (10–20) with fast vector search → rerank → pass top 3–5 to LLM. Never run a reranker on the full corpus.</div>
      </section>

      {/*  ── AGENTS ──  */}
      <div className="section-divider"><h2>Agents</h2></div>

      <section className="topic-card" id="react-agents">
        <h2>ReAct Agents</h2>
        <p className="topic-intro">An iterative autonomous framework where an LLM cycles through Thought, Action, and Observation loops to dynamically solve complex instructions. It replaces static, single-pass RAG pipelines lacking execution flexibility. It solves the inability of standard LLMs to perform multi-hop reasoning, execute calculators, perform web searches, or look up proprietary data sequentially before formulating a final answer. ReAct agents are deployed when a user query demonstrably requires choosing between multiple distinct tools or gathering separate pieces of information across multiple discrete steps.</p>
        <div className="tag-row">
          <span className="tag when">When: single-step RAG isn't enough</span>
          <span className="tag when">When: LLM needs to choose between multiple tools</span>
          <span className="tag when">When: multi-hop reasoning over documents or APIs</span>
          <span className="tag when">When: combining search + calculation + lookup</span>
        </div>

        <h3>ReAct Loop</h3>
        <ol>
          <li><strong>Thought:</strong> LLM reasons about what information it needs</li>
          <li><strong>Action:</strong> LLM selects a tool and provides input arguments</li>
          <li><strong>Observation:</strong> Tool runs and returns result to LLM</li>
          <li>Loop repeats until LLM outputs a <strong>Final Answer</strong></li>
        </ol>

        <h3>Basic ReAct Agent with a RAG Tool (LangChain 0.3+)</h3>
        <pre><code className="language-python">{`from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.tools import Tool
from langchain import hub

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

def search_docs(query: str) -> str:
    docs = retriever.invoke(query)
    return "\\n\\n".join([d.page_content for d in docs])

tools = [
    Tool(
        name="DocumentSearch",
        func=search_docs,
        description="Search the SDK documentation. Input should be a search query string."
    )
]

prompt = hub.pull("hwchase17/react")
agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)

executor = AgentExecutor(
    agent=agent, tools=tools,
    verbose=True,              # prints Thought/Action/Observation trace
    max_iterations=5,          # prevent infinite loops
    handle_parsing_errors=True
)

result = executor.invoke({"input": "What async features does the SDK have?"})
print(result["output"])`}</code></pre>

        <h3>LangGraph ReAct — Modern Recommended Approach</h3>
        <pre><code className="language-python">{`from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# LangGraph's version is more robust and actively maintained
graph = create_react_agent(llm, tools=tools)

result = graph.invoke({
    "messages": [("user", "What are the async capabilities of the SDK?")]
})
print(result["messages"][-1].content)`}</code></pre>

        <h3>Agent with Multiple Tools</h3>
        <pre><code className="language-python">{`from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool

web_search = DuckDuckGoSearchRun()

@tool
def calculate(expression: str) -> str:
    """Evaluate a math expression. Input: a valid Python math expression."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

tools = [
    Tool(name="WebSearch", func=web_search.run,
         description="Search the web for current information."),
    Tool(name="DocumentSearch", func=search_docs,
         description="Search internal SDK documentation."),
    calculate,
]

executor = AgentExecutor(
    agent=create_react_agent(llm, tools, hub.pull("hwchase17/react")),
    tools=tools, verbose=True, max_iterations=8, handle_parsing_errors=True
)`}</code></pre>

        <h3>ReAct vs Standard RAG</h3>
        <table className="cmp-table">
          <thead><tr><th>Feature</th><th>Standard RAG</th><th>ReAct Agent</th></tr></thead>
          <tbody>
            <tr><td>Reasoning steps</td><td>Fixed: 1</td><td>Dynamic: many</td></tr>
            <tr><td>Tool selection</td><td>Fixed retriever</td><td>LLM chooses dynamically</td></tr>
            <tr><td>Multi-hop queries</td><td className="no">Poor</td><td className="yes">Excellent</td></tr>
            <tr><td>Latency</td><td>Low</td><td>Higher (N LLM calls)</td></tr>
            <tr><td>Cost</td><td>Low</td><td>Higher</td></tr>
            <tr><td>Reliability</td><td>High</td><td>Medium (parsing failures)</td></tr>
          </tbody>
        </table>
        <div className="gotcha"><strong>Gotcha:</strong> Always set <code>max_iterations</code> and <code>handle_parsing_errors=True</code>. Agents can loop if a tool always returns unexpected output.</div>
        <div className="tip"><strong>LangGraph vs AgentExecutor:</strong> For new projects, prefer <code>langgraph.prebuilt.create_react_agent</code> — it is the actively maintained successor to <code>AgentExecutor</code>. Install: <code>pip install langgraph</code></div>
      </section>

      {/*  ── EVALUATION ──  */}
      <div className="section-divider"><h2>Evaluation</h2></div>

      <section className="topic-card" id="ragas">
        <h2>RAGAS — RAG Evaluation Framework</h2>
        <p className="topic-intro">A standardized suite of metrics utilizing an LLM-as-a-judge specifically designed to objectively score RAG pipeline outputs. It replaces relying entirely on qualitative, anecdotal human testing to verify answer accuracy. It systematically solves the problem of not knowing whether deploying a new embedding model, tweaking a chunk size, or swapping retrievers actually improved or degraded overall system answering capabilities. RAGAS is executed constantly during CI/CD workflows and experimentation to isolate and diagnose exactly whether the retriever or the generator is failing.</p>
        <div className="tag-row">
          <span className="tag when">When: benchmarking pipeline quality</span>
          <span className="tag when">When: comparing retriever or LLM configurations</span>
          <span className="tag when">When: catching regressions in CI/CD</span>
        </div>
        <pre><code className="language-python">{`from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from datasets import Dataset
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

evaluator_llm = LangchainLLMWrapper(ChatGoogleGenerativeAI(model="gemini-2.5-flash"))
evaluator_embeddings = LangchainEmbeddingsWrapper(
    GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
)

data = {
    "question":     ["What are the async capabilities of this SDK?"],
    "ground_truth": ["Concurrent uploads, parallel KB ops, non-blocking API calls..."],
    "answer":       ["The SDK supports async operations, concurrent uploads..."],
    "contexts":     [["chunk text 1", "chunk text 2", "chunk text 3"]]
}

results = evaluate(
    dataset=Dataset.from_dict(data),
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
    llm=evaluator_llm,
    embeddings=evaluator_embeddings
)
print(results.to_pandas())`}</code></pre>
        <div className="gotcha"><strong>Gotcha:</strong> ground_truth must be written manually per query — RAGAS does not generate it. It is your gold-standard answer used to compute context recall.</div>
      </section>

      <section className="topic-card" id="ragas-metrics">
        <h2>RAGAS Metrics Explained</h2>
        <p className="topic-intro">Four distinct quantitative metrics designed to isolate specific failure modes across both the retrieval and generation phases. They replace vague "accuracy" measurements with specific diagnostics targeting hallucination, irrelevant tangents, poor ranking, and missing facts. They solve the diagnostic bottleneck of debugging RAG, immediately pointing an engineer to fix either system prompts, retriever parameters, or chunk configurations. The metrics are actively referenced anytime pipeline evaluation scores dip, indicating exactly which tuning mechanism needs adjustment.</p>
        <table className="cmp-table">
          <thead><tr><th>Metric</th><th>Question It Answers</th><th>Low Score Means</th><th>Fix</th></tr></thead>
          <tbody>
            <tr><td><strong>Faithfulness</strong></td><td>Is every claim in the answer grounded in context?</td><td>LLM is hallucinating</td><td>Stricter "answer only from context" prompt</td></tr>
            <tr><td><strong>Answer Relevancy</strong></td><td>Did the answer actually address the question?</td><td>LLM went off-topic</td><td>Tighten system prompt; reduce context noise</td></tr>
            <tr><td><strong>Context Precision</strong></td><td>Were the most relevant chunks ranked first?</td><td>Retriever ranking is poor</td><td>Add reranker; improve chunk size</td></tr>
            <tr><td><strong>Context Recall</strong></td><td>Did we retrieve all info needed to answer?</td><td>Retriever missing key chunks</td><td>Increase k; use hybrid retrieval; fix chunking</td></tr>
          </tbody>
        </table>
        <div className="formula-block">
          {String.raw`$$\text{Faithfulness} = \frac{|\text{claims supported by context}|}{|\text{total claims in answer}|} \qquad \text{Context Recall} = \frac{|\text{GT sentences in context}|}{|\text{total GT sentences}|}$$`}
          <p className="formula-label">GT = ground truth. Both metrics are evaluated internally by an LLM judge.</p>
        </div>
      </section>

      {/*  ── REFERENCE ──  */}
      <div className="section-divider"><h2>Reference</h2></div>

      <section className="topic-card" id="concept-table">
        <h2>All Concepts at a Glance</h2>
        <table className="cmp-table">
          <thead><tr><th>Concept</th><th>Category</th><th>When to Use</th><th>Code</th></tr></thead>
          <tbody>
            <tr><td>RecursiveCharacterTextSplitter</td><td>Splitting</td><td>General purpose default</td><td className="check">Yes</td></tr>
            <tr><td>TokenTextSplitter</td><td>Splitting</td><td>Respect exact token limits</td><td className="check">Yes</td></tr>
            <tr><td>MarkdownHeaderTextSplitter</td><td>Splitting</td><td>Markdown / Wiki docs</td><td className="check">Yes</td></tr>
            <tr><td>Language Splitter</td><td>Splitting</td><td>Source code files</td><td className="check">Yes</td></tr>
            <tr><td>SemanticChunker</td><td>Splitting</td><td>Topic-coherent chunks</td><td className="check">Yes</td></tr>
            <tr><td>GoogleGenerativeAIEmbeddings</td><td>Embeddings</td><td>Gemini ecosystem</td><td className="check">Yes</td></tr>
            <tr><td>FAISS</td><td>Vector Store</td><td>Local, fast, no server</td><td className="check">Yes</td></tr>
            <tr><td>Chroma</td><td>Vector Store</td><td>Local + persistence + filtering</td><td className="check">Yes</td></tr>
            <tr><td>Pinecone</td><td>Vector Store</td><td>Cloud production scale</td><td className="check">Yes</td></tr>
            <tr><td>Qdrant</td><td>Vector Store</td><td>Self-hosted, rich filtering</td><td className="check">Yes</td></tr>
            <tr><td>Weaviate</td><td>Vector Store</td><td>Native hybrid search</td><td className="check">Yes</td></tr>
            <tr><td>IndexFlatL2</td><td>FAISS Index</td><td>Exact search, small data</td><td className="check">Yes</td></tr>
            <tr><td>IndexHNSWFlat</td><td>FAISS Index</td><td>Fast ANN, production default</td><td className="check">Yes</td></tr>
            <tr><td>IndexIVFFlat</td><td>FAISS Index</td><td>Large datasets</td><td className="check">Yes</td></tr>
            <tr><td>IndexIVFPQ</td><td>FAISS Index</td><td>Very large + memory-constrained</td><td className="check">Yes</td></tr>
            <tr><td>IndexLSH</td><td>FAISS Index</td><td>High-dim, low memory budget</td><td className="check">Yes</td></tr>
            <tr><td>BM25 Retrieval</td><td>Retrieval</td><td>Exact keyword match</td><td className="check">Yes</td></tr>
            <tr><td>Semantic Retrieval</td><td>Retrieval</td><td>Meaning-based, default</td><td className="check">Yes</td></tr>
            <tr><td>Hybrid (EnsembleRetriever)</td><td>Retrieval</td><td>Best coverage, production</td><td className="check">Yes</td></tr>
            <tr><td>MMR search_type</td><td>Retrieval</td><td>Diverse, non-redundant results</td><td className="check">Yes</td></tr>
            <tr><td>HyDE</td><td>Retrieval Improvement</td><td>Vague/short queries</td><td className="check">Yes</td></tr>
            <tr><td>MultiQuery</td><td>Retrieval Improvement</td><td>Ambiguous queries</td><td className="check">Yes</td></tr>
            <tr><td>ParentDocument</td><td>Retrieval Improvement</td><td>Small search + big context</td><td className="check">Yes</td></tr>
            <tr><td>SelfQuery</td><td>Retrieval Improvement</td><td>Queries imply metadata filters</td><td className="check">Yes</td></tr>
            <tr><td>FlashRank</td><td>Reranker</td><td>Local, free, fast</td><td className="check">Yes</td></tr>
            <tr><td>Cohere Rerank v3</td><td>Reranker</td><td>Best quality API</td><td className="check">Yes</td></tr>
            <tr><td>Cross-Encoder (SBERT)</td><td>Reranker</td><td>Local, high quality</td><td className="check">Yes</td></tr>
            <tr><td>LLM Filter</td><td>Reranker</td><td>Maximum accuracy, high cost</td><td className="check">Yes</td></tr>
            <tr><td>ReAct Agent (AgentExecutor)</td><td>Agent</td><td>Multi-step, tool-using</td><td className="check">Yes</td></tr>
            <tr><td>LangGraph ReAct</td><td>Agent</td><td>Modern production agents</td><td className="check">Yes</td></tr>
            <tr><td>RAGAS Faithfulness</td><td>Evaluation</td><td>Detect hallucination</td><td className="check">Yes</td></tr>
            <tr><td>RAGAS Context Recall</td><td>Evaluation</td><td>Retriever completeness</td><td className="check">Yes</td></tr>
            <tr><td>RAGAS Context Precision</td><td>Evaluation</td><td>Retriever ranking quality</td><td className="check">Yes</td></tr>
            <tr><td>RAGAS Answer Relevancy</td><td>Evaluation</td><td>Answer on-topicness</td><td className="check">Yes</td></tr>
          </tbody>
        </table>
      </section>

      <section className="topic-card" id="formula-sheet">
        <h2>Formula Reference Sheet</h2>

        <div className="formula-entry">
          <h4>BM25 Score (Keyword Retrieval)</h4>
          <div className="formula-display">{String.raw`$$\text{BM25}(q,d) = \sum_{t \in q} \text{IDF}(t) \cdot \frac{f(t,d)\cdot(k_1+1)}{f(t,d)+k_1\cdot\left(1-b+b\cdot\frac{|d|}{\text{avgdl}}\right)}$$`}</div>
          <p><strong>Variables:</strong> {String.raw`$k_1 \approx 1.5$`}, {String.raw`$b \approx 0.75$`}, {String.raw`$f(t,d)$`} = term frequency, avgdl = average doc length</p>
          <p><strong>Used when:</strong> keyword-based retrieval</p>
        </div>

        <div className="formula-entry">
          <h4>Reciprocal Rank Fusion (Hybrid Search)</h4>
          <div className="formula-display">{String.raw`$$\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d)}, \quad k = 60$$`}</div>
          <p><strong>Variables:</strong> {String.raw`$R$`} = set of ranked lists, {String.raw`$k=60$`} dampens top rank dominance</p>
          <p><strong>Used when:</strong> merging BM25 and dense retrieval with EnsembleRetriever</p>
        </div>

        <div className="formula-entry">
          <h4>HyDE — Hypothetical Document Embedding</h4>
          <div className="formula-display">{String.raw`$$\hat{d} = \text{LLM}(q), \quad \text{embed}(\hat{d}) \approx \text{embed}(d^*)$$`}</div>
          <p><strong>Variables:</strong> {String.raw`$\hat{d}$`} = hypothetical answer, {String.raw`$d^*$`} = true answer document, {String.raw`$q$`} = user query</p>
          <p><strong>Used when:</strong> short queries don't match the document embedding space</p>
        </div>

        <div className="formula-entry">
          <h4>IVF Cluster Count</h4>
          <div className="formula-display">{String.raw`$$\text{nlist} = 4 \cdot \sqrt{N_{\text{documents}}}$$`}</div>
          <p><strong>Used when:</strong> creating FAISS IndexIVFFlat or IndexIVFPQ</p>
        </div>

        <div className="formula-entry">
          <h4>LSH Bit Count</h4>
          <div className="formula-display">{String.raw`$$\text{nbits} = \text{embedding\_dim} \times 4$$`}</div>
          <p><strong>Used when:</strong> creating FAISS IndexLSH</p>
        </div>

        <div className="formula-entry">
          <h4>RAGAS Faithfulness</h4>
          <div className="formula-display">{String.raw`$$\text{Faithfulness} = \frac{|\text{claims supported by context}|}{|\text{total claims in answer}|}$$`}</div>
          <p><strong>Used when:</strong> measuring LLM hallucination rate</p>
        </div>

        <div className="formula-entry">
          <h4>RAGAS Context Recall</h4>
          <div className="formula-display">{String.raw`$$\text{Context Recall} = \frac{|\text{ground truth sentences found in context}|}{|\text{total ground truth sentences}|}$$`}</div>
          <p><strong>Used when:</strong> measuring retriever completeness vs human ground truth</p>
        </div>
      </section>

      <section className="topic-card" id="code-appendix">
        <h2>Code Reference</h2>

        <div className="code-entry">
          <h4>Full end-to-end RAG pipeline (LangChain 0.3+, Gemini)</h4>
          <pre><code className="language-python">{`import os, faiss
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain.retrievers import ContextualCompressionRetriever
from langchain_community.document_compressors import FlashrankRerank

os.environ["GOOGLE_API_KEY"] = "your-key"

docs   = PyPDFLoader("doc.pdf").load()
chunks = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50).split_documents(docs)

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
dim        = len(embeddings.embed_query("test"))

vs = FAISS(embedding_function=embeddings, index=faiss.IndexHNSWFlat(dim, 32),
           docstore=InMemoryDocstore(), index_to_docstore_id={})
vs.add_documents(chunks)

retriever = ContextualCompressionRetriever(
    base_compressor=FlashrankRerank(top_n=5),
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)

llm   = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
query = "What are the async capabilities?"
ctx   = "\\n\\n".join([d.page_content for d in retriever.invoke(query)])
print(llm.invoke(f"Answer ONLY from context:\\n{ctx}\\n\\nQuestion: {query}").content)`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>Hybrid retrieval — BM25 + FAISS</h4>
          <pre><code className="language-python">{`from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever

bm25   = BM25Retriever.from_documents(chunks, k=5)
dense  = vs.as_retriever(search_kwargs={"k": 5})
hybrid = EnsembleRetriever(retrievers=[bm25, dense], weights=[0.4, 0.6])
results = hybrid.invoke("async capabilities")`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>HyDE — Hypothetical Document Embeddings</h4>
          <pre><code className="language-python">{`from langchain.chains import HypotheticalDocumentEmbedder

hyde_emb = HypotheticalDocumentEmbedder.from_llm(llm=llm, base_embeddings=embeddings)
hyde_vs  = FAISS.from_documents(chunks, hyde_emb)
results  = hyde_vs.similarity_search("async capabilities", k=5)`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>MultiQuery retriever</h4>
          <pre><code className="language-python">{`from langchain.retrievers.multi_query import MultiQueryRetriever

mq = MultiQueryRetriever.from_llm(retriever=vs.as_retriever(), llm=llm)
results = mq.invoke("async capabilities")`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>ReAct Agent with document search tool (LangChain 0.3+)</h4>
          <pre><code className="language-python">{`from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.tools import Tool
from langchain import hub

tools = [Tool(
    name="DocumentSearch",
    func=lambda q: "\\n\\n".join([d.page_content for d in retriever.invoke(q)]),
    description="Search SDK documentation. Input: search query string."
)]

executor = AgentExecutor(
    agent=create_react_agent(llm, tools, hub.pull("hwchase17/react")),
    tools=tools, verbose=True, max_iterations=5, handle_parsing_errors=True
)
result = executor.invoke({"input": "What async features does the SDK have?"})`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>LangGraph ReAct (recommended modern approach)</h4>
          <pre><code className="language-python">{`from langgraph.prebuilt import create_react_agent

graph  = create_react_agent(llm, tools=tools)
result = graph.invoke({"messages": [("user", "What are the async capabilities?")]})
print(result["messages"][-1].content)`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>Cohere reranker</h4>
          <pre><code className="language-python">{`from langchain_cohere import CohereRerank
from langchain.retrievers import ContextualCompressionRetriever

retriever = ContextualCompressionRetriever(
    base_compressor=CohereRerank(model="rerank-english-v3.0", top_n=5),
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>Cross-Encoder reranker (local HuggingFace)</h4>
          <pre><code className="language-python">{`from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

retriever = ContextualCompressionRetriever(
    base_compressor=CrossEncoderReranker(
        model=HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"),
        top_n=5
    ),
    base_retriever=vs.as_retriever(search_kwargs={"k": 10})
)`}</code></pre>
        </div>

        <div className="code-entry">
          <h4>RAGAS evaluation</h4>
          <pre><code className="language-python">{`from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from datasets import Dataset

results = evaluate(
    dataset=Dataset.from_dict({
        "question":     ["What are the async capabilities?"],
        "ground_truth": ["Concurrent uploads, parallel KB ops, non-blocking API calls..."],
        "answer":       ["The SDK supports async operations..."],
        "contexts":     [["chunk text 1", "chunk text 2"]]
    }),
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
    llm=LangchainLLMWrapper(ChatGoogleGenerativeAI(model="gemini-2.5-flash")),
    embeddings=LangchainEmbeddingsWrapper(embeddings)
)
print(results.to_pandas())`}</code></pre>
        </div>
      </section>


      <style jsx>{`
                
  .langchain-container {
    --primary: #58a6ff;
    --bg: #0d1117;
    --card: #161b22;
    --text: #e6edf3;
    --muted: #8b949e;
    --border: #30363d;
    --green: #3fb950;
    --amber: #d29922;
    --red: #f85149;
    --accent: #1f6feb;
    --teal: #39d353;
  }

  

  

  

  

  

  .toc-section-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    padding: 0.6rem 0.5rem 0.15rem;
    font-weight: 700;
    display: block;
    margin-top: 0.4rem;
  }

  

  
  

  

  .hero {
    background: linear-gradient(135deg, #161b22 0%, #1a2233 50%, #1f2937 100%);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 2.5rem 2rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(31,111,235,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .hero h1 { font-size: 1.8rem; font-weight: 800; color: var(--text); margin-bottom: 0.4rem; }
  .hero .subtitle { color: var(--muted); font-size: 0.95rem; margin-bottom: 1.2rem; line-height: 1.5; }
  .badge-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

  .badge {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(88,166,255,0.1);
    color: var(--primary);
    border: 1px solid rgba(88,166,255,0.22);
  }

  .install-banner {
    background: #0d1f0d;
    border: 1px solid #1e4d1e;
    border-radius: 10px;
    padding: 1.2rem 1.5rem;
    margin-bottom: 2rem;
  }

  .install-banner h3 {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--teal);
    margin-bottom: 0.75rem;
  }

  .section-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 2.5rem 0 1.2rem;
  }

  .section-divider h2 {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    white-space: nowrap;
    font-weight: 700;
  }

  .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .topic-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.75rem 2rem;
    margin-bottom: 1.25rem;
  }

  .topic-card h2 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.6rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--border);
  }

  .topic-intro { color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem; }

  .tag-row { margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }

  .tag {
    display: inline-block;
    padding: 0.18rem 0.6rem;
    border-radius: 999px;
    font-size: 0.73rem;
    font-weight: 600;
  }

  .tag.when { background: rgba(88,166,255,0.1); color: #79c0ff; border: 1px solid rgba(88,166,255,0.2); }

  .topic-card h3 {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin: 1.1rem 0 0.5rem;
  }

  .topic-card ol, .topic-card ul {
    padding-left: 1.3rem;
    font-size: 0.88rem;
    color: var(--text);
  }

  .topic-card li { margin-bottom: 0.35rem; }
  .topic-card strong { color: var(--text); }

  .pro-con-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin: 0.75rem 0;
  }

  .pro-box, .con-box {
    border-radius: 8px;
    padding: 0.85rem 1rem;
    font-size: 0.83rem;
  }

  .pro-box { background: rgba(63,185,80,0.07); border: 1px solid rgba(63,185,80,0.2); }
  .con-box { background: rgba(248,81,73,0.07); border: 1px solid rgba(248,81,73,0.2); }

  .pro-box h4 { color: var(--green); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.4rem; }
  .con-box h4 { color: var(--red); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.4rem; }
  .pro-box ul, .con-box ul { padding-left: 1rem; color: var(--text); }
  .pro-box li, .con-box li { margin-bottom: 0.2rem; }

  .cmp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    margin: 0.75rem 0;
  }

  .cmp-table th {
    background: #1c2333;
    color: var(--muted);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.68rem;
    letter-spacing: 0.07em;
    padding: 0.65rem 0.9rem;
    text-align: left;
    border-bottom: 2px solid var(--border);
  }

  .cmp-table td {
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  .cmp-table tr:hover td { background: rgba(88,166,255,0.03); }

  .yes { color: var(--green); font-weight: 700; }
  .no  { color: var(--red); }
  .dash { color: var(--muted); }
  .check { color: var(--green); font-weight: 700; }

  .formula-block {
    background: #0d1f38;
    border-left: 3px solid var(--accent);
    padding: 0.9rem 1.2rem;
    border-radius: 0 8px 8px 0;
    margin: 0.9rem 0;
    overflow-x: auto;
  }

  .formula-label { color: var(--muted); font-size: 0.78rem; margin-top: 0.4rem; }

  .gotcha {
    background: rgba(210,153,34,0.09);
    border-left: 3px solid var(--amber);
    padding: 0.7rem 1rem;
    border-radius: 0 8px 8px 0;
    margin: 0.9rem 0;
    font-size: 0.86rem;
    color: #e3b341;
  }

  .tip {
    background: rgba(88,166,255,0.07);
    border-left: 3px solid var(--primary);
    padding: 0.7rem 1rem;
    border-radius: 0 8px 8px 0;
    margin: 0.9rem 0;
    font-size: 0.86rem;
    color: #79c0ff;
  }

  pre {
    margin: 0.85rem 0;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.8rem;
    border: 1px solid var(--border);
  }

  code:not(pre code) {
    background: rgba(110,118,129,0.15);
    padding: 0.1em 0.4em;
    border-radius: 4px;
    font-size: 0.83em;
    color: #ff7b72;
  }

  .formula-entry {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.1rem 1.4rem;
    margin-bottom: 1rem;
  }

  .formula-entry h4 { font-size: 0.9rem; color: var(--primary); margin-bottom: 0.6rem; }

  .formula-display {
    background: #0d1f38;
    border-radius: 8px;
    padding: 0.7rem 1rem;
    margin-bottom: 0.4rem;
    overflow-x: auto;
  }

  .formula-entry p { font-size: 0.82rem; color: var(--muted); margin-top: 0.25rem; }

  .code-entry { margin-bottom: 1.75rem; }
  .code-entry h4 { font-size: 0.88rem; color: var(--primary); margin-bottom: 0.4rem; font-weight: 600; }

  #back-to-top {
    display: none;
    position: fixed;
    bottom: 2rem; right: 2rem;
    width: 40px; height: 40px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    z-index: 100;
    transition: background 0.2s;
  }

  #back-to-top:hover { background: var(--primary); }
  #back-to-top svg { width: 18px; height: 18px; }

  

  

            `}</style>
    </div >
  );
}

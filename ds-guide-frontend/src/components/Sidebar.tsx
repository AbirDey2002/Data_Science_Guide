'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ── Section maps per route ──
const SECTION_MAP: Record<string, { id: string; label: string }[]> = {
  '/data-science/eda': [
    { id: 'what-is-eda', label: 'What is EDA' },
    { id: 'where-eda', label: 'Where We Do EDA' },
    { id: 'structure', label: 'Data Shape & Structure' },
    { id: 'distributions', label: 'Distributions' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'findings', label: 'Synthesizing Findings' },
  ],
  '/data-science/feature-engineering': [
    { id: 'why', label: 'Why Feature Engineering' },
    { id: 'transforms', label: 'Transformations' },
    { id: 'selection', label: 'Feature Selection' },
    { id: 'dimreduction', label: 'Dimensionality Reduction' },
    { id: 'autoencoders', label: 'Autoencoders' },
    { id: 'code-appendix', label: 'Code Reference' },
  ],
  '/data-science/statistical-testing': [
    { id: 'foundations', label: 'Foundations' },
    { id: 'choosing-test', label: 'Choosing the Test' },
    { id: 'ztest', label: 'Z-Test' },
    { id: 'ttest', label: 'T-Test' },
    { id: 'anova', label: 'ANOVA & Tukey' },
    { id: 'chisquare', label: 'Chi-Square' },
    { id: 'power', label: 'Power Analysis' },
  ],
  '/data-science/pre-modelling': [
    { id: 'intro', label: 'What is Pre-Modelling' },
    { id: 'cp1', label: 'CP1 — Variable Relevance' },
    { id: 'cont-cont', label: 'Continuous vs Continuous' },
    { id: 'cat-cont', label: 'Categorical vs Continuous' },
    { id: 'cat-cat', label: 'Categorical vs Categorical' },
    { id: 'cp2', label: 'CP2 — Distributions' },
    { id: 'normality', label: 'Normality Testing' },
    { id: 'homoscedasticity', label: 'Homoscedasticity' },
    { id: 'linearity', label: 'Linearity' },
    { id: 'cp3', label: 'CP3 — Relationships' },
    { id: 'interactions', label: 'Interactions' },
    { id: 'confounding', label: 'Confounding' },
    { id: 'cp4', label: 'CP4 — Target Behaviour' },
    { id: 'target-dist', label: 'Target Distribution' },
    { id: 'imbalance', label: 'Class Imbalance' },
    { id: 'outliers', label: 'Target Outliers' },
    { id: 'leakage', label: 'Target Leakage' },
  ],
  '/data-science/numpy-pandas': [
    { id: 'why', label: 'Why NumPy & Pandas' },
    { id: 'numpy-arrays', label: 'NumPy Arrays' },
    { id: 'vectorized', label: 'Vectorized Ops' },
    { id: 'convert', label: 'Pandas ↔ NumPy' },
    { id: 'dataframes', label: 'DataFrames & Series' },
    { id: 'cleaning', label: 'Data Cleaning' },
    { id: 'groupby', label: 'GroupBy & Aggregation' },
    { id: 'stats-map', label: 'Statistical Testing Map' },
    { id: 'np-ttest', label: 'T-Test' },
    { id: 'np-anova', label: 'ANOVA + Tukey' },
    { id: 'correlation', label: 'Correlation' },
    { id: 'formula-sheet', label: 'Formula Sheet' },
    { id: 'code-appendix', label: 'Code Appendix' },
  ],
  '/data-science/ml-models': [
    { id: 'why-train', label: 'Why We Train' },
    { id: 'bias-variance', label: 'Bias-Variance' },
    { id: 'loss-functions', label: 'Loss Functions' },
    { id: 'gradient-descent', label: 'Gradient Descent' },
    { id: 'regularisation', label: 'Regularisation' },
    { id: 'splits-cv', label: 'Train/Val/Test + CV' },
    { id: 'data-leakage', label: 'Data Leakage' },
    { id: 'evaluation', label: 'Evaluation Metrics' },
    { id: 'hyperparameter', label: 'Hyperparameter Tuning' },
    { id: 'scratch-linear', label: 'Linear Regression' },
    { id: 'scratch-logistic', label: 'Logistic Regression' },
    { id: 'scratch-knn', label: 'KNN' },
    { id: 'scratch-tree', label: 'Decision Tree' },
    { id: 'scratch-naive', label: 'Naive Bayes' },
    { id: 'random-forest', label: 'Random Forest' },
    { id: 'xgboost', label: 'XGBoost' },
    { id: 'gradient-boosting', label: 'GBM & AdaBoost' },
    { id: 'svm', label: 'SVM' },
    { id: 'kmeans', label: 'K-Means' },
    { id: 'dbscan', label: 'DBSCAN' },
    { id: 'hierarchical', label: 'Hierarchical' },
    { id: 'clustering-compare', label: 'Clustering Compare' },
    { id: 'formula-sheet', label: 'Formula Sheet' },
    { id: 'model-summary', label: 'Model Summary' },
  ],
  '/data-science/deep-learning': [
    { id: 'mlp', label: 'MLP' },
    { id: 'forward-pass', label: 'Forward Pass' },
    { id: 'relu', label: 'ReLU Activation' },
    { id: 'backprop', label: 'Backpropagation' },
    { id: 'adam', label: 'Adam Optimizer' },
    { id: 'dropout', label: 'Dropout' },
    { id: 'early-stopping', label: 'Early Stopping' },
    { id: 'cnn-intro', label: 'Why CNNs' },
    { id: 'convolution', label: 'Convolution' },
    { id: 'pooling', label: 'Pooling' },
    { id: 'channels', label: 'Channels' },
    { id: 'resnet', label: 'ResNet' },
    { id: 'transfer', label: 'Transfer Learning' },
    { id: 'rnn', label: 'RNN' },
    { id: 'lstm', label: 'LSTM' },
    { id: 'gru', label: 'GRU' },
    { id: 'attention', label: 'Attention' },
    { id: 'transformer-arch', label: 'Architecture' },
    { id: 'add-norm', label: 'Add & Norm' },
    { id: 'pos-enc', label: 'Positional Encoding' },
    { id: 'masked-attn', label: 'Masked Attention' },
    { id: 'bert', label: 'BERT' },
    { id: 'gpt', label: 'GPT' },
    { id: 't5', label: 'T5' },
    { id: 'pretrain', label: 'Pre-training' },
    { id: 'loss-functions', label: 'Loss Functions' },
    { id: 'optimizers', label: 'Optimizers' },
    { id: 'evaluation-metrics', label: 'Evaluation Metrics' },
    { id: 'dl-formula-sheet', label: 'Formula Sheet' },
    { id: 'dl-code-appendix', label: 'Code Appendix' },
  ],
  '/data-science/langchain': [
    { id: 'install', label: 'Install Reference' },
    { id: 'rag-pipeline', label: 'RAG Pipeline Overview' },
    { id: 'splitters', label: 'All LangChain Text Splitters' },
    { id: 'embeddings', label: 'Google Generative AI Embeddings' },
    { id: 'vector-stores', label: 'Vector Stores — Full Comparison' },
    { id: 'faiss-indexes', label: 'FAISS Index Types' },
    { id: 'retrieval-methods', label: 'Keyword, Semantic & Hybrid Retrieval' },
    { id: 'retrieval-improvement', label: 'Retrieval Improvement Techniques' },
    { id: 'rerankers', label: 'All Rerankers' },
    { id: 'react-agents', label: 'ReAct Agents' },
    { id: 'ragas', label: 'RAGAS — RAG Evaluation Framework' },
    { id: 'ragas-metrics', label: 'RAGAS Metrics Explained' },
    { id: 'concept-table', label: 'All Concepts at a Glance' },
    { id: 'formula-sheet', label: 'Formula Reference Sheet' },
    { id: 'code-appendix', label: 'Code Reference' },
  ],
  '/data-science/projects/nl-to-sql': [
    { id: 'situation', label: 'Situation' },
    { id: 'task', label: 'Task' },
    { id: 'action', label: 'Action' },
    { id: 'result', label: 'Result' },
    { id: 'eda', label: 'EDA vs. Feature Selection' },
    { id: 'pos-tagging', label: 'POS Tagging' },
    { id: 'mi-scoring', label: 'MI Scoring' },
    { id: 'templatization', label: 'SQL Templatization' },
    { id: 'retrieval', label: 'Retrieval + Slot Filling' },
    { id: 'fallback', label: 'Fallback & Error' },
    { id: 'infra', label: 'Infrastructure' },
    { id: 'concept-table', label: 'All Concepts' },
    { id: 'code-appendix', label: 'Code Appendix' },
    { id: 'interview-qa', label: 'Interview Q&A' },
  ],
  '/data-science/projects/onboarding-ea': [
    { id: 'situation', label: 'Situation' },
    { id: 'task', label: 'Task' },
    { id: 'action', label: 'Action' },
    { id: 'result', label: 'Result' },
    { id: 'classifier', label: 'Document Classifier' },
    { id: 'ocr', label: 'OCR + Confidence' },
    { id: 'validation', label: 'Pydantic Validation' },
    { id: 'anomaly', label: 'Anomaly Detection' },
    { id: 'entity-resolution', label: 'Fuzzy Entity Resolution' },
    { id: 'hitl', label: 'HITL Review Loop' },
    { id: 'mapping', label: 'KYC ISO Mapping' },
    { id: 'concept-table', label: 'All Concepts' },
    { id: 'code-appendix', label: 'Code Appendix' },
    { id: 'interview-qa', label: 'Interview Q&A' },
  ],
  '/data-science/projects/pixel-perfect': [
    { id: 'situation', label: 'Situation' },
    { id: 'task', label: 'Task' },
    { id: 'action', label: 'Action' },
    { id: 'result', label: 'Result' },
    { id: 'capture', label: 'Screenshot Capture' },
    { id: 'figma', label: 'Figma Extraction' },
    { id: 'scaling', label: 'Frame Scaling' },
    { id: 'ssim-routing', label: 'SSIM Routing Gate' },
    { id: 'full-image', label: 'Full-Image LLM Path' },
    { id: 'sliding-window', label: 'Sliding Window' },
    { id: 'ssim-masking', label: 'SSIM Masking' },
    { id: 'classification', label: 'Issue Classification' },
    { id: 'aggregation', label: 'LLM Aggregation' },
    { id: 'concept-table', label: 'All Concepts' },
    { id: 'code-appendix', label: 'Code Appendix' },
    { id: 'interview-qa', label: 'Interview Q&A' },
  ],
  '/data-science/projects/tcg': [
    { id: 'situation', label: 'Situation' },
    { id: 'task', label: 'Task' },
    { id: 'action', label: 'Action' },
    { id: 'result', label: 'Result' },
    { id: 'ingestion', label: 'Document Ingestion' },
    { id: 'extraction', label: 'Requirement Extraction' },
    { id: 'criticality', label: 'Criticality Classifier' },
    { id: 'rag', label: 'RAG + Reranker' },
    { id: 'generation', label: 'Test Case Generation' },
    { id: 'bertscore', label: 'Coverage Fidelity' },
    { id: 'dedup', label: 'Cross-Scenario Dedup' },
    { id: 'concept-table', label: 'All Concepts' },
    { id: 'code-appendix', label: 'Code Appendix' },
    { id: 'interview-qa', label: 'Interview Q&A' },
  ],
};

const NAV_ITEMS = [
  { name: 'Overview', href: '/data-science' },
  { name: 'Exploratory Data Analysis', href: '/data-science/eda' },
  { name: 'Feature Engineering', href: '/data-science/feature-engineering' },
  { name: 'Statistical Testing', href: '/data-science/statistical-testing' },
  { name: 'Pre-Modelling', href: '/data-science/pre-modelling' },
  { name: 'NumPy & Pandas', href: '/data-science/numpy-pandas' },
  { name: 'ML Models', href: '/data-science/ml-models' },
  { name: 'Deep Learning', href: '/data-science/deep-learning' },
  { name: 'LangChain & RAG', href: '/data-science/langchain' },
  { name: 'NL-to-SQL Project', href: '/data-science/projects/nl-to-sql' },
  { name: 'Onboarding EA Project', href: '/data-science/projects/onboarding-ea' },
  { name: 'Pixel Perfect Project', href: '/data-science/projects/pixel-perfect' },
  { name: 'TCG Project', href: '/data-science/projects/tcg' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  const sections = SECTION_MAP[pathname] || [];

  // Auto-expand current page's sections
  useEffect(() => {
    if (SECTION_MAP[pathname]) {
      setExpandedRoute(pathname);
    }
  }, [pathname]);

  // Scroll-spy: highlight the current section
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname, sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="sidebar-brand">
          <span className="brand-name">Data Science</span>
          <span className="brand-sub">Study Guide</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isExpanded = expandedRoute === item.href;
          const itemSections = SECTION_MAP[item.href] || [];
          const hasSections = itemSections.length > 0;

          return (
            <div key={item.href} className="nav-group">
              <Link
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => hasSections && setExpandedRoute(isExpanded ? null : item.href)}
              >
                <span className="nav-label">{item.name}</span>
                {hasSections && (
                  <ChevronDown size={14} className={`chevron ${isExpanded ? 'open' : ''}`} />
                )}
              </Link>

              {/* Sub-topic anchors */}
              {isExpanded && hasSections && (
                <div className="sub-links">
                  {itemSections.map((sec) => (
                    <button
                      key={sec.id}
                      className={`sub-link ${activeSection === sec.id ? 'sub-active' : ''}`}
                      onClick={() => scrollToSection(sec.id)}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <style jsx>{`
                .sidebar {
                    width: 272px;
                    flex-shrink: 0;
                    background: #010409;
                    border-right: 1px solid var(--color-border);
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .sidebar-header {
                    padding: 1.1rem 1.15rem;
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    border-bottom: 1px solid var(--color-border);
                    flex-shrink: 0;
                }

                .logo-box {
                    background: linear-gradient(135deg, #6c8cff, #bc8cff);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .sidebar-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .brand-name {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: var(--color-text-main);
                    line-height: 1.2;
                }

                .brand-sub {
                    font-size: 0.68rem;
                    color: var(--color-text-subtle);
                    font-weight: 500;
                }

                .sidebar-nav {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.75rem 0.6rem;
                }

                .nav-group {
                    margin-bottom: 2px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.5rem 0.65rem;
                    color: var(--color-text-subtle);
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    transition: all 0.15s ease;
                    cursor: pointer;
                }

                .nav-link:hover {
                    background: rgba(255,255,255,0.04);
                    color: var(--color-text-main);
                    text-decoration: none;
                }

                .nav-link.active {
                    background: var(--color-primary-light);
                    color: var(--color-primary);
                    font-weight: 600;
                }

                .step-num {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--color-border);
                    color: var(--color-text-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.65rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .step-active {
                    background: var(--color-primary);
                    color: white;
                }

                .nav-icon {
                    width: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.6;
                }

                .nav-link.active .nav-icon {
                    opacity: 1;
                }

                .nav-label {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .chevron {
                    color: var(--color-text-subtle);
                    opacity: 0.5;
                    transition: transform 0.2s ease;
                    flex-shrink: 0;
                }

                .chevron.open {
                    transform: rotate(180deg);
                }

                .sub-links {
                    padding: 0.25rem 0 0.25rem 2.4rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    border-left: 1px solid var(--color-border);
                    margin-left: 1.3rem;
                    margin-bottom: 0.25rem;
                }

                .sub-link {
                    background: none;
                    border: none;
                    text-align: left;
                    padding: 0.3rem 0.6rem;
                    font-size: 0.75rem;
                    color: var(--color-text-subtle);
                    cursor: pointer;
                    border-radius: 4px;
                    font-family: inherit;
                    transition: all 0.12s ease;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .sub-link:hover {
                    color: var(--color-text-main);
                    background: rgba(255,255,255,0.03);
                }

                .sub-active {
                    color: var(--color-primary) !important;
                    background: var(--color-primary-light) !important;
                    font-weight: 600;
                }
            `}</style>
    </aside>
  );
}

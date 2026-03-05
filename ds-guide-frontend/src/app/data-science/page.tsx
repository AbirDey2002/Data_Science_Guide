'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TOPICS = [
  {
    title: 'Exploratory Data Analysis',
    abbr: 'EDA',
    description: 'Understand your data — distributions, relationships, quality, anomalies.',
    href: '/data-science/eda',
    accent: '#58a6ff',
  },
  {
    title: 'Feature Engineering',
    abbr: 'FE',
    description: 'Transform raw data into model-ready predictors. Encoding, scaling, PCA.',
    href: '/data-science/feature-engineering',
    accent: '#56d364',
  },
  {
    title: 'Statistical Testing',
    abbr: 'ST',
    description: 'Separate signal from noise. Hypothesis tests, p-values, effect sizes.',
    href: '/data-science/statistical-testing',
    accent: '#bc8cff',
  },
  {
    title: 'Pre-Modelling',
    abbr: 'PM',
    description: 'Final gate before training. Assumptions, multicollinearity, leakage.',
    href: '/data-science/pre-modelling',
    accent: '#d29922',
  },
  {
    title: 'NumPy & Pandas',
    abbr: 'NP',
    description: 'Core data manipulation — arrays, DataFrames, GroupBy, statistical testing in code.',
    href: '/data-science/numpy-pandas',
    accent: '#3fb950',
  },
  {
    title: 'ML Models',
    abbr: 'ML',
    description: 'From-scratch + sklearn pipelines. Linear, tree, ensemble, clustering, tuning.',
    href: '/data-science/ml-models',
    accent: '#bc8cff',
  },
  {
    title: 'Deep Learning',
    abbr: 'DL',
    description: 'MLP → CNN → RNN/LSTM → Transformers. Architecture, formulas, PyTorch code.',
    href: '/data-science/deep-learning',
    accent: '#f85149',
  },
  {
    title: 'NL-to-SQL Project',
    abbr: 'P1',
    description: 'NL-to-SQL Intelligent Query Engine — spaCy, Weaviate, retrieval + slot filling.',
    href: '/data-science/projects/nl-to-sql',
    accent: '#2f81f7',
  },
  {
    title: 'Onboarding EA Project',
    abbr: 'P2',
    description: 'Onboarding Expert Agent — OCR, document classification, fuzzy entity resolution, HITL.',
    href: '/data-science/projects/onboarding-ea',
    accent: '#3fb950',
  },
  {
    title: 'Pixel Perfect Project',
    abbr: 'P4',
    description: 'UI Visual Regression Testing — SSIM, sliding window, Playwright DOM capture.',
    href: '/data-science/projects/pixel-perfect',
    accent: '#d29922',
  },
  {
    title: 'TCG Project',
    abbr: 'P3',
    description: 'Test Case Generation Agent — RAG, BERTScore, cross-scenario deduplication.',
    href: '/data-science/projects/tcg',
    accent: '#bc8cff',
  },
];

export default function DataScienceHome() {
  return (
    <div>
      <div className="hero">
        <div className="hero-label">Study Guide</div>
        <h1>Data Science Guide</h1>
        <p className="hero-desc">
          A structured, step-by-step framework for the complete pre-modelling data science workflow.
          Follow the sequence — each module builds on the previous one.
        </p>
      </div>


      {/* TOC as a proper table */}
      <div className="toc-table-wrap">
        <table className="toc-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Description</th>
              <th style={{ width: '48px' }}></th>
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((topic) => (
              <tr key={topic.abbr} className="toc-row">
                <td>
                  <Link href={topic.href} className="row-title" style={{ color: topic.accent }}>
                    {topic.title}
                  </Link>
                </td>
                <td className="row-desc">{topic.description}</td>
                <td>
                  <Link href={topic.href} className="row-go" style={{ color: topic.accent }}>
                    <ArrowRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
                .hero-desc {
                    font-size: 1.05rem;
                    color: var(--color-text-subtle);
                    max-width: 600px;
                    line-height: 1.7;
                }

                .pipeline {
                    display: flex;
                    align-items: center;
                    gap: 0.15rem;
                    margin-bottom: 2rem;
                    padding: 0.85rem 1.25rem;
                    background: var(--color-bg-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                }

                .pipe-item {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .pipe-num {
                    font-weight: 800;
                    font-size: 0.9rem;
                }

                .pipe-name {
                    font-size: 0.75rem;
                    color: var(--color-text-subtle);
                    font-weight: 600;
                    letter-spacing: 0.03em;
                }

                .pipe-arrow {
                    color: var(--color-border);
                    margin: 0 0.6rem;
                    font-size: 0.85rem;
                }

                .toc-table-wrap {
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .toc-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .toc-table th {
                    background: var(--color-bg-surface-hover);
                    color: var(--color-text-subtle);
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    padding: 0.65rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--color-border);
                }

                .toc-row td {
                    padding: 1rem;
                    border-bottom: 1px solid var(--color-border-light);
                    vertical-align: middle;
                }

                .toc-row:last-child td {
                    border-bottom: none;
                }

                .toc-row:hover td {
                    background: rgba(108, 140, 255, 0.03);
                }

                .row-num {
                    width: 28px;
                    height: 28px;
                    border: 2px solid;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.8rem;
                }

                .row-title {
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-decoration: none;
                    transition: opacity 0.15s;
                }

                .row-title:hover {
                    opacity: 0.8;
                    text-decoration: none;
                }

                .row-desc {
                    font-size: 0.85rem;
                    color: var(--color-text-subtle);
                    line-height: 1.5;
                }

                .row-go {
                    display: flex;
                    align-items: center;
                    opacity: 0.4;
                    transition: opacity 0.15s;
                }

                .toc-row:hover .row-go {
                    opacity: 1;
                }
            `}</style>
    </div>
  );
}

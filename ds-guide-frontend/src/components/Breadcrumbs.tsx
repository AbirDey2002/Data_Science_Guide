'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const formatSegment = (segment: string) => {
    if (segment === 'eda') return 'EDA';
    return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Filter out empty segments
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = '/' + segments.slice(0, index + 1).join('/');
                    const label = formatSegment(segment);

                    return (
                        <li key={href} className="breadcrumb-item">
                            {isLast ? (
                                <span className="breadcrumb-active">{label}</span>
                            ) : (
                                <Link href={href} className="breadcrumb-link">
                                    {label}
                                </Link>
                            )}
                            {!isLast && <ChevronRight size={14} className="breadcrumb-separator" />}
                        </li>
                    );
                })}
            </ol>

            <style jsx>{`
        .breadcrumbs {
          margin-bottom: 1.5rem;
        }
        .breadcrumbs ol {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin: 0;
        }
        .breadcrumb-link {
          color: var(--color-text-subtle);
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .breadcrumb-link:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
        .breadcrumb-separator {
          color: var(--color-text-subtle);
          opacity: 0.6;
        }
        .breadcrumb-active {
          color: var(--color-text-main);
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>
        </nav>
    );
}

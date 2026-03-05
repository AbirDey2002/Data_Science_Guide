'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
            {visible && (
                <button className="scroll-top-btn" onClick={scrollUp} aria-label="Scroll to top">
                    <ArrowUp size={18} />
                </button>
            )}
            <style jsx>{`
                .scroll-top-btn {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 14px rgba(108, 140, 255, 0.35);
                    transition: all 0.2s ease;
                    z-index: 100;
                }
                .scroll-top-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(108, 140, 255, 0.5);
                }
            `}</style>
        </>
    );
}

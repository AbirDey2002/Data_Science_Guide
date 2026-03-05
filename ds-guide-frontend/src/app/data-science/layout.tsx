import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScrollToTop from '@/components/ScrollToTop';

export default function DataScienceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="page-wrapper">
                    <Breadcrumbs />
                    {children}
                </div>
            </main>
            <ScrollToTop />
        </div>
    );
}

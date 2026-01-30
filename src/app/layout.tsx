import type { Metadata, Viewport } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypeScript Teacher',
  description: 'Learn TypeScript interactively with hands-on lessons and real-time code execution',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar (desktop) and mobile header handled by NavBar */}
            <NavBar />

            {/* Main content area with header */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Header */}
              <Header />

              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import NavBar from '@/components/NavBar';
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
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar (desktop) and mobile header handled by NavBar */}
          <NavBar />

          {/* Main content area with header */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="hidden lg:flex flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📘</span>
                <h1 className="text-xl font-bold text-slate-800">Learn TypeScript</h1>
              </div>
              <div className="text-sm text-slate-500">
                Interactive lessons with hands-on practice
              </div>
            </header>

            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

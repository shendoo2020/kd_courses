"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount and when localStorage changes
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    checkAuth();
    
    // Add event listener for cross-tab login/logout
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <html lang="en">
      <head>
        <title>KDCourses | Premium Learning Platform</title>
        <meta name="description" content="Learn without limits with KDCourses." />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white font-bold text-xl">K</div>
                  <span className="font-bold text-xl text-slate-900 tracking-tight">KDCourses</span>
                </Link>
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <Link href="/" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">Catalog</Link>
                  <Link href="/dashboard" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">My Learning</Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-600">Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">Sign in</Link>
                    <Link href="/register" className="btn-primary py-2 px-4 text-sm">Join for Free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center text-white font-bold text-sm">K</div>
                <span className="text-white font-semibold tracking-tight">KDCourses</span>
              </div>
              <p className="text-slate-400 text-sm">© 2026 KDCourses. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

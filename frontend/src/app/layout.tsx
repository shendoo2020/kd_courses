"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    checkAuth();
    
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
        <title>KLZ Academy | Learn Without Limits</title>
        <meta name="description" content="Build skills with premier online courses from KLZ Academy." />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-light text-slate-800 antialiased font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm">
                    K
                  </div>
                  <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                    KLZ <span className="text-brand-600 font-medium">Academy</span>
                  </span>
                </Link>
                <nav className="hidden md:ml-10 md:flex md:space-x-8">
                  <Link href="/" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-semibold transition-colors">Catalog</Link>
                  <Link href="/dashboard" className="text-slate-600 hover:text-brand-600 px-3 py-2 text-sm font-semibold transition-colors">My Learning</Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-brand-600">Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-600">Sign in</Link>
                    <Link href="/register" className="btn-primary py-2 px-5 text-sm font-semibold">Join for Free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              
              {/* Brand & About */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white font-black text-lg">K</div>
                  <span className="text-white font-extrabold text-xl tracking-tight">KLZ <span className="text-brand-400 font-medium">Academy</span></span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Empowering ambitious learners worldwide with high-impact, industry-certified education, cutting-edge labs, and mentor-guided courses.
                </p>
                <div className="text-xs text-slate-500">
                  © 2026 KLZ Academy. All rights reserved.
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
                <ul className="space-y-2.5 text-sm">
                  <li><Link href="/" className="hover:text-white transition-colors">Course Catalog</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
                  <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Instructor Portal</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Become a Student</Link></li>
                </ul>
              </div>

              {/* Contact Support */}
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Support</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 text-slate-400">
                    <Mail size={18} className="text-brand-400 shrink-0 mt-0.5" />
                    <span>support@klzacademy.com</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <Phone size={18} className="text-brand-400 shrink-0 mt-0.5" />
                    <span>+1 (800) 559-0192</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <MapPin size={18} className="text-brand-400 shrink-0 mt-0.5" />
                    <span>Academic Tower, 5th Ave, Tech District</span>
                  </li>
                </ul>
              </div>

              {/* Follow & Community */}
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Follow Us</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Join our community of over 50,000 learners across our social channels.
                </p>
                <div className="flex gap-3">
                  <a 
                    href="https://wa.me/" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="WhatsApp" 
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-green-400 hover:border-green-500 transition-colors"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Facebook" 
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500 transition-colors"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Instagram" 
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500 transition-colors"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="LinkedIn" 
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-300 hover:border-blue-400 transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LogOut, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, 
  Sun, Moon, User, LayoutDashboard, Award, Shield, ChevronDown
} from "lucide-react";
import { api } from "@/lib/api";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isClassroom = pathname?.includes("/learn");

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Sync authentication and fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      if (token) {
        try {
          const res = await api.get("/users");
          setUserProfile(res.data);
        } catch (e) {
          console.error("Failed to fetch user profile", e);
        }
      } else {
        setUserProfile(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""}>
      <head>
        <title>KLZ Academy | Learn Without Limits</title>
        <meta name="description" content="Build skills with premier online courses from KLZ Academy." />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-light dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
        
        {/* Navigation Bar (Hidden on mobile when inside classroom to maximize screen area - Bug 4) */}
        <header className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-200 ${isClassroom ? 'hidden md:block' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Brand Logo & Main Nav */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">
                    K
                  </div>
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                    KLZ <span className="text-brand-600 dark:text-brand-400 font-medium">Academy</span>
                  </span>
                </Link>

                <nav className="hidden md:flex md:space-x-4">
                  <Link 
                    href="/" 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-semibold transition-colors"
                  >
                    Catalog
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-semibold transition-colors"
                  >
                    My Learning
                  </Link>
                </nav>
              </div>

              {/* Action Controls & Profile Menu */}
              <div className="flex items-center gap-3 sm:gap-4">
                
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Dark Mode"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                </button>

                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    {/* User Profile Avatar Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 bg-white dark:bg-slate-800 transition-all focus:outline-none"
                    >
                      <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                        {userProfile?.name || "Student"}
                      </span>
                      {userProfile?.avatarUrl ? (
                        <img 
                          src={userProfile.avatarUrl} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {getInitials(userProfile?.name || "User")}
                        </div>
                      )}
                      <ChevronDown size={14} className="text-slate-400 pr-0.5" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User Identity Header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {userProfile?.name || "Student"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1.5">
                            {userProfile?.email || ""}
                          </p>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                            {userProfile?.role || "STUDENT"}
                          </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-1 text-sm font-medium">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <LayoutDashboard size={16} className="text-brand-500" />
                            <span>My Learning Hub</span>
                          </Link>

                          <Link
                            href="/dashboard/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <User size={16} className="text-brand-500" />
                            <span>Profile & Settings</span>
                          </Link>

                          {(userProfile?.role === "INSTRUCTOR" || userProfile?.role === "ADMIN") && (
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-amber-600 dark:text-amber-400"
                            >
                              <Shield size={16} />
                              <span>Instructor Portal</span>
                            </Link>
                          )}
                        </div>

                        {/* Footer: Theme Toggle & Logout */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                          <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <span className="flex items-center gap-2.5">
                              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
                              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {isDarkMode ? "Active" : "Off"}
                            </span>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <LogOut size={16} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/login" 
                      className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/register" 
                      className="btn-primary py-2 px-4 sm:px-5 text-sm font-semibold shadow-sm"
                    >
                      Join for Free
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* Main Workspace Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Footer (Hidden in Interactive Classroom to maximize focus and mobile screen area) */}
        {!isClassroom && (
          <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
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
        )}
      </body>
    </html>
  );
}

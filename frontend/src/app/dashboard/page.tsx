"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BookOpen, PlayCircle, Trophy, User, Heart, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"enrolled" | "wishlist">("enrolled");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [enrollRes, wishRes] = await Promise.all([
        api.get("/enrollments/dashboard"),
        api.get("/users/wishlist")
      ]);
      setEnrollments(enrollRes.data);
      setWishlist(wishRes.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Please sign in to view your learning dashboard.");
      } else {
        setError("Failed to load dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const removeFromWishlist = async (courseId: string) => {
    try {
      await api.delete(`/users/wishlist/${courseId}`);
      setWishlist(wishlist.filter(item => item.courseId !== courseId));
    } catch (err) {
      alert("Failed to remove item from wishlist");
    }
  };

  return (
    <div className="bg-surface-muted min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Learning Hub</h1>
            <p className="text-slate-600 mt-1">Access your ongoing coursework and bookmarked programs.</p>
          </div>
          <Link href="/dashboard/profile" className="btn-secondary flex items-center gap-2 text-sm font-semibold">
            <User size={18} /> Public Profile & Certificates
          </Link>
        </header>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-4">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "enrolled" 
                ? "border-brand-600 text-brand-600" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen size={18} /> My Enrolled Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "wishlist" 
                ? "border-brand-600 text-brand-600" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Heart size={18} /> Saved Wishlist ({wishlist.length})
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl shadow-sm animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 text-red-700 px-8 py-12 rounded-2xl shadow-sm text-center">
            <Trophy className="mx-auto text-red-300 mb-4 h-12 w-12" />
            <p className="text-lg font-bold mb-4">{error}</p>
            <Link href="/login" className="btn-primary">Go to Login</Link>
          </div>
        ) : activeTab === "enrolled" ? (
          /* ENROLLED COURSES VIEW */
          enrollments.length === 0 ? (
            <div className="bg-white px-8 py-16 rounded-2xl shadow-sm text-center border border-slate-200">
              <BookOpen className="mx-auto text-slate-300 mb-4 h-16 w-16" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">No active enrollments yet</h2>
              <p className="text-slate-500 mb-6">Explore the KLZ Academy catalog and begin mastering new skills today.</p>
              <Link href="/" className="btn-primary">
                Explore Course Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md">
                  <div className="w-full sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-brand-600 to-slate-900 flex items-center justify-center shrink-0">
                    <PlayCircle size={48} className="text-white/80" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-slate-900">
                        {enrollment.course.title}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        {enrollment.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {enrollment.course.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-auto mb-4 font-medium">
                      Instructor: <span className="font-bold text-slate-800">{enrollment.course.instructor?.name || "KLZ Faculty"}</span>
                    </p>
                    
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-brand-600">Active Syllabus</span>
                      <Link href={`/courses/${enrollment.course.id}/learn`} className="btn-primary py-2 px-5 text-xs font-bold">
                        Resume Learning &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* WISHLIST VIEW */
          wishlist.length === 0 ? (
            <div className="bg-white px-8 py-16 rounded-2xl shadow-sm text-center border border-slate-200">
              <Heart className="mx-auto text-slate-300 mb-4 h-16 w-16" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-6">Save courses you are interested in taking in the future.</p>
              <Link href="/" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col p-5">
                  <h3 className="font-bold text-base text-slate-900 mb-2">{item.course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">{item.course.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-sm">
                      {item.course.price === 0 ? 'Free' : `$${item.course.price.toFixed(2)}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFromWishlist(item.course.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link href={`/courses/${item.course.id}`} className="btn-primary py-1.5 px-3 text-xs font-bold">
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

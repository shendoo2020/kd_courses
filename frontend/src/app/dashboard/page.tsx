"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BookOpen, PlayCircle, Trophy, User, Heart, Trash2, Award, ArrowRight } from "lucide-react";

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
    <div className="bg-surface-muted dark:bg-slate-950 min-h-[calc(100vh-4rem)] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Learning Hub</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Access your ongoing coursework, progress stats, and bookmarked programs.</p>
          </div>
          <Link href="/dashboard/profile" className="btn-secondary flex items-center gap-2 text-sm font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
            <User size={18} /> Public Profile & Certificates
          </Link>
        </header>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-6">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "enrolled" 
                ? "border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400" 
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen size={18} /> My Enrolled Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "wishlist" 
                ? "border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400" 
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Heart size={18} /> Saved Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-2xl shadow-sm animate-pulse border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-8 py-12 rounded-2xl shadow-sm text-center">
            <Trophy className="mx-auto text-red-300 dark:text-red-600 mb-4 h-12 w-12" />
            <p className="text-lg font-bold mb-4">{error}</p>
            <Link href="/login" className="btn-primary">Go to Login</Link>
          </div>
        )}

        {/* Enrolled Courses Tab */}
        {!isLoading && !error && activeTab === "enrolled" && (
          enrollments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 px-8 py-16 rounded-2xl shadow-sm text-center border border-slate-200 dark:border-slate-800">
              <BookOpen className="mx-auto text-slate-300 dark:text-slate-600 mb-4 h-16 w-16" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active enrollments yet</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Explore the KLZ Academy catalog and begin mastering new skills today.</p>
              <Link href="/" className="btn-primary">
                Explore Course Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map((enrollment) => {
                const progress = enrollment.progressPercentage ?? 0;
                const isCompleted = enrollment.status === "COMPLETED" || progress === 100;
                const isNotStarted = progress === 0;

                return (
                  <div 
                    key={enrollment.id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md"
                  >
                    {/* Course Banner Accent */}
                    <div className="w-full md:w-64 h-44 md:h-auto bg-gradient-to-br from-brand-600 via-brand-700 to-slate-950 flex flex-col items-center justify-center shrink-0 p-6 text-white text-center relative">
                      <PlayCircle size={44} className="text-white/80 mb-2" />
                      <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        {enrollment.course.category || "Academy"}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                            {enrollment.course.title}
                          </h3>
                          
                          {/* Completion / Status Badge (Bug 2 & 9) */}
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              <Award size={14} /> Completed (100%)
                            </span>
                          ) : isNotStarted ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Not Started (0%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                              {progress}% In Progress
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {enrollment.course.description}
                        </p>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
                          Instructor: <span className="font-bold text-slate-800 dark:text-slate-200">{enrollment.course.instructor?.name || "KLZ Faculty"}</span>
                        </p>

                        {/* Visual Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-400">Course Progress</span>
                            <span className={isCompleted ? "text-amber-600 dark:text-amber-400" : "text-brand-600 dark:text-brand-400"}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                isCompleted 
                                  ? 'bg-amber-500' 
                                  : 'bg-brand-600'
                              }`} 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Bar (Bug 9: Start Now vs Continue Learning vs Completed) */}
                      <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {enrollment.totalLessons ? (
                            <span>{enrollment.completedLessons || 0} of {enrollment.totalLessons} lessons completed</span>
                          ) : (
                            <span>Self-Paced Program</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <>
                              <Link 
                                href="/dashboard/profile"
                                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                              >
                                <Award size={14} /> View Certificate
                              </Link>
                              <Link 
                                href={`/courses/${enrollment.course.id}/learn`} 
                                className="btn-secondary py-2 px-4 text-xs font-bold dark:bg-slate-800 dark:border-slate-700"
                              >
                                Review Course &rarr;
                              </Link>
                            </>
                          ) : isNotStarted ? (
                            <Link 
                              href={`/courses/${enrollment.course.id}/learn`} 
                              className="btn-primary py-2 px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
                            >
                              <span>Start Now</span>
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <Link 
                              href={`/courses/${enrollment.course.id}/learn`} 
                              className="btn-primary py-2 px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
                            >
                              <span>Continue Learning</span>
                              <ArrowRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Wishlist Tab */}
        {!isLoading && !error && activeTab === "wishlist" && (
          wishlist.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 px-8 py-16 rounded-2xl shadow-sm text-center border border-slate-200 dark:border-slate-800">
              <Heart className="mx-auto text-slate-300 dark:text-slate-600 mb-4 h-16 w-16" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Save courses you are interested in taking in the future.</p>
              <Link href="/" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col p-5">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{item.course.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">{item.course.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/courses/${item.course.id}`} className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                      View Details &rarr;
                    </Link>
                    <button 
                      onClick={() => removeFromWishlist(item.course.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
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

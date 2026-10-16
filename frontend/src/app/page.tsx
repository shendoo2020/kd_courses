"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BookOpen, User, Search, Star, Filter } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  avgRating?: string;
  reviewCount?: number;
  instructor: { name: string };
}

const CATEGORIES = ["All", "Development", "Data Science", "Business", "Design", "Cybersecurity"];

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (priceFilter !== "all") params.append("priceType", priceFilter);

      const response = await api.get(`/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, priceFilter]);

  return (
    <div className="bg-surface-subtle dark:bg-slate-950 min-h-screen pb-24 transition-colors">
      {/* Hero Section */}
      <div className="bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-slate-950/80 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6">
            <span>Welcome to KLZ Academy</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Master the Skills that <span className="text-brand-400">Define Tomorrow</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed">
            Premier hands-on courses taught by verified industry leaders. Structured roadmaps, project labs, and recognized certificates.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-2 flex items-center gap-3 border border-slate-200 dark:border-slate-800">
            <Search className="text-slate-400 ml-3" size={22} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, skill, or course title..."
              className="flex-1 px-2 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-base bg-transparent font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Category & Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                    ? "bg-brand-600 text-white shadow-sm" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pricing Filters */}
          <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setPriceFilter("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                priceFilter === "all" 
                  ? "bg-slate-900 dark:bg-brand-600 text-white" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceFilter("free")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                priceFilter === "free" 
                  ? "bg-slate-900 dark:bg-brand-600 text-white" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Free Only
            </button>
            <button
              onClick={() => setPriceFilter("paid")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                priceFilter === "paid" 
                  ? "bg-slate-900 dark:bg-brand-600 text-white" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Paid
            </button>
          </div>

        </div>

        {/* Catalog Grid Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {selectedCategory === "All" ? "Featured Courses" : `${selectedCategory} Courses`}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{courses.length} courses available</span>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl shadow-card h-80 border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No matching courses found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Try broadening your search term or selecting a different category.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setPriceFilter("all"); }}
              className="btn-secondary text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link 
                href={`/courses/${course.id}`} 
                key={course.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-800"
              >
                <div className="h-44 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 w-full relative flex items-center justify-center">
                  <BookOpen size={44} className="text-white/60 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-white text-xs px-2.5 py-1 rounded-md font-bold tracking-wide">
                    {course.category || "Academy"}
                  </span>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User size={14} className="text-slate-400" />
                      <span>{course.instructor?.name || "KLZ Faculty"}</span>
                    </div>

                    {course.avgRating && (
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={14} fill="currentColor" />
                        <span>{course.avgRating} ({course.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center font-black text-slate-900 dark:text-white">
                    <span className="text-lg">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </span>
                    <span className="text-brand-600 dark:text-brand-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                      View Syllabus &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

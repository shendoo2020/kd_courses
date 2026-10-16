"use client";

import { useEffect, useState } from "react";
import { api, Course } from "@/lib/api";
import Link from "next/link";
import { 
  BookOpen, Search, Star, Clock, Sparkles, GraduationCap, 
  Building2, ArrowRight, ShieldCheck, Video, ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CatalogPage() {
  const { language, isRTL, t } = useLanguage();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Multi-Level Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("ALL");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const CATEGORIES = [
    { id: "All", label: language === "ar" ? "الكل" : "All" },
    { id: "Development", label: language === "ar" ? "البرمجة والتطوير" : "Development" },
    { id: "Data Science", label: language === "ar" ? "علوم البيانات والذكاء الاصطناعي" : "Data Science" },
    { id: "Business", label: language === "ar" ? "إدارة الأعمال" : "Business" },
    { id: "Design", label: language === "ar" ? "التصميم وواجهات المستخدم" : "Design" },
    { id: "Cybersecurity", label: language === "ar" ? "الأمن السيبراني" : "Cybersecurity" },
  ];

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedAudience !== "ALL") params.append("targetAudience", selectedAudience);
      if (selectedDelivery !== "ALL") params.append("deliveryMode", selectedDelivery);
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
  }, [searchTerm, selectedCategory, selectedAudience, selectedDelivery, priceFilter]);

  const getAudienceLabel = (audience?: string) => {
    switch (audience) {
      case "K12": return language === "ar" ? "المدارس (K-12)" : "K-12 Youth STEM";
      case "HIGHER_ED": return language === "ar" ? "الجامعات والمعاهد" : "University / College";
      case "PROFESSIONAL": return language === "ar" ? "المسار المهني" : "Professional";
      default: return language === "ar" ? "أكاديمي" : "Academic";
    }
  };

  const getAudienceColor = (audience?: string) => {
    switch (audience) {
      case "K12": return "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "HIGHER_ED": return "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "PROFESSIONAL": return "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800";
      default: return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-surface-subtle dark:bg-slate-950 min-h-screen pb-24 transition-colors">
      
      {/* Hero Section */}
      <div className="bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/60 via-slate-950/90 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-brand-400" />
            <span>{t.catalog.heroBadge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            {t.catalog.heroTitlePart1} <span className="text-brand-400">{t.catalog.heroTitlePart2}</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
            {t.catalog.heroDesc}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-2 flex items-center gap-3 border border-slate-200 dark:border-slate-800 mb-8">
            <Search className="text-slate-400 mx-3 shrink-0" size={22} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              className="flex-1 px-2 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm sm:text-base bg-transparent font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-3 font-semibold"
              >
                {t.catalog.clear}
              </button>
            )}
          </div>

          {/* Quick Hub Navigation Pills */}
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <Link 
              href="/custom-courses" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              <Building2 size={14} className="text-brand-400" /> {t.nav.customCourses}
            </Link>
            <Link 
              href="/events" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              <Video size={14} className="text-emerald-400" /> {t.nav.events}
            </Link>
            <Link 
              href="/teach" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              <GraduationCap size={14} className="text-amber-400" /> {t.nav.teach}
            </Link>
            <Link 
              href="/stories" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              <ShieldCheck size={14} className="text-indigo-400" /> {t.nav.stories}
            </Link>
          </div>

        </div>
      </div>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Level 1: Target Audience Group Tabs */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <GraduationCap size={16} /> {t.catalog.targetAudience}:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "ALL", label: t.catalog.allTiers, sub: language === "ar" ? "المنهج الشامل" : "Complete catalog" },
              { id: "K12", label: t.catalog.k12, sub: language === "ar" ? "الناشئة والمبتدئين" : "Youth STEM & AP Prep" },
              { id: "HIGHER_ED", label: t.catalog.higherEd, sub: language === "ar" ? "الدورات الجامعية" : "Undergrad & Graduate" },
              { id: "PROFESSIONAL", label: t.catalog.professional, sub: language === "ar" ? "المستوى الصناعي" : "Production engineering" },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedAudience(tier.id)}
                className={`p-3.5 rounded-2xl border text-left rtl:text-right transition-all ${
                  selectedAudience === tier.id
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <span className="block font-bold text-sm leading-tight">{tier.label}</span>
                <span className={`block text-[11px] mt-0.5 leading-tight ${selectedAudience === tier.id ? "text-brand-100" : "text-slate-500 dark:text-slate-400"}`}>
                  {tier.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Disciplines & Delivery Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          
          {/* Discipline Badges */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Delivery Mode & Price Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Delivery Mode */}
            <select
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              aria-label="Filter by delivery format"
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">{t.catalog.allDelivery}</option>
              <option value="SELF_PACED">{t.catalog.selfPaced}</option>
              <option value="COHORT_BASED">{t.catalog.cohortBased}</option>
              <option value="HYBRID">{t.catalog.hybrid}</option>
              <option value="IN_PERSON">{t.catalog.inPerson}</option>
            </select>

            {/* Price Segment */}
            <div className="flex items-center text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
              {[
                { id: "all", label: t.catalog.allPrices },
                { id: "free", label: t.catalog.freeOnly },
                { id: "paid", label: t.catalog.paidOnly },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPriceFilter(mode.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    priceFilter === mode.id 
                      ? "bg-brand-600 text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Catalog Grid Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.catalog.featuredCurriculum}
          </h2>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {courses.length} {t.catalog.coursesAvailable}
          </span>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl h-88 border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.catalog.noCoursesFound}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {language === "ar" ? "هل تبحث عن منهج مخصص لمؤسستك أو قسمك الأكاديمي؟" : "Need a specialized syllabus not listed in our standard catalog?"}
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { 
                  setSearchTerm(""); 
                  setSelectedCategory("All"); 
                  setSelectedAudience("ALL"); 
                  setSelectedDelivery("ALL");
                  setPriceFilter("all"); 
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.catalog.resetFilters}
              </button>
              <Link 
                href="/custom-courses" 
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-sm inline-flex items-center gap-1.5"
              >
                {t.catalog.requestCustom} {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link 
                href={`/courses/${course.id}`} 
                key={course.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200/80 dark:border-slate-800"
              >
                {/* Visual Banner */}
                <div className="h-44 bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 w-full relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-500" />
                  <BookOpen size={40} className="text-white/60 group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-white text-[11px] px-2.5 py-1 rounded-lg font-bold tracking-wide">
                    {course.category || "Development"}
                  </span>

                  {/* Target Audience Badge */}
                  <span className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 text-[10px] font-bold px-2 py-0.5 rounded-md border ${getAudienceColor(course.targetAudience)}`}>
                    {getAudienceLabel(course.targetAudience)}
                  </span>

                  {/* Delivery & Schedule Info Bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
                    <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Clock size={12} className="text-brand-300" />
                      {course.durationWeeks ? `${course.durationWeeks} ${t.catalog.weeks}` : (language === "ar" ? "تعلم ذاتي" : "Self-Paced")}
                    </span>
                    <span className="bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {course.deliveryMode ? course.deliveryMode.replace('_', ' ') : "Online"}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {course.description}
                  </p>
                  
                  {/* Instructor Credentials */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      {course.instructor?.avatarUrl ? (
                        <img 
                          src={course.instructor.avatarUrl} 
                          alt="Instructor" 
                          className="w-6 h-6 rounded-full object-cover shrink-0" 
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {course.instructor?.name ? course.instructor.name[0] : "F"}
                        </div>
                      )}
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                        {course.instructor?.name || (language === "ar" ? "هيئة التدريس" : "KLZ Faculty")}
                      </span>
                    </div>

                    {course.avgRating && (
                      <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                        <Star size={13} fill="currentColor" />
                        <span>{course.avgRating} ({course.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing & Syllabus CTA */}
                  <div className="flex justify-between items-center font-black text-slate-900 dark:text-white">
                    <span className="text-base">
                      {course.price === 0 ? t.catalog.free : `$${course.price.toFixed(2)}`}
                    </span>
                    <span className="text-brand-600 dark:text-brand-400 text-xs font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                      {t.catalog.viewSyllabus} {isRTL ? "←" : "→"}
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

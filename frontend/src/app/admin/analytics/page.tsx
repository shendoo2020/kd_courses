"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { DollarSign, Users, BookOpen, Star, TrendingUp, ArrowLeft, Loader2 } from "lucide-react";

interface AnalyticsData {
  summary: {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: string;
    overallAvgRating: string;
  };
  courses: Array<{
    id: string;
    title: string;
    price: number;
    studentCount: number;
    revenue: number;
    avgRating: string;
    modulesCount: number;
  }>;
}

export default function InstructorAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/instructor/analytics");
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load instructor analytics. Ensure you are logged in as an Instructor.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <div className="p-16 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={36} /></div>;
  if (error || !data) return <div className="p-8 text-red-600 bg-red-50 rounded-xl max-w-4xl mx-auto font-bold">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
          <ArrowLeft size={16} /> Back to Instructor Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial & Learning Analytics</h1>
        <p className="text-slate-600 mt-1">Real-time revenue, enrollment velocity, and student ratings.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={28} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</div>
            <div className="text-2xl font-black text-slate-900">${data.summary.totalRevenue}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Students</div>
            <div className="text-2xl font-black text-slate-900">{data.summary.totalStudents}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Star size={28} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Rating</div>
            <div className="text-2xl font-black text-slate-900">{data.summary.overallAvgRating} / 5.0</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Courses</div>
            <div className="text-2xl font-black text-slate-900">{data.summary.totalCourses}</div>
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <TrendingUp size={20} className="text-brand-600" />
            <h2 className="text-lg">Course Revenue Breakdown</h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{data.courses.length} courses tracked</span>
        </div>

        {data.courses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No courses published yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs">Course Title</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs">Price</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs">Students</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs">Earnings</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs">Rating</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase text-xs">Curriculum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">
                      {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {course.studentCount} enrolled
                    </td>
                    <td className="px-6 py-4 font-black text-green-700">
                      ${course.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-amber-500 font-bold">
                      ⭐ {course.avgRating}
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                      {course.modulesCount} modules
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

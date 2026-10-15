"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BookOpen, PlayCircle, Trophy } from "lucide-react";

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    instructor: { name: string };
  };
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/enrollments/dashboard");
        setEnrollments(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Please log in to view your dashboard. (Requires valid JWT in localStorage)");
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="bg-surface-muted min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
          <p className="text-slate-600 mt-2">Track your progress and resume your courses.</p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white rounded-xl shadow-sm animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 text-red-700 px-8 py-12 rounded-xl shadow-sm text-center">
            <Trophy className="mx-auto text-red-300 mb-4 h-12 w-12" />
            <p className="text-lg font-medium mb-2">{error}</p>
            <p className="text-sm text-red-500">To simulate login, use your browser console: <code className="bg-red-100 px-1 rounded">localStorage.setItem('token', 'YOUR_JWT')</code></p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white px-8 py-16 rounded-xl shadow-sm text-center border border-slate-200">
            <BookOpen className="mx-auto text-slate-300 mb-4 h-16 w-16" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">You haven't enrolled in any courses yet.</h2>
            <p className="text-slate-500 mb-6">Discover your next passion and start learning today.</p>
            <Link href="/" className="btn-primary">
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md">
                <div className="w-full sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
                  <PlayCircle size={48} className="text-brand-400" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-slate-900">
                      {enrollment.course.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {enrollment.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>
                  <p className="text-sm text-slate-500 mt-auto mb-4">
                    Instructor: <span className="font-medium text-slate-700">{enrollment.course.instructor.name}</span>
                  </p>
                  
                  {/* Progress Bar Mockup */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                    <div className="bg-brand-500 h-2 rounded-full w-1/4"></div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-brand-600">25% Complete</span>
                    <button className="btn-primary py-2 px-4 text-sm">Resume Learning</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

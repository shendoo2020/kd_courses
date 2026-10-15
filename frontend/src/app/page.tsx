"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: { name: string };
}

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-surface-subtle min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Learn without limits.
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mb-10">
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </p>
          <div className="flex space-x-4">
            <a href="#catalog" className="btn-primary bg-white text-brand-900 hover:bg-slate-100 font-semibold">
              Explore Courses
            </a>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Courses</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-card h-80"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
            {error}. Ensure the backend is running.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id} className="group flex flex-col bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-300 w-full relative">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <BookOpen size={48} className="text-brand-600" />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex items-center text-sm text-slate-600 mb-4 gap-2">
                    <User size={16} />
                    <span>{course.instructor.name}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 font-semibold text-slate-900 flex justify-between items-center">
                    <span>{course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}</span>
                    <span className="text-brand-600 text-sm group-hover:underline">View details</span>
                  </div>
                </div>
              </Link>
            ))}
            {courses.length === 0 && !isLoading && !error && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No courses available at the moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

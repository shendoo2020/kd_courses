"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Plus, Users, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  price: number;
  _count?: {
    enrollments: number;
  };
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For this prototype, we'll fetch all courses and filter on the client, 
    // but in a production app, we would add a GET /api/courses/instructor endpoint.
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (err: any) {
        setError("Failed to load instructor courses. Ensure you are logged in.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your courses and view enrollments.</p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>New Course</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse bg-white rounded-xl h-64 border border-slate-200"></div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No courses created yet</h3>
          <p className="text-slate-500 mb-6">Start sharing your knowledge by creating your first course.</p>
          <Link href="/admin/courses/new" className="btn-primary">
            Create a Course
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Course Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0 bg-brand-100 text-brand-600 rounded flex items-center justify-center font-bold">
                        {course.title.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-brand-600 hover:text-brand-900">
                      Edit Syllabus
                    </Link>
                    <Link href={`/courses/${course.id}`} className="text-slate-500 hover:text-slate-800">
                      View Public
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, User, Clock, Shield } from "lucide-react";

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  syllabus: string;
  price: number;
  instructor: { name: string; email: string; role: string };
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (err: any) {
        setError("Failed to load course details. It may not exist.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setEnrollMessage(null);
    try {
      await api.post("/enrollments", { courseId: id });
      setEnrollMessage({ type: 'success', text: "Successfully enrolled in course!" });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setEnrollMessage({ type: 'error', text: "Please log in (via API tools) to enroll." });
      } else {
        setEnrollMessage({ type: 'error', text: err.response?.data?.message || "Failed to enroll." });
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading course...</div>;
  if (error || !course) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Course Header Banner */}
      <div className="bg-slate-900 text-white pt-16 pb-24 border-b-8 border-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{course.title}</h1>
            <p className="text-lg text-slate-300 mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Instructor: <span className="text-white font-medium">{course.instructor.name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>100% Online</span>
              </div>
            </div>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl relative -bottom-16">
              <div className="text-3xl font-bold mb-6">
                {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
              </div>
              
              {enrollMessage && (
                <div className={`p-3 rounded-md text-sm mb-4 ${enrollMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {enrollMessage.text}
                </div>
              )}
              
              <button 
                onClick={handleEnroll} 
                disabled={isEnrolling || enrollMessage?.type === 'success'}
                className="btn-primary w-full text-lg py-4 mb-4"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
              </button>
              
              <p className="text-center text-sm text-slate-500 mb-4">Starts today. Lifetime access.</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-slate-700">
                  <Shield className="text-brand-500 flex-shrink-0" size={20} />
                  <span>Secure transaction guaranteed by KDCourses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted p-6 rounded-lg border border-slate-200">
                {[
                  "Master the core concepts of the subject",
                  "Build real-world projects and portfolios",
                  "Understand advanced techniques and patterns",
                  "Earn a shareable certificate upon completion"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Syllabus</h2>
              <div className="prose max-w-none text-slate-700 whitespace-pre-line border-l-4 border-brand-200 pl-6 py-2">
                {course.syllabus}
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}

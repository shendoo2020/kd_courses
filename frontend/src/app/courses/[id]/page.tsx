"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, User, Clock, Shield, Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; avatarUrl?: string };
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  syllabus: string;
  price: number;
  category?: string;
  instructor: { name: string; email: string; role: string };
  reviews?: Review[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setEnrollMessage(null);
    try {
      if (!course) return;

      // If course is paid (> $0), initiate Stripe Checkout session
      if (course.price > 0) {
        const response = await api.post("/checkout/create-checkout-session", { courseId: id });
        if (response.data.url) {
          window.location.href = response.data.url;
          return;
        }
      }

      // If free ($0), enroll directly
      await api.post("/enrollments", { courseId: id });
      setEnrollMessage({ type: 'success', text: "Successfully enrolled in course!" });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setEnrollMessage({ type: 'error', text: "Please log in to enroll." });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setEnrollMessage({ type: 'error', text: err.response?.data?.message || "Failed to enroll." });
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await api.post(`/courses/${id}/reviews`, {
        rating: Number(newRating),
        comment: newComment
      });
      setNewComment("");
      fetchCourse(); // Refresh reviews
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post review. Ensure you are enrolled!");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading course...</div>;
  if (error || !course) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Course Header Banner */}
      <div className="bg-slate-950 text-white pt-16 pb-24 border-b-8 border-brand-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-md text-xs font-bold uppercase tracking-wide mb-4">
              {course.category || "Academy Course"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">{course.title}</h1>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-400" />
                <span>Instructor: <span className="text-white font-semibold">{course.instructor.name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-brand-400" />
                <span>Self-paced, 100% Online</span>
              </div>
            </div>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white text-slate-900 rounded-2xl p-7 shadow-2xl border border-slate-100 relative -bottom-16">
              <div className="text-3xl font-black mb-6 text-slate-950">
                {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
              </div>
              
              {enrollMessage && (
                <div className={`p-3.5 rounded-lg text-sm mb-4 font-semibold ${enrollMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {enrollMessage.text}
                </div>
              )}
              
              <button 
                onClick={handleEnroll} 
                disabled={isEnrolling || enrollMessage?.type === 'success'}
                className="btn-primary w-full text-base font-bold py-4 mb-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isEnrolling ? "Processing..." : course.price > 0 ? "Enroll with Stripe Checkout" : "Enroll for Free"}
              </button>
              
              <p className="text-center text-xs text-slate-500 font-medium mb-5">Lifetime access with verifiable certificate.</p>
              
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2.5">
                  <Shield className="text-brand-600" size={18} />
                  <span>Encrypted 256-bit checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="text-green-600" size={18} />
                  <span>Access on mobile, tablet, and desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content & Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">
            
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">What you'll master</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                {[
                  "Complete fundamental and advanced architecture",
                  "Industry portfolio projects and practical labs",
                  "Automated assessments and module checkpoints",
                  "Officially recognized KLZ Academy digital certificate"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm font-medium">
                    <CheckCircle2 className="text-brand-600 shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Syllabus Overview</h2>
              <div className="prose max-w-none text-slate-700 whitespace-pre-line border-l-4 border-brand-500 pl-6 py-2 leading-relaxed bg-slate-50/50 p-4 rounded-r-xl">
                {course.syllabus}
              </div>
            </section>

            {/* Student Reviews & Ratings Section */}
            <section className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-brand-600" size={24} />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Feedback & Reviews</h2>
              </div>

              {/* Leave a review */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Enrolled in this course? Leave a review</h3>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-xs font-semibold text-slate-600">Rating:</label>
                  <select 
                    value={newRating} 
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="px-3 py-1 border border-slate-300 rounded-md text-sm font-semibold bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <textarea 
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your learning experience..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-brand-500 mb-3 bg-white"
                />
                <button type="submit" disabled={isSubmittingReview} className="btn-primary py-2 px-5 text-xs font-bold">
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              {/* Reviews List */}
              {course.reviews && course.reviews.length > 0 ? (
                <div className="space-y-4">
                  {course.reviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-slate-900">{rev.user.name}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No student reviews yet. Be the first to enroll and review!</p>
              )}
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}

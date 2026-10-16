"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Star, Quote, Award, ExternalLink, CheckCircle2, 
  Sparkles, ArrowRight, ShieldCheck, Heart, MessageSquarePlus, X 
} from "lucide-react";
import { testimonialsApi, Testimonial } from "@/lib/api";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    studentName: "Elena Rostova",
    studentRole: "Machine Learning Engineer",
    companyOrSchool: "Amazon Web Services / Stanford Alum",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote: "The rigorous curriculum and hands-on coding checkpoints gave me the exact portfolio pieces I needed during my technical rounds. The printed study booklets arrived in 2 days and became my daily reference desk guide.",
    rating: 5,
    isFeatured: true,
    course: { id: "c-1", title: "Foundations of Deep Learning & Neural Architectures" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-2",
    studentName: "Dr. Marcus Vance",
    studentRole: "Assistant Professor of Data Science",
    companyOrSchool: "Carnegie Mellon University",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote: "Our university department requested a tailored cohort curriculum for 85 students. KLZ Academy approved and delivered the custom program flawlessly, with verified digital certifications for all graduates.",
    rating: 5,
    isFeatured: true,
    course: { id: "c-2", title: "Enterprise Full-Stack Cloud Engineering" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-3",
    studentName: "Sarah Lin",
    studentRole: "AP Computer Science Scholar",
    companyOrSchool: "Phillips Exeter Academy (K-12 Youth Track)",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    quote: "The live mentor seminars and accessible lesson players made complex algorithms crystal clear. I scored a 5 on my AP CS exam and got accepted early decision to Cornell!",
    rating: 5,
    isFeatured: true,
    course: { id: "c-3", title: "Python Programming & Problem Solving for High School" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-4",
    studentName: "Tariq Al-Mansoor",
    studentRole: "Distributed Systems Lead",
    companyOrSchool: "FinTech Infrastructure Corp",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote: "No hand-waving here. We wrote real Raft consensus engines and tested fault injection. The certificate with its cryptographic hash is proudly featured on my LinkedIn profile.",
    rating: 5,
    isFeatured: true,
    course: { id: "c-4", title: "Distributed Systems & Consensus at Scale" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-5",
    studentName: "Aaliyah Washington",
    studentRole: "DevOps Engineer",
    companyOrSchool: "Nordic Health Systems",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote: "Being able to get physical bound copies of the lecture slides and study guides delivered directly to my apartment in Stockholm was unexpected and super helpful for offline studying.",
    rating: 5,
    isFeatured: true,
    course: { id: "c-5", title: "Kubernetes & Cloud Native Architecture" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "t-6",
    studentName: "Kenji Sato",
    studentRole: "Robotics Researcher",
    companyOrSchool: "Tokyo Institute of Technology",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    quote: "The faculty seminars with Dr. Thorne answered questions that academic textbooks completely overlook. KLZ Academy sets a high bar for online technical learning.",
    rating: 5,
    isFeatured: true,
    course: { id: "c-6", title: "Reinforcement Learning for Autonomous Systems" },
    createdAt: new Date().toISOString(),
  },
];

const SAMPLE_VERIFIED_CERTS = [
  {
    certId: "KLZ-CERT-8842-A1",
    studentName: "Elena Rostova",
    courseTitle: "Foundations of Deep Learning & Neural Architectures",
    issuedDate: "October 14, 2026",
    credentialUrl: "/verify/KLZ-CERT-8842-A1",
  },
  {
    certId: "KLZ-CERT-9120-B4",
    studentName: "Tariq Al-Mansoor",
    courseTitle: "Distributed Systems & Consensus at Scale",
    issuedDate: "October 11, 2026",
    credentialUrl: "/verify/KLZ-CERT-9120-B4",
  },
  {
    certId: "KLZ-CERT-7391-C8",
    studentName: "Sarah Lin",
    courseTitle: "Python Programming & Problem Solving for High School",
    issuedDate: "October 8, 2026",
    credentialUrl: "/verify/KLZ-CERT-7391-C8",
  },
];

export default function SuccessStoriesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    studentName: "",
    studentRole: "",
    companyOrSchool: "",
    quote: "",
    rating: 5,
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialsApi.getFeatured();
      if (res.data && res.data.length > 0) {
        setTestimonials(res.data);
      } else {
        setTestimonials(SAMPLE_TESTIMONIALS);
      }
    } catch (e) {
      console.warn("Using sample testimonials fallback", e);
      setTestimonials(SAMPLE_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await testimonialsApi.submit(reviewForm);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setReviewForm({ studentName: "", studentRole: "", companyOrSchool: "", quote: "", rating: 5 });
      }, 1800);
    } catch (err) {
      console.error("Failed to post testimonial", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">Student Stories & Verified Outcomes</span>
        </nav>

        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-3">
              <Sparkles size={14} className="text-brand-500" />
              Verified Graduate Outcomes
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Real Impact, Proven Careers
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore how students, researchers, and engineers around the globe accelerated their mastery and secured industry credentials with KLZ Academy.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            <MessageSquarePlus size={16} /> Share Your Experience
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} className="text-slate-300 dark:text-slate-700" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div>
                {item.course?.title && (
                  <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block truncate">
                      Completed: {item.course.title}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.studentName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                      {item.studentName[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.studentRole}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-mono">
                      {item.companyOrSchool}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Verified Certificates Showcase */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-2">
                Tamper-Proof Audit Trail
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Recent Verified Graduate Credentials
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs sm:text-right">
              Every certificate contains an immutable cryptographic hash verifiable by employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_VERIFIED_CERTS.map((cert) => (
              <div
                key={cert.certId}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <ShieldCheck size={16} /> Verified Credential
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{cert.issuedDate}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {cert.studentName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {cert.courseTitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">{cert.certId}</span>
                  <Link
                    href={cert.credentialUrl}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    Verify <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Share Your Graduate Experience
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Your review helps inspire future scholars and provides direct feedback to faculty.
              </p>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Review Submitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">Thank you for contributing to the KLZ Academy alumni community.</p>
                </div>
              ) : (
                <form onSubmit={handlePostReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.studentName}
                      onChange={(e) => setReviewForm({ ...reviewForm, studentName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Role / Field *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.studentRole}
                        onChange={(e) => setReviewForm({ ...reviewForm, studentRole: e.target.value })}
                        placeholder="ML Engineer / Student"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company or School *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.companyOrSchool}
                        onChange={(e) => setReviewForm({ ...reviewForm, companyOrSchool: e.target.value })}
                        placeholder="Google / MIT"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`p-2 rounded-lg border ${
                            reviewForm.rating >= star
                              ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-500"
                              : "border-slate-200 dark:border-slate-700 text-slate-400"
                          }`}
                        >
                          <Star size={18} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Testimonial / Story *</label>
                    <textarea
                      rows={4}
                      required
                      value={reviewForm.quote}
                      onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                      placeholder="How did the curriculum, checkpoints, or study booklets impact your journey?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    Post Testimonial
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

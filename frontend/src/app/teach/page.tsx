"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, BookOpen, Video, DollarSign, Award, 
  CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Globe, Users 
} from "lucide-react";
import { instructorApplicationsApi, TargetAudience } from "@/lib/api";

export default function TeachWithUsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentAffiliation: "",
    highestDegree: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    courseProposalTitle: "",
    courseProposalSummary: "",
    sampleVideoUrl: "",
    targetAudience: "PROFESSIONAL" as TargetAudience,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await instructorApplicationsApi.submit(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Instructor application error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to submit application. Please review required fields and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">Faculty & Instructor Onboarding</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-4">
            <Sparkles size={14} className="text-brand-500" />
            Join Our Global Academic Faculty
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Share Your Expertise with 50,000+ Ambitious Minds
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            KLZ Academy partners with university faculty, staff engineers, and industry authorities to author world-class curriculum, interactive checkpoints, and published study guides.
          </p>
        </div>

        {/* Value Pillars Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Competitive Revenue Share</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Earn up to 70% of course enrollments, institutional cohort licenses, and printed study guide royalties.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Pedagogical & Studio Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Our instructional designers assist with curriculum structure, quiz authoring, and video post-production.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Institutional Credibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Showcase your verified profile, university affiliation, and professional portfolio to enterprise recruiters.</p>
          </div>
        </div>

        {submitted ? (
          /* Confirmation Screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Faculty Application Submitted!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Thank you, <span className="font-bold text-slate-900 dark:text-white">{formData.fullName}</span>. Your proposal for <span className="font-semibold text-brand-600 dark:text-brand-400">&ldquo;{formData.courseProposalTitle}&rdquo;</span> has been sent to our Academic Review Board.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
              Our Dean of Curriculum will review your credentials, sample media, and syllabus outline. Expect a direct invitation for a 20-minute instructional video review within 3–5 business days.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors shadow-md"
            >
              Return to Catalog <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Recruitment Application Form */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
            
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Personal Credentials & Affiliation */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Credentials & Professional Affiliation</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal / Academic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Dr. Katherine Chen"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="k.chen@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (415) 890-1234"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Organization / University *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currentAffiliation}
                      onChange={(e) => setFormData({ ...formData, currentAffiliation: e.target.value })}
                      placeholder="UC Berkeley / Meta AI Research"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Highest Academic Degree or Industry Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.highestDegree}
                      onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
                      placeholder="Ph.D. in Computer Science (MIT) / Principal Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Verification Links */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verification Links & Portfolio</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/kchen"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub / Google Scholar / Portfolio
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://scholar.google.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Resume / CV Link (Drive / Dropbox)
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Course Proposal */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Proposed Course & Pedagogical Outline</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Course Working Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.courseProposalTitle}
                      onChange={(e) => setFormData({ ...formData, courseProposalTitle: e.target.value })}
                      placeholder="e.g. CUDA Architecture & GPU Kernel Optimization"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Audience Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "K12", label: "K-12 Youth STEM", desc: "Foundational high school" },
                        { id: "HIGHER_ED", label: "Higher Education", desc: "College undergraduate / grad" },
                        { id: "PROFESSIONAL", label: "Professional / Industry", desc: "Staff engineers & practitioners" },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetAudience: tier.id as TargetAudience })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.targetAudience === tier.id
                              ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <span className="block text-xs font-bold">{tier.label}</span>
                          <span className="block text-[11px] text-slate-500">{tier.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Curriculum Summary & Learning Objectives *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.courseProposalSummary}
                      onChange={(e) => setFormData({ ...formData, courseProposalSummary: e.target.value })}
                      placeholder="Describe the target outcomes, prerequisites, lab project ideas, and why this course matters..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sample Teaching Video URL (Loom / YouTube / Google Drive)
                    </label>
                    <input
                      type="url"
                      value={formData.sampleVideoUrl}
                      onChange={(e) => setFormData({ ...formData, sampleVideoUrl: e.target.value })}
                      placeholder="https://loom.com/share/... or YouTube link"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applications are reviewed weekly by our Academic Board.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Faculty Application"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

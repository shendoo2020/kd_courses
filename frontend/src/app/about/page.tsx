"use client";

import Link from "next/link";
import { 
  ShieldCheck, Award, GraduationCap, Building2, Globe, 
  Users, CheckCircle2, ArrowRight, BookOpen, Sparkles, HeartHandshake, FileCheck 
} from "lucide-react";

export default function AboutUsPage() {
  const leadership = [
    {
      name: "Dr. Alistair Sterling",
      role: "Dean of Curriculum & AI Faculty",
      credentials: "Ph.D. in Computer Science (Stanford), Former Principal Scientist at Google Brain",
      bio: "20+ years researching neural architectures, automated code generation, and high-performance computing curricula.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova, M.Sc.",
      role: "Director of Enterprise Cohorts & Labs",
      credentials: "M.S. in Software Systems (ETH Zürich), Ex-Director of Cloud Infrastructure at AWS",
      bio: "Oversees hands-on lab environments, automated grading test runners, and multi-cloud container sandboxes.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Marcus Vance",
      role: "Head of Youth STEM & K-12 Outreach",
      credentials: "M.Ed. in Instructional Design (Harvard), Chair of National Computer Science Teachers Association",
      bio: "Dedicated to designing intuitive visual programming and algorithmic problem-solving for secondary education.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Prof. Priya Nair",
      role: "Academic Review Board Chair",
      credentials: "Professor of Distributed Systems, Carnegie Mellon University Alum",
      bio: "Ensures every KLZ Academy syllabus adheres to rigorous peer-reviewed university standards and ethical computing guidelines.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const milestones = [
    { metric: "50,000+", label: "Graduated Students Worldwide" },
    { metric: "99.4%", label: "Certificate Authenticity Verification Rate" },
    { metric: "120+", label: "University & Corporate Cohort Partners" },
    { metric: "4.9 / 5.0", label: "Average Student Rating Across 2,400+ Reviews" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">About Us & Academic Credentials</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-4">
            <Sparkles size={14} className="text-brand-500" />
            Institutional Rigor Meets Industry Application
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Architecting the Future of Technical Education
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            KLZ Academy was founded to bridge the gulf between abstract academic theory and modern cloud-native engineering. We build deep, checkpoint-driven curricula for schools, universities, and leading tech companies.
          </p>
        </div>

        {/* Key Platform Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400 mb-1">{m.metric}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Mission & Academic Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Academic Pedagogy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every course is built around mastery learning: conceptual lectures followed by rigorous coding checkpoints, peer discussion, and comprehensive proctored assessments.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cryptographic Verification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              All credentials are cryptographically stamped with immutable verification UUIDs accessible at <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/verify/:certId</code> and directly shareable to LinkedIn.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Multi-Tier Delivery</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              From K-12 STEM youth clubs to university capstones and enterprise private cloud cohorts, our platforms adapt smoothly to the learner’s developmental tier.
            </p>
          </div>
        </div>

        {/* Faculty & Academic Leadership */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Academic Review Board & Faculty
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Our curricula are engineered and peer-reviewed by leaders across top research labs and universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((faculty, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={faculty.avatar}
                  alt={faculty.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-500/20 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{faculty.name}</h3>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5 mb-1">{faculty.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-3">{faculty.credentials}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faculty.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Actions */}
        <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Partner with KLZ Academy</h3>
            <p className="text-brand-200 text-sm max-w-xl leading-relaxed">
              Looking to join as a faculty instructor or request a custom curriculum package for your university department or engineering team?
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/teach"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
            >
              Apply as Instructor
            </Link>
            <Link
              href="/custom-courses"
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-md inline-flex items-center gap-2"
            >
              Request Custom Cohort <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

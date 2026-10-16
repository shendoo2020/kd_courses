"use client";

import Link from "next/link";
import { 
  Award, GraduationCap, ArrowRight, ArrowLeft, 
  Sparkles, HeartHandshake, FileCheck 
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutUsPage() {
  const { language, isRTL, t } = useLanguage();

  const leadership = [
    {
      name: "Dr. Alistair Sterling",
      role: language === "ar" ? "عميد المناهج وهيئة الذكاء الاصطناعي" : "Dean of Curriculum & AI Faculty",
      credentials: "Ph.D. in Computer Science (Stanford), Former Principal Scientist at Google Brain",
      bio: language === "ar" ? "أكثر من 20 عاماً في أبحاث الشبكات العصبية، والتوليد الآلي للشيفرات البرمجية، والمناهج المتقدمة." : "20+ years researching neural architectures, automated code generation, and high-performance computing curricula.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova, M.Sc.",
      role: language === "ar" ? "مديرة برامج الشركات والمختبرات السحابية" : "Director of Enterprise Cohorts & Labs",
      credentials: "M.S. in Software Systems (ETH Zürich), Ex-Director of Cloud Infrastructure at AWS",
      bio: language === "ar" ? "تشرف على بيئات التدريب التفاعلية، ومحركات التصحيح الآلي، وحاويات السحابة المتعددة." : "Oversees hands-on lab environments, automated grading test runners, and multi-cloud container sandboxes.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Marcus Vance",
      role: language === "ar" ? "رئيس مسارات الناشئة وSTEM للشباب" : "Head of Youth STEM & K-12 Outreach",
      credentials: "M.Ed. in Instructional Design (Harvard), Chair of National Computer Science Teachers Association",
      bio: language === "ar" ? "مكرس لتصميم مناهج التفكير الخوارزمي التفاعلي والبرمجة البصرية لطلاب المراحل الثانوية." : "Dedicated to designing intuitive visual programming and algorithmic problem-solving for secondary education.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Prof. Priya Nair",
      role: language === "ar" ? "رئيسة لجنة المراجعة الأكاديمية" : "Academic Review Board Chair",
      credentials: "Professor of Distributed Systems, Carnegie Mellon University Alum",
      bio: language === "ar" ? "تضمن توافق كافة مناهج المنصة مع أعلى المعايير المعتمدة عالمياً في كبرى الجامعات." : "Ensures every KLZ Academy syllabus adheres to rigorous peer-reviewed university standards and ethical computing guidelines.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const milestones = [
    { metric: "50,000+", label: language === "ar" ? "طالب وطالبة تخرجوا عالمياً" : "Graduated Students Worldwide" },
    { metric: "99.4%", label: language === "ar" ? "نسبة التحقق من صحة الشهادات" : "Certificate Authenticity Verification Rate" },
    { metric: "120+", label: language === "ar" ? "شريك أكاديمي ومؤسسي" : "University & Corporate Cohort Partners" },
    { metric: "4.9 / 5.0", label: language === "ar" ? "متوسط تقييم الطلاب عبر 2,400+ تقييم" : "Average Student Rating Across 2,400+ Reviews" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">{t.nav.catalog}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{t.nav.about}</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-4">
            <Sparkles size={14} className="text-brand-500" />
            {t.about.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.about.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.about.desc}
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === "ar" ? "المنهجية الأكاديمية" : "Academic Pedagogy"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === "ar" 
                ? "يعتمد كل مسار على الإتقان التراكمي: محاضرات نظرية مكثفة تعقبها محطات برمجية إلزامية، واختبارات مؤتمتة وتقييم مستمر."
                : "Every course is built around mastery learning: conceptual lectures followed by rigorous coding checkpoints, peer discussion, and comprehensive proctored assessments."
              }
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === "ar" ? "التحقق الرقمي الموثق" : "Cryptographic Verification"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === "ar"
                ? "تحتوي كافة شهادات التخرج على رمز تحقق فريد غير قابل للتزوير يمكن للشركات وأرباب العمل التحقق منه بضغطة زر واحدة."
                : "All credentials are cryptographically stamped with immutable verification UUIDs accessible at /verify/:certId and directly shareable to LinkedIn."
              }
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === "ar" ? "تعدد الفئات والمسارات" : "Multi-Tier Delivery"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === "ar"
                ? "من أندية البرمجة للناشئة، مروراً بالأقسام الجامعية، وحتى الكوادر الهندسية المتقدمة، تلبي منصتنا احتياجات مختلف المستويات بسلاسة."
                : "From K-12 STEM youth clubs to university capstones and enterprise private cloud cohorts, our platforms adapt smoothly to the learner’s developmental tier."
              }
            </p>
          </div>
        </div>

        {/* Faculty & Academic Leadership */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.about.facultyBoard}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t.about.facultyBoardDesc}
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
            <h3 className="text-2xl font-bold mb-2">{t.about.partnerTitle}</h3>
            <p className="text-brand-200 text-sm max-w-xl leading-relaxed">
              {t.about.partnerDesc}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/teach"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
            >
              {t.nav.teach}
            </Link>
            <Link
              href="/custom-courses"
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors shadow-md inline-flex items-center gap-2"
            >
              {t.catalog.requestCustom} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

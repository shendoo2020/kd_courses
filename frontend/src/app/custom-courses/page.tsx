"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, 
  ShieldCheck, BookOpen, GraduationCap, Clock, Award
} from "lucide-react";
import { courseRequestsApi, TargetAudience, DeliveryMode } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

export default function CustomCourseRequestPage() {
  const { language, isRTL, t } = useLanguage();

  const [formData, setFormData] = useState({
    requesterName: "",
    email: "",
    phone: "",
    organization: "",
    targetAudience: "PROFESSIONAL" as TargetAudience,
    topic: "",
    studentCount: 25,
    neededTimeframe: "Within 4 to 6 weeks",
    deliveryMode: "HYBRID" as DeliveryMode,
    specificRequirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await courseRequestsApi.submit(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Course request error:", err);
      setErrorMessage(
        err.response?.data?.message || (language === "ar" ? "تعذر إرسال الطلب. يرجى التأكد من ملء الحقول المطلوبة والمحاولة ثانية." : "Failed to submit request. Please check all required fields and try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Academic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">{t.nav.catalog}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{t.nav.customCourses}</span>
        </nav>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-4">
            <Sparkles size={14} className="text-brand-500" />
            {t.customCourses.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.customCourses.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.customCourses.desc}
          </p>
        </div>

        {submitted ? (
          /* Success Screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t.customCourses.successTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {language === "ar" ? (
                <>شكراً لك، <span className="font-semibold text-slate-900 dark:text-white">{formData.requesterName}</span>. تم تسجيل طلب المنهج التدريبي لموضوع <span className="font-semibold text-brand-600 dark:text-brand-400">&ldquo;{formData.topic}&rdquo;</span> لعدد <span className="font-semibold">{formData.studentCount} متدرب</span>. سيتواصل معك مدير البرامج الأكاديمية خلال 24–48 ساعة بمقترح المنهج وخيارات التدريس المتاحة.</>
              ) : (
                <>Thank you, <span className="font-semibold text-slate-900 dark:text-white">{formData.requesterName}</span>. Your request for <span className="font-semibold text-brand-600 dark:text-brand-400">&ldquo;{formData.topic}&rdquo;</span> for <span className="font-semibold">{formData.studentCount} learners</span> has been logged. Our Academic Director will contact you within 24–48 hours with a preliminary syllabus draft and instructor availability.</>
              )}
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-left rtl:text-right border border-slate-200 dark:border-slate-800 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t.customCourses.summary}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">{t.customCourses.organization}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.organization || (language === "ar" ? "مجموعة مستقلة" : "Independent Cohort")}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">{t.customCourses.step2Title}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.targetAudience}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">{t.customCourses.deliveryFormat}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.deliveryMode.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-xs">{t.customCourses.timeframe}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.neededTimeframe}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    requesterName: "",
                    email: "",
                    phone: "",
                    organization: "",
                    targetAudience: "PROFESSIONAL",
                    topic: "",
                    studentCount: 25,
                    neededTimeframe: "Within 4 to 6 weeks",
                    deliveryMode: "HYBRID",
                    specificRequirements: "",
                  });
                }}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t.customCourses.submitAnother}
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors shadow-md inline-flex items-center justify-center gap-2"
              >
                {t.nav.catalog} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
                
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Section 1: Organization & Contact */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">1</div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.customCourses.step1Title}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.requesterName}
                          onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                          placeholder={language === "ar" ? "د. خالد السعيد" : "Dr. Jordan Hayes"}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.email} *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jordan.hayes@institution.edu"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.phone}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+966 50 123 4567"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.organization}
                        </label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder={language === "ar" ? "جامعة الملك فهد / شركة التقنية السحابية" : "Stanford AI Lab / Acme Enterprise"}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Target Audience Group */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">2</div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.customCourses.step2Title}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "K12", label: t.catalog.k12, desc: language === "ar" ? "مسارات الذكاء الاصطناعي والبرمجة للناشئة" : "Youth STEM, AP Prep & Coding foundations" },
                        { id: "HIGHER_ED", label: t.catalog.higherEd, desc: language === "ar" ? "أقسام كليات الهندسة والحاسب الآلي" : "Undergraduate & Graduate department cohorts" },
                        { id: "PROFESSIONAL", label: t.catalog.professional, desc: language === "ar" ? "الفرق الهندسية ومهندسو النظم السحابية" : "Enterprise teams & post-grad technical upskilling" },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetAudience: tier.id as TargetAudience })}
                          className={`text-left rtl:text-right p-4 rounded-2xl border transition-all ${
                            formData.targetAudience === tier.id
                              ? "border-brand-600 bg-brand-50/70 dark:bg-brand-950/50 dark:border-brand-500 ring-2 ring-brand-500/20"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <span className="block font-bold text-sm text-slate-900 dark:text-white mb-1">{tier.label}</span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400 leading-snug">{tier.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Curriculum Specifications */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">3</div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.customCourses.step3Title}</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.topic} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                          placeholder="e.g. Distributed LLM Inference with PyTorch & Triton"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {t.customCourses.studentCount} *
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10000}
                            required
                            value={formData.studentCount}
                            onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value, 10) || 1 })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {t.customCourses.timeframe} *
                          </label>
                          <select
                            value={formData.neededTimeframe}
                            onChange={(e) => setFormData({ ...formData, neededTimeframe: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          >
                            <option value="Immediately (Within 2 weeks)">{language === "ar" ? "عاجل (خلال أسبوعين)" : "Immediately (Within 2 weeks)"}</option>
                            <option value="Within 4 to 6 weeks">{language === "ar" ? "خلال شهر إلى 6 أسابيع" : "Within 4 to 6 weeks"}</option>
                            <option value="Next Academic Semester / Quarter">{language === "ar" ? "الفصل الدراسي / الربع القادم" : "Next Academic Semester / Quarter"}</option>
                            <option value="Flexible / Exploring Options">{language === "ar" ? "مرن / استكشاف الخيارات" : "Flexible / Exploring Options"}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.deliveryFormat}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { id: "ONLINE_LIVE", label: t.catalog.cohortBased },
                            { id: "HYBRID", label: t.catalog.hybrid },
                            { id: "SELF_PACED", label: t.catalog.selfPaced },
                            { id: "IN_PERSON", label: t.catalog.inPerson },
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, deliveryMode: mode.id as DeliveryMode })}
                              className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                                formData.deliveryMode === mode.id
                                  ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400"
                                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {t.customCourses.requirements}
                        </label>
                        <textarea
                          rows={4}
                          value={formData.specificRequirements}
                          onChange={(e) => setFormData({ ...formData, specificRequirements: e.target.value })}
                          placeholder={language === "ar" ? "حدد التقنيات المطلوبة، الأجهزة والبيئات الافتراضية، أو مواصفات مشاريع التخرج..." : "Outline specific technologies, grading weightings, project capstones, or hardware constraints..."}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission CTA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === "ar" ? "لا يشترط أي التزام مسبق. سيقوم فريقنا بإعداد المقترح الدراسي المناسب." : "No upfront commitment required. Our team will review and reply with a proposal."}
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isSubmitting ? t.customCourses.submitting : t.customCourses.submitBtn}
                      {!isSubmitting && (isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* Right Benefits Card */}
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-brand-600" />
                  {t.customCourses.benefitsTitle}
                </h3>

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <GraduationCap size={18} className="text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block text-xs">
                        {language === "ar" ? "أعضاء هيئة تدريس معتمدون" : "Vetted Academic Faculty"}
                      </strong>
                      {language === "ar" ? "مناهج يشرف عليها أساتذة جامعات ومهندسو برمجيات متقدمون." : "Courses led by university professors and veteran staff engineers."}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen size={18} className="text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block text-xs">
                        {language === "ar" ? "مختبرات برمجية مخصصة" : "Bespoke Interactive Labs"}
                      </strong>
                      {language === "ar" ? "بيئات تدريب سحابية واختبارات تطبيقية فورية لتقييم المتدربين." : "Custom coding checkpoint exercises and browser-based environments."}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award size={18} className="text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block text-xs">
                        {language === "ar" ? "شهادات رقمية موثقة برمز تشفير" : "Cryptographic Digital Credentials"}
                      </strong>
                      {language === "ar" ? "شهادات إتمام ذات موثوقية عالية مع كود تحقق فوري عبر المنصة." : "Tamper-proof certificates with unique verification IDs and LinkedIn badges."}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock size={18} className="text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block text-xs">
                        {language === "ar" ? "باقات مذكرات مطبوعة وموصلة" : "Home Delivery Study Packs"}
                      </strong>
                      {language === "ar" ? "إمكانية طباعة وتوصيل المذكرات والأدلة الدراسية لمنازل المتدربين." : "Optional bound lecture notes & course booklets delivered to student homes."}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contact Box */}
              <div className="bg-gradient-to-br from-brand-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
                <h4 className="font-bold text-base mb-2">{language === "ar" ? "استشارة مباشرة لمؤسستك؟" : "Need an Expedited B2B Call?"}</h4>
                <p className="text-xs text-brand-200 leading-relaxed mb-4">
                  {language === "ar" ? "احجز جلسة استشارية مدتها 15 دقيقة مع الفريق الأكاديمي لمناقشة أهداف مؤسستك." : "Schedule a 15-minute consultation directly with our Academic Programs team."}
                </p>
                <div className="text-xs space-y-1.5 text-brand-100 font-mono">
                  <p>Email: enterprise@klzacademy.com</p>
                  <p>Hotline: +1 (800) 559-0192 (Ext. 4)</p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

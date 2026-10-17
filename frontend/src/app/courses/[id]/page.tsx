"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, deliveryApi, PrintItemType } from "@/lib/api";
import Link from "next/link";
import { 
  CheckCircle2, Clock, Shield, Star, User, MessageSquare, 
  Calendar, BookOpen, Truck, XCircle, Laptop, 
  Award, Globe, Linkedin, Github, X, PackageCheck
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language, isRTL, t } = useLanguage();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState<any>(null);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Printing & Delivery Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printForm, setPrintForm] = useState({
    itemType: "SUMMARY_BOOKLET" as PrintItemType,
    quantity: 1,
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
  });
  const [printOrderStatus, setPrintOrderStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [printOrderMessage, setPrintOrderMessage] = useState("");

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load course details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();

    const checkEnrollment = async () => {
      const token = localStorage.getItem("token");
      if (token && id) {
        try {
          const res = await api.get("/enrollments/dashboard");
          const found = res.data.find((enr: any) => enr.courseId === id || enr.course?.id === id);
          if (found) {
            setIsUserEnrolled(true);
            setUserEnrollment(found);
          }
        } catch (e) {
          // Ignore
        }
      }
    };
    checkEnrollment();
  }, [id]);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponMessage(null);
    try {
      const res = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(res.data);
      setCouponMessage({ type: 'success', text: language === 'ar' ? 'تم تطبيق الخصم بنجاح!' : 'Coupon applied successfully!' });
    } catch (e: any) {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: e.response?.data?.message || 'Invalid coupon' });
    }
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setEnrollMessage(null);
    try {
      if (!course) return;

      let finalPrice = course.price;
      if (appliedCoupon && finalPrice > 0) {
        if (appliedCoupon.discountPercent) {
          finalPrice = finalPrice - (finalPrice * (appliedCoupon.discountPercent / 100));
        } else if (appliedCoupon.discountAmount) {
          finalPrice = Math.max(0, finalPrice - appliedCoupon.discountAmount);
        }
      }

      // If course is paid (> $0) after discount, initiate Stripe Checkout session
      if (finalPrice > 0) {
        const response = await api.post("/checkout/create-checkout-session", { 
          courseId: id,
          couponCode: appliedCoupon?.code // pass coupon code to backend checkout
        });
        if (response.data.url) {
          window.location.href = response.data.url;
          return;
        }
      }

      // If free ($0), enroll directly
      await api.post("/enrollments", { courseId: id });
      setIsUserEnrolled(true);
      setEnrollMessage({ 
        type: 'success', 
        text: language === "ar" ? "تم التسجيل في الدورة بنجاح!" : "Successfully enrolled in course!" 
      });
      setTimeout(() => router.push(`/courses/${id}/learn`), 1200);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setEnrollMessage({ 
          type: 'error', 
          text: language === "ar" ? "يرجى تسجيل الدخول أولاً للتسجيل." : "Please log in to enroll." 
        });
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
        comment: newComment,
      });
      setNewComment("");
      fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post review. Ensure you are enrolled!");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOrderPrinting = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert(language === "ar" ? "يرجى تسجيل الدخول لطلب مذكرات الدورة المطبوعة." : "Please log in to order home delivery materials.");
      router.push("/login");
      return;
    }

    setPrintOrderStatus("submitting");
    try {
      const res = await deliveryApi.createOrder({
        courseId: id as string,
        ...printForm,
      });
      setPrintOrderStatus("success");
      setPrintOrderMessage(
        language === "ar"
          ? `تم تأكيد الطلب #${res.data.order.id.slice(0, 8)} بنجاح! يمكنك متابعة الشحن من لوحة التحكم.`
          : `Order #${res.data.order.id.slice(0, 8)} confirmed! Track in your dashboard.`
      );
    } catch (err: any) {
      setPrintOrderStatus("error");
      setPrintOrderMessage(err.response?.data?.message || "Failed to place print order.");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">{language === "ar" ? "جارٍ تحميل تفاصيل المنهج..." : "Loading curriculum..."}</div>;
  if (error || !course) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;

  const defaultInclusions = language === "ar" ? [
    "وصول كامل إلى المحاضرات المصورة والمختبرات البرمجية التفاعلية",
    "اختبارات تقييمية مؤتمتة عند نهاية كل وحدة دراسية مع نتائج فورية",
    "شهادة تخرج معتمدة رقمياً برقم تحقق تسلسلي غير قابل للتزييف",
    "منتدى أكاديمي مخصص للنقاش والتواصل المباشر مع المحاضر",
    "وصول دائم ومفتوح مدى الحياة إلى تحديثات المنهج والمستودعات البرمجية",
  ] : [
    "Full access to interactive video lessons and code editor checkpoints",
    "Automated proctored module quizzes with immediate feedback",
    "Verifiable digital completion certificate with unique UUID",
    "Instructor discussion forum and direct Q&A support",
    "Lifetime archive access to lecture updates and lab repos",
  ];

  const defaultExclusions = language === "ar" ? [
    "أرصدة المنصات السحابية الخارجية لحوسبة الذكاء الاصطناعي (GPU/Cluster credits)",
    "قسائم الاختبارات المهنية المعتمدة من جهات تجارية طرف ثالث",
    "الأجهزة الإلكترونية الملموسة أو الشرائح الدقيقة المادية",
  ] : [
    "Third-party external cloud provider GPU/cluster compute credits",
    "Third-party vendor proprietary certification exam vouchers",
    "Physical hardware devices, specialized development boards, or sensors",
  ];

  const defaultPrerequisites = language === "ar" ? [
    "إلمام بأساسيات البرمجة بأي لغة كائنية (Python أو JavaScript أو ما يعادلهما)",
    "متصفح ويب حديث يدعم تقنيات WebAssembly وHTML5",
    "جهاز حاسوب بذاكرة عشوائية 8GB على الأقل للتطبيق العملي السلس",
  ] : [
    "Basic proficiency in Python / JavaScript or equivalent object-oriented syntax",
    "Modern web browser (Chrome, Firefox, or Safari) with WebAssembly support",
    "Minimum 8GB RAM recommended for local terminal lab exercises",
  ];

  const inclusionsList = (course.inclusions && course.inclusions.length > 0) ? course.inclusions : defaultInclusions;
  const exclusionsList = (course.exclusions && course.exclusions.length > 0) ? course.exclusions : defaultExclusions;
  const prerequisitesList = (course.prerequisites && course.prerequisites.length > 0) ? course.prerequisites : defaultPrerequisites;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20 transition-colors">
      
      {/* Course Header Banner */}
      <div className="bg-slate-950 text-white pt-16 pb-24 border-b-8 border-brand-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          
          <div className="lg:col-span-2 space-y-5">
            {/* Academic Tags */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-md text-xs font-bold uppercase tracking-wide">
                {course.category || "Development"}
              </span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs font-bold uppercase tracking-wide">
                {language === "ar" ? "الفئة:" : "Target:"} {course.targetAudience || "PROFESSIONAL"}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-xs font-bold uppercase tracking-wide">
                {language === "ar" ? "النمط:" : "Format:"} {course.deliveryMode ? course.deliveryMode.replace('_', ' ') : "SELF PACED"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {course.description}
            </p>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-brand-400" />
                <span>{t.courseDetails.instructor}: <strong className="text-white">{course.instructor?.name || (language === "ar" ? "هيئة التدريس" : "KLZ Faculty")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-brand-400" />
                <span>{t.courseDetails.duration}: <strong className="text-white">{course.durationWeeks || 8} {t.catalog.weeks}</strong> (~{course.hoursPerWeek || 5} {t.catalog.hrsPerWeek})</span>
              </div>
              {course.scheduleDetails && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-400" />
                  <span>{t.courseDetails.schedule}: <strong className="text-white">{course.scheduleDetails}</strong></span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800 relative -bottom-16">
              
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-3xl font-black text-slate-950 dark:text-white">
                  {course.price === 0 ? t.courseDetails.free : `$${course.price.toFixed(2)}`}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {t.courseDetails.lifetimeAccess}
                </span>
              </div>
              
              {enrollMessage && (
                <div className={`p-3.5 rounded-xl text-sm mb-4 font-semibold ${
                  enrollMessage.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {enrollMessage.text}
                </div>
              )}
              
              <div className="flex gap-2 mb-4">
                {isUserEnrolled ? (
                  <Link 
                    href={`/courses/${id}/learn`}
                    className="btn-primary flex-1 text-center text-sm sm:text-base font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {userEnrollment?.status === "COMPLETED" || (userEnrollment?.progressPercentage ?? 0) === 100
                      ? t.courseDetails.reviewCourse
                      : (userEnrollment?.progressPercentage ?? 0) > 0
                      ? t.courseDetails.continueLearning
                      : t.courseDetails.startNow}
                  </Link>
                ) : (
                  <button 
                    onClick={handleEnroll} 
                    disabled={isEnrolling || enrollMessage?.type === 'success'}
                    className="btn-primary flex-1 text-sm sm:text-base font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isEnrolling ? "..." : course.price > 0 ? t.courseDetails.enrollPaid : t.courseDetails.enrollFree}
                  </button>
                )}
                
                <button
                  onClick={async () => {
                    try {
                      await api.post(`/users/wishlist/${id}`);
                      alert(language === "ar" ? "تمت إضافة الدورة إلى قائمة رغباتك!" : "Added to your wishlist!");
                    } catch (e) {
                      alert(language === "ar" ? "يرجى تسجيل الدخول للحفظ في المفضلة." : "Please log in to save to wishlist.");
                    }
                  }}
                  className="px-4 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 hover:text-red-500 flex items-center justify-center"
                  title="Save to Wishlist"
                >
                  <Star size={20} />
                </button>
              </div>

              {/* Physical Material Delivery CTA */}
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-xs font-bold hover:bg-brand-100/50 dark:hover:bg-brand-900/40 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Truck size={15} /> {t.courseDetails.orderPrintedPack}
              </button>
              
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
                {language === "ar" ? "تتضمن شهادة تخرج رقمية موثقة برمز تشفير فريد." : "Includes tamper-proof cryptographic certificate."}
              </p>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <Shield className="text-brand-600 dark:text-brand-400" size={17} />
                  <span>{language === "ar" ? "دفع مشفر وآمن 256-بت" : "256-bit SSL encrypted checkout"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={17} />
                  <span>{language === "ar" ? "متوافق مع الهواتف والأجهزة اللوحية والحواسيب" : "Cross-platform interactive player"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Content Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-14">
            
            {/* Section 1: Inclusions & Exclusions */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {t.courseDetails.packageBreakdown}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Inclusions */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900">
                  <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    {t.courseDetails.whatsIncluded}
                  </h3>
                  <ul className="space-y-3">
                    {inclusionsList.map((inc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <XCircle size={18} className="text-slate-400" />
                    {t.courseDetails.whatsNotIncluded}
                  </h3>
                  <ul className="space-y-3">
                    {exclusionsList.map((exc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>

            {/* Section 2: Learning Environment & Prerequisites */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {t.courseDetails.prerequisites} & {t.courseDetails.gradingCriteria}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-3">
                    <Laptop size={18} className="text-brand-600" />
                    <span>{t.courseDetails.prerequisites}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    {prerequisitesList.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-3">
                    <Award size={18} className="text-brand-600" />
                    <span>{t.courseDetails.gradingCriteria}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {course.gradingCriteria || (language === "ar" 
                      ? "يتم توزيع الدرجات الأكاديمية عبر مراحل المنهج: 60% لاجتياز الاختبارات القصيرة بنجاح (مع محاولات غير محدودة) و40% للمشاريع التطبيقية. تحقيق نسبة 80% فأكثر يمنحك شهادة تخرج موثقة."
                      : "Grading is structured across modular checkpoints: 60% automated quiz pass rate (unlimited re-attempts with randomized answer sets) and 40% practical interactive lab completion. Achieving 80% total score earns an official verified certificate."
                    )}
                  </p>
                </div>

              </div>
            </section>

            {/* Section 3: Syllabus */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {t.courseDetails.syllabusOverview}
              </h2>
              <div className="prose max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line border-l-4 rtl:border-l-0 rtl:border-r-4 border-brand-500 pl-6 rtl:pl-0 rtl:pr-6 py-4 leading-relaxed bg-slate-50/50 dark:bg-slate-900 p-6 rounded-r-3xl rtl:rounded-r-none rtl:rounded-l-3xl border border-slate-200/80 dark:border-slate-800 text-sm">
                {course.syllabus}
              </div>

              {/* Modules breakdown if available */}
              {course.modules && course.modules.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.courseDetails.curriculumModules}</h3>
                  {course.modules.map((mod: any, mIdx: number) => (
                    <div key={mod.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-2">
                        <span>{language === "ar" ? `الوحدة ${mIdx + 1}:` : `Module ${mIdx + 1}:`} {mod.title}</span>
                        <span className="text-xs text-slate-500 font-normal">{mod.lessons?.length || 0} {language === "ar" ? "دروس" : "Lessons"}</span>
                      </div>
                      <div className="space-y-1">
                        {mod.lessons?.map((les: any, lIdx: number) => (
                          <div key={les.id} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <BookOpen size={12} className="text-brand-500" />
                            <span>{lIdx + 1}. {les.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 4: Reviews */}
            <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-brand-600 dark:text-brand-400" size={24} />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.courseDetails.studentFeedback}
                </h2>
              </div>

              {/* Leave a review */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{t.courseDetails.leaveReview}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t.courseDetails.rating}:</label>
                  <select 
                    value={newRating} 
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  placeholder={language === "ar" ? "شارك تجربتك الأكاديمية مع الشروحات والاختبارات القصيرة..." : "Share your experience with the lectures, checkpoints, and materials..."}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-500 mb-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
                <button type="submit" disabled={isSubmittingReview} className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl">
                  {isSubmittingReview ? "..." : t.courseDetails.submitReview}
                </button>
              </form>

              {/* Reviews List */}
              {course.reviews && course.reviews.length > 0 ? (
                <div className="space-y-4">
                  {course.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.user?.name || "Student"}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">
                  {language === "ar" ? "لا توجد تقييمات بعد. كن أول من يسجل ويقيم!" : "No reviews yet. Be the first to enroll and review!"}
                </p>
              )}
            </section>
            
          </div>

          {/* Right Sidebar: Instructor Dossier & Printing Showcase */}
          <div className="space-y-8">
            
            {/* Instructor Dossier */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-3">
                {t.courseDetails.facultyInstructor}
              </span>
              
              <div className="flex items-center gap-4 mb-4">
                {course.instructor?.avatarUrl ? (
                  <img
                    src={course.instructor.avatarUrl}
                    alt="Instructor"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center">
                    {course.instructor?.name ? course.instructor.name[0] : "F"}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {course.instructor?.name || (language === "ar" ? "هيئة التدريس" : "KLZ Faculty")}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {course.instructor?.title || "Lead Curriculum Fellow"}
                  </p>
                  <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                    {course.instructor?.organization || "KLZ Academy Labs"}
                  </p>
                </div>
              </div>

              {course.instructor?.academicCredentials && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mb-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                  {course.instructor.academicCredentials}
                </p>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {course.instructor?.bio || (language === "ar" 
                  ? "عضو هيئة تدريس متخصص في الأنظمة الهندسية وتطبيقات الذكاء الاصطناعي والإشراف الأكاديمي."
                  : "Faculty member specializing in high-performance architectures, reproducible computing, and student mentoring."
                )}
              </p>

              {/* Social Links */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                {course.instructor?.linkedinUrl && (
                  <a href={course.instructor.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {course.instructor?.githubUrl && (
                  <a href={course.instructor.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Github size={16} />
                  </a>
                )}
                {course.instructor?.websiteUrl && (
                  <a href={course.instructor.websiteUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Study Booklet Printing Card */}
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                <Truck size={20} />
              </div>
              <h4 className="font-bold text-base mb-2">{t.courseDetails.printedBookletTitle}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {t.courseDetails.printedBookletDesc}
              </p>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
              >
                {t.courseDetails.orderPrintButton}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Material Printing & Home Delivery Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-2">
                {t.courseDetails.doorstepFulfillment}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.courseDetails.orderPrintMaterials}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === "ar" ? "خاص بدورة:" : "For:"} <strong className="text-slate-700 dark:text-slate-300">{course.title}</strong>
              </p>
            </div>

            {printOrderStatus === "success" ? (
              <div className="text-center py-6">
                <PackageCheck size={48} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.courseDetails.orderQueued}</h4>
                <p className="text-xs text-slate-500 mb-6">{printOrderMessage}</p>
                <button
                  onClick={() => {
                    setIsPrintModalOpen(false);
                    setPrintOrderStatus("idle");
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderPrinting} className="space-y-4">
                
                {printOrderStatus === "error" && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                    {printOrderMessage}
                  </div>
                )}

                {/* Item Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "ar" ? "نوع المطبوعات التعليمية" : "Material Item Type"}
                  </label>
                  <select
                    value={printForm.itemType}
                    onChange={(e) => setPrintForm({ ...printForm, itemType: e.target.value as PrintItemType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="SUMMARY_BOOKLET">{language === "ar" ? "مذكرة ملخص الدورة الشامل ومجلد أوراق العمل (19.99$)" : "Spiral-Bound Course Summary Booklet ($19.99)"}</option>
                    <option value="FULL_LECTURE_NOTES">{language === "ar" ? "المذكرات الكاملة والشروحات التفصيلية للمحاضرات (29.99$)" : "Complete Annotated Lecture Notes ($29.99)"}</option>
                    <option value="STUDY_GUIDE">{language === "ar" ? "الدليل المرجعي السريع والبطاقات التلخيصية (14.99$)" : "Quick Reference & Cheat Sheets ($14.99)"}</option>
                    <option value="VERIFIED_PHYSICAL_CERTIFICATE">{language === "ar" ? "شهادة تخرج كرتونية فاخرة ومختومة بختم ذهبي (34.99$)" : "Gold-Foil Embossed Certificate ($34.99)"}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.recipientName} *</label>
                    <input
                      type="text"
                      required
                      value={printForm.recipientName}
                      onChange={(e) => setPrintForm({ ...printForm, recipientName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.phone} *</label>
                    <input
                      type="tel"
                      required
                      value={printForm.phone}
                      onChange={(e) => setPrintForm({ ...printForm, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.address} *</label>
                  <input
                    type="text"
                    required
                    value={printForm.addressLine1}
                    onChange={(e) => setPrintForm({ ...printForm, addressLine1: e.target.value })}
                    placeholder="123 University Ave, Apt 4B"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.city} *</label>
                    <input
                      type="text"
                      required
                      value={printForm.city}
                      onChange={(e) => setPrintForm({ ...printForm, city: e.target.value })}
                      placeholder="Cairo / Riyadh"
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.state} *</label>
                    <input
                      type="text"
                      required
                      value={printForm.state}
                      onChange={(e) => setPrintForm({ ...printForm, state: e.target.value })}
                      placeholder="Province"
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.courseDetails.postalCode} *</label>
                    <input
                      type="text"
                      required
                      value={printForm.postalCode}
                      onChange={(e) => setPrintForm({ ...printForm, postalCode: e.target.value })}
                      placeholder="11511"
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={printOrderStatus === "submitting"}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {printOrderStatus === "submitting" ? "..." : t.courseDetails.confirmOrder}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

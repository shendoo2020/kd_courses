"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, Clock, Video, Sparkles, 
  ArrowRight, ArrowLeft, CheckCircle2, X 
} from "lucide-react";
import { eventsApi, PlatformEvent } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

const SAMPLE_EVENTS: PlatformEvent[] = [
  {
    id: "evt-1",
    title: "Scaling Large Language Models: Distributed Training with Megatron-LM",
    description: "An in-depth academic seminar exploring tensor parallelism, pipeline parallelism, and zero-redundancy optimizers across cluster GPU nodes.",
    speakerName: "Dr. Aris Thorne",
    speakerTitle: "Principal AI Research Scientist, Frontier Labs",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    speakerBio: "Former Stanford AI Lab post-doc, author of over 15 papers on LLM quantization and high-performance computing.",
    eventType: "SEMINAR",
    targetAudience: "PROFESSIONAL",
    startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
    isVirtual: true,
    locationOrUrl: "https://meet.klzacademy.com/frontier-llm-symposium",
    maxCapacity: 250,
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    registeredCount: 194,
    seatsRemaining: 56,
    isSoldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-2",
    title: "Transitioning from University to Silicon Valley: Engineering Panel & AMA",
    description: "Senior staff engineers and tech leads share their hiring criteria, portfolio review red flags, and interview navigation strategies for undergrad and grad students.",
    speakerName: "Maya Lin & Guest Panelists",
    speakerTitle: "Staff Software Engineer, Ex-Google / Stripe",
    speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    speakerBio: "10+ years mentoring university engineering cohorts and leading distributed backend systems.",
    eventType: "CAREER_PANEL",
    targetAudience: "HIGHER_ED",
    startTime: new Date(Date.now() + 86400000 * 6).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 6 + 5400000).toISOString(),
    isVirtual: true,
    locationOrUrl: "https://meet.klzacademy.com/career-symposium-2026",
    maxCapacity: 300,
    bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    registeredCount: 288,
    seatsRemaining: 12,
    isSoldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-3",
    title: "Young Innovators: Building Your First Neural Network in Python",
    description: "An interactive, visual workshop geared for high school students interested in coding, computer vision, and machine learning fundamentals.",
    speakerName: "Kevin O'Connor",
    speakerTitle: "Lead STEM Curriculum Director, KLZ Youth Program",
    speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    speakerBio: "National Science Foundation STEM award recipient and educational technology researcher.",
    eventType: "WORKSHOP",
    targetAudience: "K12",
    startTime: new Date(Date.now() + 86400000 * 9).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 9 + 7200000).toISOString(),
    isVirtual: true,
    locationOrUrl: "https://meet.klzacademy.com/youth-stem-ai",
    maxCapacity: 150,
    bannerUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    registeredCount: 150,
    seatsRemaining: 0,
    isSoldOut: true,
    createdAt: new Date().toISOString(),
  },
];

export default function EventsCalendarPage() {
  const { language, isRTL, t } = useLanguage();

  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Registration Modal State
  const [activeEvent, setActiveEvent] = useState<PlatformEvent | null>(null);
  const [regForm, setRegForm] = useState({ name: "", email: "", organization: "" });
  const [regStatus, setRegStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [regMessage, setRegMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [selectedAudience, selectedType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getAll({
        targetAudience: selectedAudience,
        eventType: selectedType,
      });
      if (res.data && res.data.length > 0) {
        setEvents(res.data);
      } else {
        setEvents(SAMPLE_EVENTS);
      }
    } catch (e) {
      console.warn("Using sample events fallback due to offline backend or empty DB", e);
      setEvents(SAMPLE_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;

    setRegStatus("submitting");
    setRegMessage("");

    try {
      await eventsApi.register(activeEvent.id, {
        attendeeName: regForm.name,
        attendeeEmail: regForm.email,
        organization: regForm.organization || undefined,
      });
      setRegStatus("success");
      setRegMessage(
        language === "ar"
          ? `تم تأكيد حجز مقعدك لندوة "${activeEvent.title}". تم إرسال رابط الجلسة المباشر إلى ${regForm.email}.`
          : `Your seat for "${activeEvent.title}" has been reserved. A calendar invite has been sent to ${regForm.email}.`
      );
    } catch (err: any) {
      setRegStatus("error");
      setRegMessage(err.response?.data?.message || (language === "ar" ? "تعذر تأكيد التسجيل. قد تكون مسجلاً بالفعل أو اكتمل عدد المقاعد." : "Registration failed. You may already be registered or this event is full."));
    }
  };

  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatEventTime = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const startTime = s.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = e.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", { hour: "numeric", minute: "2-digit" });
    return `${startTime} – ${endTime}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">{t.nav.catalog}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{t.events.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-3">
              <Sparkles size={14} className="text-brand-500" />
              {t.events.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.events.title}
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.events.desc}
            </p>
          </div>

          <Link
            href="/custom-courses"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-brand-500 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-sm shrink-0"
          >
            {t.events.requestPrivate} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>

        {/* Filter Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Target Audience Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mx-2">
                {t.events.audience}:
              </span>
              {[
                { id: "ALL", label: t.catalog.allTiers },
                { id: "K12", label: t.catalog.k12 },
                { id: "HIGHER_ED", label: t.catalog.higherEd },
                { id: "PROFESSIONAL", label: t.catalog.professional },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedAudience(tier.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedAudience === tier.id
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Event Format Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mx-2">
                {t.events.format}:
              </span>
              {[
                { id: "ALL", label: t.events.allFormats },
                { id: "SEMINAR", label: language === "ar" ? "ندوة علمية" : "Seminar" },
                { id: "WORKSHOP", label: language === "ar" ? "ورشة عمل" : "Workshop" },
                { id: "CAREER_PANEL", label: language === "ar" ? "جلسة توجيه مهني" : "Career Panel" },
                { id: "MENTOR_TALK", label: language === "ar" ? "لقاء مفتوح مع خبير" : "Mentor AMA" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedType === item.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Event Header Banner */}
              <div className="relative h-44 bg-gradient-to-tr from-brand-900 to-slate-900 overflow-hidden">
                {event.bannerUrl && (
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm">
                    {event.eventType.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-600 text-white shadow-sm">
                    {event.targetAudience}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Video size={13} className="text-emerald-400" />
                    <span>{event.isVirtual ? t.events.virtual : t.events.inPerson}</span>
                  </div>
                  
                  <div className={`px-2.5 py-1 rounded-lg font-bold backdrop-blur-sm ${
                    event.isSoldOut 
                      ? "bg-rose-500/80 text-white" 
                      : event.seatsRemaining < 25 
                      ? "bg-amber-500/80 text-white" 
                      : "bg-emerald-500/80 text-white"
                  }`}>
                    {event.isSoldOut ? t.events.soldOut : `${event.seatsRemaining} ${t.events.seatsLeft}`}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-grow flex flex-col">
                {/* Schedule Info */}
                <div className="flex items-center gap-3 text-xs text-brand-600 dark:text-brand-400 font-semibold mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {formatEventDate(event.startTime)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {formatEventTime(event.startTime, event.endTime)}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3">
                  {event.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {event.description}
                </p>

                {/* Speaker Profile Section */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  {event.speakerAvatar ? (
                    <img
                      src={event.speakerAvatar}
                      alt={event.speakerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                      {event.speakerName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {event.speakerName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {event.speakerTitle}
                    </p>
                  </div>
                </div>

                {/* RSVP Button */}
                <button
                  disabled={event.isSoldOut}
                  onClick={() => {
                    setActiveEvent(event);
                    setRegStatus("idle");
                    setRegMessage("");
                  }}
                  className={`mt-5 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    event.isSoldOut
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      : "bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow"
                  }`}
                >
                  {event.isSoldOut ? t.events.soldOut : t.events.reserveSeat}
                  {!event.isSoldOut && (isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />)}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RSVP Modal */}
        {activeEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
              
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-2">
                  {t.events.modalTitle}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {activeEvent.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {language === "ar" ? "المتحدث:" : "Speaker:"} <strong className="text-slate-700 dark:text-slate-300">{activeEvent.speakerName}</strong> • {formatEventDate(activeEvent.startTime)}
                </p>
              </div>

              {regStatus === "success" ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.events.rsvpSuccess}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{regMessage}</p>
                  <button
                    onClick={() => setActiveEvent(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm"
                  >
                    {language === "ar" ? "إغلاق النافذة" : "Close Window"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {regStatus === "error" && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
                      {regMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.customCourses.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      placeholder="Jane Doe"
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
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="jane.doe@organization.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.customCourses.organization}
                    </label>
                    <input
                      type="text"
                      value={regForm.organization}
                      onChange={(e) => setRegForm({ ...regForm, organization: e.target.value })}
                      placeholder="Stanford / Microsoft / Independent"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                    {t.events.modalDesc}
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={regStatus === "submitting"}
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md disabled:opacity-50"
                    >
                      {regStatus === "submitting" ? "..." : t.events.confirmRsvp}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

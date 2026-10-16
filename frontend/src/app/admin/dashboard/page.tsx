"use client";

import { useEffect, useState } from "react";
import { 
  api, courseRequestsApi, deliveryApi, instructorApplicationsApi, eventsApi,
  Course, CourseRequest, PrintOrder, InstructorApplication, PlatformEvent, 
  CourseRequestStatus, PrintOrderStatus, InstructorAppStatus 
} from "@/lib/api";
import Link from "next/link";
import { 
  Plus, Users, BookOpen, Building2, Truck, Calendar, 
  CheckCircle2, XCircle, Clock, AlertCircle, ArrowUpRight, 
  Video, DollarSign, RefreshCw 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"courses" | "requests" | "delivery" | "applications" | "events">("courses");
  
  // Tab Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [events, setEvents] = useState<PlatformEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    speakerName: "",
    speakerTitle: "",
    startTime: "",
    endTime: "",
    locationOrUrl: "",
    maxCapacity: 100,
  });
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    fetchActiveTabData();
  }, [activeTab]);

  const fetchActiveTabData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "courses") {
        const res = await api.get("/courses");
        setCourses(res.data);
      } else if (activeTab === "requests") {
        const res = await courseRequestsApi.getAll();
        setCourseRequests(res.data);
      } else if (activeTab === "delivery") {
        const res = await deliveryApi.getAllOrders();
        setPrintOrders(res.data);
      } else if (activeTab === "applications") {
        const res = await instructorApplicationsApi.getAll();
        setApplications(res.data);
      } else if (activeTab === "events") {
        const res = await eventsApi.getAll();
        setEvents(res.data);
      }
    } catch (err: any) {
      console.warn(`Failed loading data for tab ${activeTab}:`, err);
      setError(err.response?.data?.message || `Failed to fetch data for ${activeTab}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: CourseRequestStatus) => {
    try {
      await courseRequestsApi.updateStatus(id, { status });
      fetchActiveTabData();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleUpdateDeliveryStatus = async (id: string, status: PrintOrderStatus) => {
    const carrier = prompt("Enter Carrier (e.g. FedEx, DHL, USPS):", "FedEx");
    const trackingNumber = prompt("Enter Tracking Number:", "TRK-" + Math.floor(Math.random() * 899999 + 100000));
    try {
      await deliveryApi.updateOrderStatus(id, {
        status,
        carrier: carrier || undefined,
        trackingNumber: trackingNumber || undefined,
      });
      fetchActiveTabData();
    } catch (e) {
      alert("Failed to update print order");
    }
  };

  const handleUpdateAppStatus = async (id: string, status: InstructorAppStatus) => {
    try {
      await instructorApplicationsApi.updateStatus(id, { status });
      fetchActiveTabData();
    } catch (e) {
      alert("Failed to update application status");
    }
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingEvent(true);
    try {
      await eventsApi.create(newEvent);
      setNewEvent({
        title: "",
        description: "",
        speakerName: "",
        speakerTitle: "",
        startTime: "",
        endTime: "",
        locationOrUrl: "",
        maxCapacity: 100,
      });
      fetchActiveTabData();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to create seminar");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Operations Control Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage course curriculum, triage institutional requests, fulfill printing orders, and schedule seminars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchActiveTabData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Refresh active view"
          >
            <RefreshCw size={16} />
          </button>
          <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 font-bold">
            <Plus size={16} />
            <span>Create Course</span>
          </Link>
        </div>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: "courses", label: "Curriculum Catalog", icon: BookOpen },
          { id: "requests", label: "Custom Cohort Inquiries", icon: Building2 },
          { id: "delivery", label: "Print & Delivery Logistics", icon: Truck },
          { id: "applications", label: "Instructor Candidates", icon: Users },
          { id: "events", label: "Seminars & Keynotes", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* TAB 1: COURSES */}
      {activeTab === "courses" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Loading course catalog...</div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No courses created yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Initialize standard courses or publish a new curriculum.</p>
              <Link href="/admin/courses/new" className="btn-primary text-xs py-2 px-4">Create First Course</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Curriculum Title</th>
                    <th className="px-6 py-4">Target Audience</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Tuition</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div>{c.title}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{c.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                          {c.targetAudience || "PROFESSIONAL"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {c.deliveryMode ? c.deliveryMode.replace('_', ' ') : "SELF PACED"}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                        {c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link href={`/admin/courses/${c.id}/edit`} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                          Edit Curriculum
                        </Link>
                        <Link href={`/courses/${c.id}`} className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium">
                          Public View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOM COHORT INQUIRIES */}
      {activeTab === "requests" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Loading course inquiries...</div>
          ) : courseRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No custom course inquiries yet</h3>
              <p className="text-xs text-slate-500 mt-1">Inquiries submitted via the /custom-courses portal will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Requester & Institution</th>
                    <th className="px-6 py-4">Requested Topic</th>
                    <th className="px-6 py-4">Cohort Size</th>
                    <th className="px-6 py-4">Timeframe</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Triage Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courseRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 dark:text-white block">{req.requesterName}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{req.email}</span>
                        {req.organization && (
                          <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">{req.organization}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {req.topic}
                        <span className="block text-[10px] text-slate-400 font-normal">Audience: {req.targetAudience}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold">
                        {req.studentCount} students
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {req.neededTimeframe}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : req.status === "PROPOSAL_SENT"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            : req.status === "UNAVAILABLE"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, "APPROVED")}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, "PROPOSAL_SENT")}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[10px] hover:bg-indigo-700"
                        >
                          Send Proposal
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, "UNAVAILABLE")}
                          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-[10px]"
                        >
                          Unavailable
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRINT & DELIVERY ORDERS */}
      {activeTab === "delivery" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Loading delivery orders...</div>
          ) : printOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No print orders placed yet</h3>
              <p className="text-xs text-slate-500 mt-1">Orders from the course details page will appear here for fulfillment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Recipient & Address</th>
                    <th className="px-6 py-4">Item Type</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Fulfillment Status</th>
                    <th className="px-6 py-4">Carrier & Tracking</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {printOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 dark:text-white block">{ord.recipientName}</strong>
                        <span className="text-[11px] text-slate-500 block">{ord.addressLine1}, {ord.city}, {ord.state} {ord.postalCode}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ord.phone}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {ord.itemType.replace(/_/g, ' ')} (Qty: {ord.quantity})
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {ord.course?.title || "Curriculum Pack"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : ord.status === "DISPATCHED"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            : ord.status === "PRINTING_IN_PROGRESS"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {ord.trackingNumber ? `${ord.carrier || 'FedEx'}: ${ord.trackingNumber}` : "Pending Dispatch"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateDeliveryStatus(ord.id, "PRINTING_IN_PROGRESS")}
                          className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-[10px]"
                        >
                          Printing
                        </button>
                        <button
                          onClick={() => handleUpdateDeliveryStatus(ord.id, "DISPATCHED")}
                          className="px-2.5 py-1 bg-brand-600 text-white rounded-lg font-bold text-[10px]"
                        >
                          Ship / Track
                        </button>
                        <button
                          onClick={() => handleUpdateDeliveryStatus(ord.id, "DELIVERED")}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                        >
                          Delivered
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INSTRUCTOR APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No instructor applications yet</h3>
              <p className="text-xs text-slate-500 mt-1">Applications submitted at /teach will appear here for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Applicant & Affiliation</th>
                    <th className="px-6 py-4">Degree / Title</th>
                    <th className="px-6 py-4">Proposed Syllabus Title</th>
                    <th className="px-6 py-4">External Verification Links</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 dark:text-white block">{app.fullName}</strong>
                        <span className="text-[11px] text-slate-500 font-mono block">{app.email}</span>
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">{app.currentAffiliation}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold">
                        {app.highestDegree}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {app.courseProposalTitle}
                        <span className="block text-[10px] text-slate-400 line-clamp-1">{app.courseProposalSummary}</span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {app.linkedinUrl && (
                          <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline inline-flex items-center gap-0.5">
                            LinkedIn <ArrowUpRight size={10} />
                          </a>
                        )}
                        {app.sampleVideoUrl && (
                          <a href={app.sampleVideoUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-0.5">
                            Video <ArrowUpRight size={10} />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : app.status === "INTERVIEW_SCHEDULED"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            : app.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, "APPROVED")}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Approve Faculty
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, "INTERVIEW_SCHEDULED")}
                          className="px-2.5 py-1 bg-brand-600 text-white rounded-lg font-bold text-[10px]"
                        >
                          Schedule Video
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SEMINAR & EVENT SCHEDULER */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Event Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-brand-600" />
              Schedule New Academic Seminar
            </h3>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Seminar Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. LLM Inference Optimization"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Speaker Full Name *</label>
                <input
                  type="text"
                  required
                  value={newEvent.speakerName}
                  onChange={(e) => setNewEvent({ ...newEvent, speakerName: e.target.value })}
                  placeholder="Dr. Katherine Chen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Speaker Title & Affiliation *</label>
                <input
                  type="text"
                  required
                  value={newEvent.speakerTitle}
                  onChange={(e) => setNewEvent({ ...newEvent, speakerTitle: e.target.value })}
                  placeholder="Principal AI Scientist, UC Berkeley"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Virtual URL / Meeting Link</label>
                <input
                  type="url"
                  value={newEvent.locationOrUrl}
                  onChange={(e) => setNewEvent({ ...newEvent, locationOrUrl: e.target.value })}
                  placeholder="https://meet.klzacademy.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Overview Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Summarize key learning takeaways..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingEvent}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
              >
                {isCreatingEvent ? "Publishing..." : "Publish Seminar to Calendar"}
              </button>
            </form>
          </div>

          {/* Active Events List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Scheduled Calendar Events ({events.length})
            </h3>
            {events.map((evt) => (
              <div key={evt.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-1 inline-block">
                    {evt.eventType} • {evt.targetAudience}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{evt.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Speaker: {evt.speakerName} ({evt.speakerTitle})</p>
                  <p className="text-[11px] text-slate-400 mt-1">{new Date(evt.startTime).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 block">
                    {evt.registeredCount} RSVPs
                  </span>
                  <span className="text-[10px] text-slate-400">Cap: {evt.maxCapacity} seats</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

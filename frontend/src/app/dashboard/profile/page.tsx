"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { Loader2, Save, User, Award, Download } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, enrollRes] = await Promise.all([
          api.get("/users"),
          api.get("/enrollments/dashboard")
        ]);
        reset(userRes.data);
        setEnrollments(enrollRes.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await api.put("/users", data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCertificate = async (courseId: string, courseTitle: string) => {
    try {
      const response = await api.get(`/certificates/${courseId}`);
      // The API returns the PDF as a Base64 Data URI
      const link = document.createElement("a");
      link.href = response.data.pdfUrl;
      link.download = `${courseTitle.replace(/\s+/g, "_")}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Certificate not available yet. Ensure you have completed the course!");
    }
  };

  if (isLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <User className="text-brand-500" />
              <h2 className="text-xl font-bold text-slate-900">Public Profile</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-brand-500"
                  {...register("name")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-md cursor-not-allowed"
                  {...register("email")}
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-brand-500"
                  placeholder="Tell us a little about yourself..."
                  {...register("bio")}
                />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Certificates & Achievements */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden text-white">
            <div className="p-6 border-b border-slate-700 flex items-center gap-3">
              <Award className="text-yellow-400" />
              <h2 className="text-xl font-bold">Certificates</h2>
            </div>
            <div className="p-6">
              {enrollments.length === 0 ? (
                <p className="text-sm text-slate-400">Enroll in a course to earn certificates.</p>
              ) : (
                <ul className="space-y-4">
                  {enrollments.map(enr => (
                    <li key={enr.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-sm mb-2 line-clamp-1">{enr.course.title}</h4>
                      <button 
                        onClick={() => downloadCertificate(enr.course.id, enr.course.title)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-brand-600 hover:bg-brand-500 rounded-md text-xs font-medium transition-colors"
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
             <Link href="/dashboard" className="text-brand-600 font-medium hover:underline text-sm">
                &larr; Return to Dashboard
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

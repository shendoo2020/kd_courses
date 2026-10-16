"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { 
  Loader2, Save, User, Award, Download, Lock, CheckCircle2, 
  Sun, Moon, KeyRound, AlertTriangle 
} from "lucide-react";
import Link from "next/link";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);

  // Security & Password Change State (Bug 11 & Bug 12)
  const [isTempPasswordNotice, setIsTempPasswordNotice] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    // Sync theme
    const theme = localStorage.getItem("theme");
    setIsDarkTheme(theme === "dark");

    // Check if redirected with requireNewPassword
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("requireNewPassword") === "true") {
        setIsTempPasswordNotice(true);
      }
    }

    const fetchData = async () => {
      try {
        const [userRes, enrollRes] = await Promise.all([
          api.get("/users"),
          api.get("/enrollments/dashboard")
        ]);
        reset(userRes.data);
        if (userRes.data.avatarUrl) {
          setSelectedAvatar(userRes.data.avatarUrl);
        }
        setEnrollments(enrollRes.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const toggleTheme = (enableDark: boolean) => {
    setIsDarkTheme(enableDark);
    if (enableDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const chooseAvatar = (url: string) => {
    setSelectedAvatar(url);
    setValue("avatarUrl", url);
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...data,
        avatarUrl: selectedAvatar || data.avatarUrl || null,
      };
      await api.put("/users", payload);
      setMessage({ type: 'success', text: 'Profile & preferences updated successfully!' });
      // Notify parent/header about avatar update
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully! Your account is now secured.' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsTempPasswordNotice(false);
    } catch (err: any) {
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.' 
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const downloadCertificate = async (courseId: string, courseTitle: string) => {
    setDownloadingCourseId(courseId);
    try {
      const response = await api.get(`/certificates/${courseId}`);
      // The API returns the PDF as a Base64 Data URI
      const link = document.createElement("a");
      link.href = response.data.pdfUrl;
      link.download = `${courseTitle.replace(/\s+/g, "_")}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.response?.data?.message || "Certificate not available yet. Please ensure you complete 100% of all lessons and quizzes!");
    } finally {
      setDownloadingCourseId(null);
    }
  };

  if (isLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={36} /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings & Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your identity, theme preferences, and verifiable course certificates.</p>
        </div>
        <Link href="/dashboard" className="btn-secondary text-xs font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
          &larr; Back to Dashboard
        </Link>
      </div>

      {isTempPasswordNotice && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/60 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Temporary Password Detected</h4>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
              You logged in using a temporary password. For security, please enter that temporary password in &quot;Current Password&quot; below and choose your permanent password.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Edit & Security Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Public Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <User className="text-brand-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Public Profile & Avatar</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {message && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                  {message.text}
                </div>
              )}

              {/* Avatar Selector Section (Bug 6) */}
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Profile Picture
                </label>
                
                <div className="flex items-center gap-5 mb-4">
                  <div className="relative">
                    {selectedAvatar ? (
                      <img 
                        src={selectedAvatar} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-500/30 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center ring-4 ring-brand-500/20 shadow-md">
                        KLZ
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Choose from avatar gallery below</p>
                    <p>or paste an image URL in the field below</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-3">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => chooseAvatar(url)}
                      className={`relative rounded-full p-0.5 transition-all ${
                        selectedAvatar === url 
                          ? 'ring-2 ring-brand-600 scale-105' 
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>

                <input 
                  type="text" 
                  placeholder="Or paste custom image URL (https://...)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  {...register("avatarUrl")}
                  onChange={(e) => setSelectedAvatar(e.target.value)}
                />
              </div>

              {/* Theme Preference Option (Bug 7) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Appearance Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTheme(false)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      !isDarkTheme 
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun size={16} className="text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTheme(true)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      isDarkTheme 
                        ? 'border-brand-400 bg-brand-950 text-brand-300 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon size={16} className="text-indigo-400" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  {...register("name")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed"
                  {...register("email")}
                />
                <p className="text-xs text-slate-400 mt-1">Email address is tied to your account login.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Share a short summary about your professional goals and engineering background..."
                  {...register("bio")}
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card (Bug 12) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <KeyRound className="text-brand-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {passwordMessage && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${
                  passwordMessage.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}>
                  {passwordMessage.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current / Temporary Password
                </label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current or temporary password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input 
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isChangingPassword} 
                  className="btn-primary flex items-center gap-2 text-xs font-bold py-2.5 px-5"
                >
                  {isChangingPassword ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Certificates & Achievements (Bug 3 & 8) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-sm overflow-hidden text-white border border-slate-800">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <Award className="text-amber-400" />
              <h2 className="text-xl font-bold">Earned Certificates</h2>
            </div>
            <div className="p-6">
              {enrollments.length === 0 ? (
                <p className="text-sm text-slate-400">Enroll in a course and complete all lessons to earn certificates.</p>
              ) : (
                <ul className="space-y-4">
                  {enrollments.map((enr) => {
                    const progress = enr.progressPercentage ?? 0;
                    const isCompleted = (enr.totalLessons > 0 && enr.completedLessons >= enr.totalLessons) || (enr.status === "COMPLETED" && progress === 100);

                    return (
                      <li key={enr.id} className="bg-slate-800/90 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-bold text-sm text-white line-clamp-1">{enr.course.title}</h4>
                          {isCompleted ? (
                            <span className="shrink-0 text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-black">
                              ★ 100% UNLOCKED
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                              {progress}% Complete
                            </span>
                          )}
                        </div>

                        {/* Certificate Download Button only unlocked when course completed (Bug 3) */}
                        {isCompleted ? (
                          <div className="space-y-2 pt-2">
                            <button 
                              onClick={() => downloadCertificate(enr.course.id, enr.course.title)}
                              disabled={downloadingCourseId === enr.course.id}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
                            >
                              {downloadingCourseId === enr.course.id ? (
                                <>
                                  <Loader2 className="animate-spin" size={14} /> Generating PDF...
                                </>
                              ) : (
                                <>
                                  <Download size={14} /> Download Certificate (PDF)
                                </>
                              )}
                            </button>
                            <p className="text-[10px] text-center text-slate-400">
                              Cryptographically minted with official KLZ seal.
                            </p>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/60 text-slate-400 text-xs">
                              <Lock size={14} className="text-amber-500 shrink-0" />
                              <span>Complete all {enr.totalLessons || 0} lessons to unlock your certificate.</span>
                            </div>
                            <Link 
                              href={`/courses/${enr.course.id}/learn`}
                              className="block text-center mt-2 text-xs text-brand-400 hover:text-brand-300 font-bold"
                            >
                              Continue Course &rarr;
                            </Link>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api, projectsApi, ProjectSubmission } from "@/lib/api";
import { UploadCloud, CheckCircle2, AlertCircle, X, ChevronRight, Github } from "lucide-react";
import Link from "next/link";

interface CapstoneSubmissionProps {
  courseId: string;
  courseTitle: string;
}

export default function CapstoneSubmission({ courseId, courseTitle }: CapstoneSubmissionProps) {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [courseId]);

  const fetchSubmissions = async () => {
    try {
      const res = await projectsApi.getMy(courseId);
      setSubmissions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError("Please provide a repository or project link");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await projectsApi.submit({
        courseId,
        repoUrl,
        notes
      });
      setRepoUrl("");
      setNotes("");
      fetchSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Passed</span>;
      case 'REVISION_REQUIRED':
        return <span className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12}/> Revision Required</span>;
      default:
        return <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Pending Review</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <UploadCloud size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Capstone Project Submission</h2>
          <p className="text-xs text-slate-500">Submit your final project for instructor grading.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Form */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Submit New Version</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Github size={14} /> Repository or Live URL *
              </label>
              <input
                type="url"
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Implementation Notes / README summary
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly explain your architectural choices..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold"
            >
              {isSubmitting ? "Submitting..." : "Submit for Grading"}
            </button>
          </form>
        </div>

        {/* Submission History */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Submission History</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-xs text-slate-500">Loading history...</div>
            ) : submissions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                No projects submitted yet.
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex justify-between items-start mb-2">
                    {getStatusBadge(sub.status)}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a href={sub.repoUrl!} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline block mb-2 truncate">
                    {sub.repoUrl}
                  </a>
                  {sub.feedback && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Instructor Feedback:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{sub.feedback}"</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Just a quick clock icon since it was missing above
function Clock({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

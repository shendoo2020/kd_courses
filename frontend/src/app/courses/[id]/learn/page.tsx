"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, Loader2, Menu } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import react-player to avoid hydration errors with Next.js SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function StudentClassroomPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchClassroom = async () => {
    try {
      const response = await api.get(`/classroom/${id}`);
      setCourse(response.data);
      
      // Auto-select the first lesson if none is active
      if (!activeLesson && response.data.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(response.data.modules[0].lessons[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load classroom. You must be enrolled.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchClassroom();
  }, [id]);

  const markComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.post(`/classroom/lessons/${activeLesson.id}/progress`);
      // Update local state instantly for snappy UI
      setActiveLesson({ ...activeLesson, progress: [{ completed: true }] });
      fetchClassroom(); // Re-fetch to update sidebar checkmarks
    } catch (err) {
      console.error("Failed to mark complete", err);
    }
  };

  const isCompleted = (lesson: any) => {
    // Check the progress array (which is filtered by the backend to only show THIS student's progress)
    return lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed;
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-brand-500" size={48} /></div>;
  
  if (error || !course) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <Link href={`/courses/${id}`} className="btn-primary">Return to Course Page</Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      
      {/* Sidebar: Table of Contents */}
      <aside className={`w-80 bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'} md:relative md:translate-x-0`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <Link href="/dashboard" className="text-xs font-medium text-slate-500 hover:text-brand-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h2 className="font-bold text-slate-900 truncate">{course.title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.modules?.map((module: any, mIndex: number) => (
            <div key={module.id}>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                Module {mIndex + 1}: {module.title}
              </h3>
              <ul className="space-y-1">
                {module.lessons?.map((lesson: any, lIndex: number) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const completed = isCompleted(lesson);
                  const isVideo = lesson.content.includes('http');

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${isActive ? 'bg-brand-50 border border-brand-200' : 'hover:bg-slate-100 border border-transparent'}`}
                      >
                        <div className="mt-0.5">
                          {completed ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                          ) : (
                            <Circle size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            {isVideo ? <PlayCircle size={12} /> : <FileText size={12} />}
                            <span>{isVideo ? 'Video' : 'Reading'}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-white">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-700">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-slate-900 truncate">{course.title}</span>
        </div>

        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">{activeLesson.title}</h1>
              
              {/* Content Player/Reader */}
              {activeLesson.content.includes('http') ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <ReactPlayer 
                    url={activeLesson.content} 
                    width="100%" 
                    height="100%" 
                    controls={true}
                    onEnded={markComplete} // Auto-complete when video finishes
                  />
                </div>
              ) : (
                <div className="prose max-w-none text-slate-800 bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm whitespace-pre-line">
                  {activeLesson.content}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center py-6 border-t border-slate-200 mt-12">
              <div>
                {isCompleted(activeLesson) ? (
                  <span className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <CheckCircle2 size={20} /> Completed
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm">Mark complete to track progress</span>
                )}
              </div>
              
              {!isCompleted(activeLesson) && (
                <button 
                  onClick={markComplete}
                  className="btn-primary"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
            Select a lesson from the syllabus to begin learning.
          </div>
        )}
      </main>
    </div>
  );
}

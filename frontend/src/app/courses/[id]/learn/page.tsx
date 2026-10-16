"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, Loader2, Menu, HelpCircle, Award } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import react-player to avoid hydration errors with Next.js SSR
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export default function StudentClassroomPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Quiz Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{ passed: boolean; message: string } | null>(null);

  const fetchClassroom = async () => {
    try {
      const response = await api.get(`/classroom/${id}`);
      setCourse(response.data);
      
      // Auto-select first lesson if none selected
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

  useEffect(() => {
    // Reset quiz state whenever changing lessons
    setSelectedOption(null);
    setQuizResult(null);
  }, [activeLesson]);

  const markComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.post(`/classroom/lessons/${activeLesson.id}/progress`);
      setActiveLesson({ ...activeLesson, progress: [{ completed: true }] });
      fetchClassroom();
    } catch (err) {
      console.error("Failed to mark complete", err);
    }
  };

  const isCompleted = (lesson: any) => {
    return lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed;
  };

  // Helper to parse Quiz data if lesson is a quiz
  const parseQuizData = (content: string) => {
    if (content.startsWith('QUIZ_DATA:::')) {
      try {
        return JSON.parse(content.replace('QUIZ_DATA:::', ''));
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleQuizSubmit = (quiz: any) => {
    if (!selectedOption) return;
    if (selectedOption === quiz.correct) {
      setQuizResult({ passed: true, message: "🎉 Correct! You passed this knowledge checkpoint." });
      markComplete();
    } else {
      setQuizResult({ passed: false, message: "❌ Incorrect answer. Review the module and try again!" });
    }
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-brand-500" size={48} /></div>;
  
  if (error || !course) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Enrollment Required</h2>
        <p className="text-slate-400 mb-8 max-w-md">{error}</p>
        <Link href={`/courses/${id}`} className="btn-primary">Return to Course Details</Link>
      </div>
    );
  }

  const isQuiz = activeLesson?.title?.startsWith('[Quiz]');
  const quizData = isQuiz ? parseQuizData(activeLesson.content) : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      
      {/* Sidebar: Curriculum */}
      <aside className={`w-80 bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'} md:relative md:translate-x-0 z-20`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <Link href="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h2 className="font-bold text-slate-900 text-sm truncate">{course.title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.modules?.map((module: any, mIndex: number) => (
            <div key={module.id}>
              <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider mb-2.5">
                Module {mIndex + 1}: {module.title}
              </h3>
              <ul className="space-y-1">
                {module.lessons?.map((lesson: any, lIndex: number) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const completed = isCompleted(lesson);
                  const lessonIsQuiz = lesson.title.startsWith('[Quiz]');
                  const isVideo = !lessonIsQuiz && lesson.content.includes('http');

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${isActive ? 'bg-brand-50 border border-brand-200 shadow-sm' : 'hover:bg-slate-100 border border-transparent'}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {completed ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <Circle size={16} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400 font-medium">
                            {lessonIsQuiz ? (
                              <>
                                <HelpCircle size={12} className="text-amber-500" />
                                <span className="text-amber-700">Assessment</span>
                              </>
                            ) : isVideo ? (
                              <>
                                <PlayCircle size={12} className="text-brand-500" />
                                <span>Lecture Video</span>
                              </>
                            ) : (
                              <>
                                <FileText size={12} />
                                <span>Reading Lab</span>
                              </>
                            )}
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
          <span className="font-bold text-slate-900 truncate text-sm">{course.title}</span>
        </div>

        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 lg:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded text-xs font-bold tracking-wide">
                  {isQuiz ? "Checkpoint Quiz" : "Classroom Material"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">{activeLesson.title}</h1>
              
              {/* QUIZ PLAYER INTERFACE */}
              {isQuiz && quizData ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">{quizData.question}</h3>
                  
                  <div className="space-y-3 mb-6">
                    {[quizData.correct, quizData.wrong].sort().map((opt: string, i: number) => (
                      <label 
                        key={i} 
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedOption === opt 
                            ? 'bg-brand-50 border-brand-500 shadow-sm' 
                            : 'bg-white border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="quiz_choice" 
                          checked={selectedOption === opt}
                          onChange={() => setSelectedOption(opt)}
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-800">{opt}</span>
                      </label>
                    ))}
                  </div>

                  {quizResult && (
                    <div className={`p-4 rounded-xl text-sm font-bold mb-6 ${
                      quizResult.passed 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {quizResult.message}
                    </div>
                  )}

                  <button 
                    onClick={() => handleQuizSubmit(quizData)}
                    disabled={!selectedOption}
                    className="btn-primary py-3 px-8 text-sm font-bold disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : activeLesson.content.includes('http') ? (
                /* VIDEO PLAYER */
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                  <ReactPlayer 
                    url={activeLesson.content} 
                    width="100%" 
                    height="100%" 
                    controls={true}
                    onEnded={markComplete}
                  />
                </div>
              ) : (
                /* TEXT / ARTICLE READING */
                <div className="prose max-w-none text-slate-800 bg-slate-50/70 p-8 rounded-2xl border border-slate-200 shadow-sm whitespace-pre-line leading-relaxed font-normal">
                  {activeLesson.content}
                </div>
              )}
            </div>

            {/* Completion Footer */}
            {!isQuiz && (
              <div className="flex justify-between items-center py-6 border-t border-slate-200 mt-12">
                <div>
                  {isCompleted(activeLesson) ? (
                    <span className="flex items-center gap-2 text-green-700 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200 text-xs">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-semibold">Finish lesson to update course progress</span>
                  )}
                </div>
                
                {!isCompleted(activeLesson) && (
                  <button onClick={markComplete} className="btn-primary text-xs font-bold py-2.5 px-6">
                    Mark as Complete
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center font-semibold">
            Select a module or lesson from the syllabus to begin learning.
          </div>
        )}
      </main>
    </div>
  );
}

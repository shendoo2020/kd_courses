"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, Loader2, Menu, 
  HelpCircle, ChevronLeft, ChevronRight, X, Award, Check
} from "lucide-react";
import dynamic from 'next/dynamic';
import InteractiveLessonPlayer from "./InteractiveLessonPlayer";

// Dynamically import react-player to avoid hydration errors with Next.js SSR
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export default function StudentClassroomPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile: closed by default for full screen

  // Quiz Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{ passed: boolean; message: string } | null>(null);

  const fetchClassroom = async () => {
    try {
      const response = await api.get(`/classroom/${id}`);
      setCourse(response.data);
      
      // Auto-select first lesson if none currently selected
      if (!activeLesson && response.data.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(response.data.modules[0].lessons[0]);
      } else if (activeLesson) {
        // Sync activeLesson progress from updated data without changing identity unless completed
        const updatedLesson = response.data.modules
          ?.flatMap((m: any) => m.lessons)
          ?.find((l: any) => l.id === activeLesson.id);
        if (updatedLesson) {
          setActiveLesson(updatedLesson);
        }
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

  // Reset quiz options ONLY when switching to a DIFFERENT lesson
  useEffect(() => {
    if (activeLesson) {
      const lessonIsQuiz = activeLesson.title?.startsWith('[Quiz]');
      if (lessonIsQuiz && isCompleted(activeLesson)) {
        // If already completed, parse correct answer and show completed status
        const parsed = parseQuizData(activeLesson.content);
        if (parsed) {
          setSelectedOption(parsed.correct);
          setQuizResult({ passed: true, message: "🎉 Checkpoint Passed! You have completed this quiz." });
        }
      } else {
        setSelectedOption(null);
        setQuizResult(null);
      }
    }
  }, [activeLesson?.id]);

  const markComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.post(`/classroom/lessons/${activeLesson.id}/progress`);
      // Update local lesson progress
      setActiveLesson((prev: any) => prev ? ({
        ...prev,
        progress: [{ completed: true }]
      }) : prev);
      
      // Update syllabus modules locally so checkmark updates instantly without network reset
      setCourse((prevCourse: any) => {
        if (!prevCourse) return prevCourse;
        return {
          ...prevCourse,
          modules: prevCourse.modules?.map((mod: any) => ({
            ...mod,
            lessons: mod.lessons?.map((les: any) => 
              les.id === activeLesson.id 
                ? { ...les, progress: [{ completed: true }] }
                : les
            )
          }))
        };
      });
    } catch (err) {
      console.error("Failed to mark complete", err);
    }
  };

  const isCompleted = (lesson: any) => {
    return lesson?.progress && lesson.progress.length > 0 && lesson.progress[0].completed;
  };

  // Helper to parse Quiz data if lesson is a quiz
  const parseQuizData = (content: string) => {
    if (!content) return null;
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

  // Flatten all lessons across all modules for previous / next navigation
  const allLessons = useMemo(() => {
    return course?.modules?.flatMap((m: any) => m.lessons) || [];
  }, [course]);

  const currentIndex = useMemo(() => {
    return allLessons.findIndex((l: any) => l.id === activeLesson?.id);
  }, [allLessons, activeLesson?.id]);

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isLastLesson = currentIndex === allLessons.length - 1 && allLessons.length > 0;

  const navigateToLesson = (lesson: any) => {
    if (!lesson) return;
    setActiveLesson(lesson);
    setIsSidebarOpen(false); // Close mobile drawer when selecting lesson
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }
  
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
  const quizData = isQuiz ? parseQuizData(activeLesson?.content) : null;
  const activeIsDone = isCompleted(activeLesson);

  return (
    <div className="flex h-screen md:h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden relative">
      
      {/* Mobile Drawer Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Curriculum Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-start">
          <div>
            <Link href="/dashboard" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 mb-1">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[220px]" title={course.title}>
              {course.title}
            </h2>
          </div>
          {/* Mobile close button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modules & Lessons Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.modules?.map((module: any, mIndex: number) => (
            <div key={module.id}>
              <h3 className="font-black text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-2.5">
                Module {mIndex + 1}: {module.title}
              </h3>
              <ul className="space-y-1">
                {module.lessons?.map((lesson: any) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const completed = isCompleted(lesson);
                  const lessonIsQuiz = lesson.title.startsWith('[Quiz]');
                  const isVideo = !lessonIsQuiz && lesson.content?.includes('http');

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => navigateToLesson(lesson)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                          isActive 
                            ? 'bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 shadow-sm' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {completed ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-900 dark:text-brand-200' : 'text-slate-700 dark:text-slate-300'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {lessonIsQuiz ? (
                              <>
                                <HelpCircle size={12} className="text-amber-500" />
                                <span className="text-amber-600 dark:text-amber-400">Checkpoint Quiz</span>
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

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-slate-950">
        
        {/* Mobile & Tablet Compact Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 md:hidden"
              title="Open Curriculum"
            >
              <Menu size={20} />
            </button>
            <div className="truncate">
              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide block">
                {course.title}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate block">
                {currentIndex >= 0 ? `Lesson ${currentIndex + 1} of ${allLessons.length}: ` : ""}{activeLesson?.title || "Classroom"}
              </span>
            </div>
          </div>

          {/* Quick Header Navigation Arrows */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => prevLesson && navigateToLesson(prevLesson)}
              disabled={!prevLesson}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Previous Lesson"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => nextLesson && navigateToLesson(nextLesson)}
              disabled={!nextLesson}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Next Lesson"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
            <div>
              {/* Lesson Metadata Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded text-xs font-bold tracking-wide">
                    {isQuiz ? "Checkpoint Assessment" : activeLesson.content?.includes('http') ? "Video Lecture" : "Technical Reading Lab"}
                  </span>
                  
                  {activeIsDone && (
                    <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/60 px-3 py-1 rounded-full border border-green-200 dark:border-green-800 text-xs font-bold">
                      <Check size={14} /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6">
                  {activeLesson.title}
                </h1>
                
                {/* QUIZ INTERFACE */}
                {isQuiz && quizData ? (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 leading-snug">
                      {quizData.question}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      {[quizData.correct, quizData.wrong].sort().map((opt: string, i: number) => {
                        const isSelected = selectedOption === opt;
                        const isThisCorrect = opt === quizData.correct;
                        return (
                          <label 
                            key={i} 
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                              activeIsDone && isThisCorrect
                                ? 'bg-green-50 dark:bg-green-950/40 border-green-400 text-green-900 dark:text-green-200'
                                : isSelected 
                                ? 'bg-brand-50 dark:bg-brand-950 border-brand-500 shadow-sm cursor-pointer' 
                                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="quiz_choice" 
                              disabled={activeIsDone}
                              checked={isSelected}
                              onChange={() => !activeIsDone && setSelectedOption(opt)}
                              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-600"
                            />
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opt}</span>
                            {activeIsDone && isThisCorrect && (
                              <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-400">✓ Correct</span>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {quizResult && (
                      <div className={`p-4 rounded-xl text-sm font-bold mb-6 ${
                        quizResult.passed 
                          ? 'bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                          : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                      }`}>
                        {quizResult.message}
                      </div>
                    )}

                    {!activeIsDone ? (
                      <button 
                        onClick={() => handleQuizSubmit(quizData)}
                        disabled={!selectedOption}
                        className="btn-primary py-3 px-8 text-sm font-bold disabled:opacity-50"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
                          Checkpoint Successfully Passed
                        </span>
                        {nextLesson && (
                          <button
                            onClick={() => navigateToLesson(nextLesson)}
                            className="btn-primary py-2 px-5 text-xs font-bold"
                          >
                            Next Lesson &rarr;
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : activeLesson.content?.includes('http') ? (
                  /* VIDEO PLAYER */
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                    <ReactPlayer 
                      url={activeLesson.content} 
                      width="100%" 
                      height="100%" 
                      controls={true}
                      onEnded={markComplete}
                    />
                  </div>
                ) : (
                  /* TEXT / READING LAB WITH INTERACTIVE SLIDE PLAYER & AI VOICE */
                  <InteractiveLessonPlayer
                    lessonTitle={activeLesson.title}
                    content={activeLesson.content}
                    onCompleteLesson={markComplete}
                    isCompleted={activeIsDone}
                  />
                )}
              </div>

              {/* Progress Completion Banner */}
              {!isQuiz && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl my-8">
                  <div>
                    {activeIsDone ? (
                      <span className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs sm:text-sm">
                        <CheckCircle2 size={18} /> Lesson completed & recorded in your progress!
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                        Read through or complete this lesson to update course progress.
                      </span>
                    )}
                  </div>
                  
                  {!activeIsDone && (
                    <button onClick={markComplete} className="btn-primary text-xs font-bold py-2.5 px-6 shadow-sm">
                      Mark as Complete
                    </button>
                  )}
                </div>
              )}

              {/* PREVIOUS / NEXT NAVIGATION BAR (Bug 5) */}
              <div className="flex items-center justify-between gap-4 py-6 border-t border-b border-slate-200 dark:border-slate-800 mb-10">
                {prevLesson ? (
                  <button
                    onClick={() => navigateToLesson(prevLesson)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">Previous Lesson</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() => navigateToLesson(nextLesson)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold btn-primary py-2.5 px-5 shadow-sm"
                  >
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">Next Lesson</span>
                    <ChevronRight size={16} />
                  </button>
                ) : isLastLesson ? (
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 px-5 rounded-xl shadow-md transition-all font-black"
                  >
                    <Award size={18} />
                    <span>Course Complete: View Certificate</span>
                  </Link>
                ) : null}
              </div>

              {/* LESSON Q&A DISCUSSION FORUM */}
              <div className="pt-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                  <span>Lesson Q&A & Discussion</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    {activeLesson.comments?.length || 0}
                  </span>
                </h3>

                {/* Add comment form */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem('commentText') as HTMLInputElement);
                    if (!input.value.trim()) return;
                    try {
                      await api.post(`/classroom/lessons/${activeLesson.id}/comments`, { text: input.value });
                      input.value = '';
                      fetchClassroom();
                    } catch (err) {
                      alert("Failed to post comment.");
                    }
                  }}
                  className="flex gap-2 sm:gap-3 mb-6"
                >
                  <input 
                    type="text" 
                    name="commentText" 
                    placeholder="Ask a question or share thoughts on this lesson..."
                    className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                  <button type="submit" className="btn-primary text-xs font-bold px-4 sm:px-5 py-2.5 shrink-0">
                    Post
                  </button>
                </form>

                {/* Comments list */}
                {activeLesson.comments && activeLesson.comments.length > 0 ? (
                  <div className="space-y-3">
                    {activeLesson.comments.map((comment: any) => (
                      <div key={comment.id} className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {comment.user.name}
                            {comment.user.role === 'INSTRUCTOR' && (
                              <span className="bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] px-2 py-0.5 rounded font-black uppercase">
                                Instructor
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No questions posted yet for this lesson. Be the first to ask!</p>
                )}
              </div>
            </div>
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

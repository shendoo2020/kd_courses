"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Plus, Folder, Video, FileText, Loader2, Save, HelpCircle } from "lucide-react";
import { useForm } from "react-hook-form";

type ModuleForm = { title: string };
type LessonForm = { title: string; content: string };
type QuizForm = { title: string; questionText: string; correctOption: string; wrongOption: string };

export default function EditCourseSyllabusPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State for forms
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null); // For lesson form
  const [activeQuizModuleId, setActiveQuizModuleId] = useState<string | null>(null); // For quiz form

  const { register: registerModule, handleSubmit: handleModuleSubmit, reset: resetModule } = useForm<ModuleForm>();
  const { register: registerLesson, handleSubmit: handleLessonSubmit, reset: resetLesson } = useForm<LessonForm>();
  const { register: registerQuiz, handleSubmit: handleQuizSubmit, reset: resetQuiz } = useForm<QuizForm>();

  const fetchCourseData = async () => {
    try {
      const response = await api.get(`/classroom/${id}`);
      setCourse(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id]);

  const onAddModule = async (data: ModuleForm) => {
    try {
      await api.post(`/classroom/${id}/modules`, data);
      setShowModuleForm(false);
      resetModule();
      fetchCourseData();
    } catch (err) {
      alert("Failed to add module");
    }
  };

  const onAddLesson = async (data: LessonForm) => {
    if (!activeModuleId) return;
    try {
      await api.post(`/classroom/modules/${activeModuleId}/lessons`, data);
      setActiveModuleId(null);
      resetLesson();
      fetchCourseData();
    } catch (err) {
      alert("Failed to add lesson");
    }
  };

  const onAddQuiz = async (data: QuizForm) => {
    if (!activeQuizModuleId) return;
    try {
      // Backend quiz endpoint will handle creating questions & options
      await api.post(`/classroom/modules/${activeQuizModuleId}/lessons`, {
        title: `[Quiz] ${data.title}`,
        content: `QUIZ_DATA:::${JSON.stringify({
          question: data.questionText,
          correct: data.correctOption,
          wrong: data.wrongOption
        })}`
      });
      setActiveQuizModuleId(null);
      resetQuiz();
      fetchCourseData();
    } catch (err) {
      alert("Failed to add quiz");
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;
  if (!course) return <div className="p-10 text-red-500 font-bold">Course not found. Ensure you are enrolled or own it.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
          <ArrowLeft size={16} /> Back to Instructor Portal
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Syllabus & Curriculum Builder</h1>
        <p className="text-slate-600 mt-1">Course: <span className="font-bold text-slate-900">{course.title}</span></p>
      </div>

      <div className="space-y-6">
        {/* Render Existing Modules */}
        {course.modules?.map((module: any, index: number) => (
          <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <Folder className="text-brand-600" size={22} />
                <h3 className="font-bold text-base sm:text-lg text-slate-900">Module {index + 1}: {module.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setActiveModuleId(activeModuleId === module.id ? null : module.id);
                    setActiveQuizModuleId(null);
                  }}
                  className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-md border border-brand-200"
                >
                  <Plus size={14} /> Add Lesson
                </button>
                <button 
                  onClick={() => {
                    setActiveQuizModuleId(activeQuizModuleId === module.id ? null : module.id);
                    setActiveModuleId(null);
                  }}
                  className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200"
                >
                  <HelpCircle size={14} /> Add Quiz
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {/* Lessons & Quizzes List */}
              {module.lessons?.length > 0 ? (
                <ul className="space-y-2.5 mb-4">
                  {module.lessons.map((lesson: any, lIndex: number) => {
                    const isQuiz = lesson.title.startsWith('[Quiz]');
                    return (
                      <li key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-sm font-semibold">
                        {isQuiz ? (
                          <HelpCircle size={18} className="text-amber-500 shrink-0" />
                        ) : lesson.content.includes('http') ? (
                          <Video size={18} className="text-brand-500 shrink-0" />
                        ) : (
                          <FileText size={18} className="text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800">{lIndex + 1}. {lesson.title}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic mb-4">No content in this module yet.</p>
              )}

              {/* Add Lesson Form */}
              {activeModuleId === module.id && (
                <form onSubmit={handleLessonSubmit(onAddLesson)} className="mt-4 p-5 bg-brand-50/50 rounded-xl border border-brand-200 space-y-4">
                  <h4 className="font-bold text-brand-900 text-sm">Add New Lecture / Reading</h4>
                  <input 
                    type="text" 
                    placeholder="Lesson Title (e.g. Setting Up Your Development Environment)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-brand-500 font-medium bg-white"
                    {...registerLesson("title", { required: true })}
                  />
                  <textarea 
                    placeholder="Video URL (YouTube/MP4) or Article Content" 
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-brand-500 font-medium bg-white"
                    {...registerLesson("content", { required: true })}
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActiveModuleId(null)} className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-1.5 shadow-sm">
                      <Save size={14} /> Save Lesson
                    </button>
                  </div>
                </form>
              )}

              {/* Add Quiz Form */}
              {activeQuizModuleId === module.id && (
                <form onSubmit={handleQuizSubmit(onAddQuiz)} className="mt-4 p-5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-4">
                  <h4 className="font-bold text-amber-900 text-sm">Create Knowledge Assessment (Quiz)</h4>
                  <input 
                    type="text" 
                    placeholder="Quiz Title (e.g. Module 1 Checkpoint Quiz)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-amber-500 font-medium bg-white"
                    {...registerQuiz("title", { required: true })}
                  />
                  <input 
                    type="text" 
                    placeholder="Question (e.g. What is the main benefit of Next.js Server Components?)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-amber-500 font-medium bg-white"
                    {...registerQuiz("questionText", { required: true })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Correct Answer Option" 
                      className="w-full px-3.5 py-2.5 border border-green-300 rounded-lg text-sm outline-none focus:border-green-500 font-medium bg-white"
                      {...registerQuiz("correctOption", { required: true })}
                    />
                    <input 
                      type="text" 
                      placeholder="Incorrect Distractor Option" 
                      className="w-full px-3.5 py-2.5 border border-red-200 rounded-lg text-sm outline-none focus:border-red-500 font-medium bg-white"
                      {...registerQuiz("wrongOption", { required: true })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActiveQuizModuleId(null)} className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-1.5 shadow-sm">
                      <Save size={14} /> Save Quiz
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}

        {/* Add Module Button */}
        {!showModuleForm ? (
          <button 
            onClick={() => setShowModuleForm(true)}
            className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 font-bold hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Next Module
          </button>
        ) : (
          <form onSubmit={handleModuleSubmit(onAddModule)} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-300">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Add Module Chapter</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="e.g. Chapter 1: Architectural Foundations" 
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-brand-500 font-semibold"
                {...registerModule("title", { required: true })}
              />
              <button type="submit" className="btn-primary py-3 px-6 text-sm font-bold">Save Module</button>
              <button type="button" onClick={() => setShowModuleForm(false)} className="btn-secondary py-3 px-4 text-sm font-semibold">Cancel</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Folder, Video, FileText, Loader2, Save, HelpCircle, 
  Trash2, Edit3, X, Check 
} from "lucide-react";
import { useForm } from "react-hook-form";

type ModuleForm = { title: string };
type LessonForm = { title: string; content: string };
type QuizForm = { title: string; questionText: string; correctOption: string; wrongOption: string };

export default function EditCourseSyllabusPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State for add forms
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null); // For lesson form
  const [activeQuizModuleId, setActiveQuizModuleId] = useState<string | null>(null); // For quiz form

  // UI State for edit forms
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonContent, setEditLessonContent] = useState("");

  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [editQuizTitle, setEditQuizTitle] = useState("");
  const [editQuizQuestion, setEditQuizQuestion] = useState("");
  const [editQuizCorrect, setEditQuizCorrect] = useState("");
  const [editQuizWrong, setEditQuizWrong] = useState("");

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

  const onDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete module "${moduleTitle}" and all of its lessons?`)) return;
    try {
      await api.delete(`/classroom/modules/${moduleId}`);
      fetchCourseData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete module");
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

  const onDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) return;
    try {
      await api.delete(`/classroom/lessons/${lessonId}`);
      fetchCourseData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  const startEditingLesson = (lesson: any) => {
    if (lesson.title.startsWith('[Quiz]')) {
      let parsed = { question: '', correct: '', wrong: '' };
      if (lesson.content?.startsWith('QUIZ_DATA:::')) {
        try {
          parsed = JSON.parse(lesson.content.replace('QUIZ_DATA:::', ''));
        } catch (e) {}
      }
      setEditingQuiz(lesson);
      setEditQuizTitle(lesson.title.replace(/^\[Quiz\]\s*/, ''));
      setEditQuizQuestion(parsed.question || '');
      setEditQuizCorrect(parsed.correct || '');
      setEditQuizWrong(parsed.wrong || '');
      setEditingLesson(null);
    } else {
      setEditingLesson(lesson);
      setEditLessonTitle(lesson.title);
      setEditLessonContent(lesson.content);
      setEditingQuiz(null);
    }
  };

  const onSaveEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    try {
      await api.put(`/classroom/lessons/${editingLesson.id}`, {
        title: editLessonTitle,
        content: editLessonContent
      });
      setEditingLesson(null);
      fetchCourseData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update lesson");
    }
  };

  const onSaveEditQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;
    try {
      await api.put(`/classroom/lessons/${editingQuiz.id}`, {
        title: `[Quiz] ${editQuizTitle.replace(/^\[Quiz\]\s*/, '')}`,
        content: `QUIZ_DATA:::${JSON.stringify({
          question: editQuizQuestion,
          correct: editQuizCorrect,
          wrong: editQuizWrong
        })}`
      });
      setEditingQuiz(null);
      fetchCourseData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update quiz");
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;
  if (!course) return <div className="p-10 text-red-500 font-bold">Course not found. Ensure you are enrolled or own it.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-6">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
          <ArrowLeft size={16} /> Back to Instructor Portal
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Syllabus & Curriculum Builder</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Course: <span className="font-bold text-slate-900 dark:text-white">{course.title}</span></p>
      </div>

      <div className="space-y-6">
        {/* Render Existing Modules */}
        {course.modules?.map((module: any, index: number) => (
          <div key={module.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <Folder className="text-brand-600 dark:text-brand-400" size={22} />
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Module {index + 1}: {module.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setActiveModuleId(activeModuleId === module.id ? null : module.id);
                    setActiveQuizModuleId(null);
                  }}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1 bg-brand-50 dark:bg-brand-950 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-800"
                >
                  <Plus size={14} /> Add Lesson
                </button>
                <button 
                  onClick={() => {
                    setActiveQuizModuleId(activeQuizModuleId === module.id ? null : module.id);
                    setActiveModuleId(null);
                  }}
                  className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <HelpCircle size={14} /> Add Quiz
                </button>
                <button
                  onClick={() => onDeleteModule(module.id, module.title)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors ml-1"
                  title="Delete Module"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {/* Lessons & Quizzes List */}
              {module.lessons?.length > 0 ? (
                <ul className="space-y-2.5 mb-4">
                  {module.lessons.map((lesson: any, lIndex: number) => {
                    const isQuiz = lesson.title.startsWith('[Quiz]');
                    const isEditingThis = editingLesson?.id === lesson.id || editingQuiz?.id === lesson.id;

                    return (
                      <li key={lesson.id} className={`flex flex-col p-3 rounded-xl border transition-all ${
                        isEditingThis 
                          ? 'bg-brand-50/40 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700' 
                          : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800'
                      }`}>
                        <div className="flex items-center gap-3">
                          {isQuiz ? (
                            <HelpCircle size={18} className="text-amber-500 shrink-0" />
                          ) : lesson.content.includes('http') ? (
                            <Video size={18} className="text-brand-500 shrink-0" />
                          ) : (
                            <FileText size={18} className="text-slate-400 shrink-0" />
                          )}
                          <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm truncate flex-1">
                            {lIndex + 1}. {lesson.title}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditingLesson(lesson)}
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Edit Lesson / Quiz"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => onDeleteLesson(lesson.id, lesson.title)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors"
                              title="Delete Lesson"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Inline Lesson Edit Form */}
                        {editingLesson?.id === lesson.id && (
                          <form onSubmit={onSaveEditLesson} className="mt-4 pt-4 border-t border-brand-200 dark:border-brand-800/60 space-y-3">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-bold text-brand-900 dark:text-brand-200">Edit Lecture / Reading</h5>
                              <button type="button" onClick={() => setEditingLesson(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={15} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={editLessonTitle}
                              onChange={(e) => setEditLessonTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                              required
                            />
                            <textarea
                              rows={4}
                              value={editLessonContent}
                              onChange={(e) => setEditLessonContent(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                              required
                            />
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => setEditingLesson(null)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
                              <button type="submit" className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1">
                                <Check size={14} /> Update Lesson
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Inline Quiz Edit Form */}
                        {editingQuiz?.id === lesson.id && (
                          <form onSubmit={onSaveEditQuiz} className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800/60 space-y-3">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">Edit Checkpoint Assessment (Quiz)</h5>
                              <button type="button" onClick={() => setEditingQuiz(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={15} />
                              </button>
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 block mb-1">Quiz Title</label>
                              <input
                                type="text"
                                value={editQuizTitle}
                                onChange={(e) => setEditQuizTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-amber-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 block mb-1">Question Prompt</label>
                              <input
                                type="text"
                                value={editQuizQuestion}
                                onChange={(e) => setEditQuizQuestion(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-amber-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] text-green-600 dark:text-green-400 block mb-1">Correct Answer</label>
                                <input
                                  type="text"
                                  value={editQuizCorrect}
                                  onChange={(e) => setEditQuizCorrect(e.target.value)}
                                  className="w-full px-3 py-2 border border-green-300 dark:border-green-800 rounded-lg text-xs outline-none focus:border-green-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-red-500 block mb-1">Incorrect Distractor</label>
                                <input
                                  type="text"
                                  value={editQuizWrong}
                                  onChange={(e) => setEditQuizWrong(e.target.value)}
                                  className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg text-xs outline-none focus:border-red-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => setEditingQuiz(null)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
                              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1 shadow-sm">
                                <Check size={14} /> Update Quiz
                              </button>
                            </div>
                          </form>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic mb-4">No content in this module yet.</p>
              )}

              {/* Add Lesson Form */}
              {activeModuleId === module.id && (
                <form onSubmit={handleLessonSubmit(onAddLesson)} className="mt-4 p-5 bg-brand-50/50 dark:bg-slate-800/60 rounded-xl border border-brand-200 dark:border-brand-800 space-y-4">
                  <h4 className="font-bold text-brand-900 dark:text-brand-200 text-sm">Add New Lecture / Reading</h4>
                  <input 
                    type="text" 
                    placeholder="Lesson Title (e.g. Setting Up Your Development Environment)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    {...registerLesson("title", { required: true })}
                  />
                  <textarea 
                    placeholder="Video URL (YouTube/MP4) or Article Content (use <!-- SLIDE --> to split into slides)" 
                    rows={4}
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    {...registerLesson("content", { required: true })}
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActiveModuleId(null)} className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-1.5 shadow-sm">
                      <Save size={14} /> Save Lesson
                    </button>
                  </div>
                </form>
              )}

              {/* Add Quiz Form */}
              {activeQuizModuleId === module.id && (
                <form onSubmit={handleQuizSubmit(onAddQuiz)} className="mt-4 p-5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-4">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">Create Knowledge Assessment (Quiz)</h4>
                  <input 
                    type="text" 
                    placeholder="Quiz Title (e.g. Module 1 Checkpoint Quiz)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-amber-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    {...registerQuiz("title", { required: true })}
                  />
                  <input 
                    type="text" 
                    placeholder="Question (e.g. What is the main benefit of Next.js Server Components?)" 
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-amber-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    {...registerQuiz("questionText", { required: true })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Correct Answer Option" 
                      className="w-full px-3.5 py-2.5 border border-green-300 dark:border-green-800 rounded-lg text-sm outline-none focus:border-green-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      {...registerQuiz("correctOption", { required: true })}
                    />
                    <input 
                      type="text" 
                      placeholder="Incorrect Distractor Option" 
                      className="w-full px-3.5 py-2.5 border border-red-200 dark:border-red-900 rounded-lg text-sm outline-none focus:border-red-500 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      {...registerQuiz("wrongOption", { required: true })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActiveQuizModuleId(null)} className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
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
            className="w-full py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/30 dark:hover:bg-brand-950/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Next Module
          </button>
        ) : (
          <form onSubmit={handleModuleSubmit(onAddModule)} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-brand-300 dark:border-brand-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Add Module Chapter</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="e.g. Chapter 1: Architectural Foundations" 
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500 font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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

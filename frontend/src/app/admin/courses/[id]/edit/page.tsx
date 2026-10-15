"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Plus, Folder, Video, FileText, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";

type ModuleForm = { title: string };
type LessonForm = { title: string; content: string };

export default function EditCourseSyllabusPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State for forms
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null); // For lesson form

  const { register: registerModule, handleSubmit: handleModuleSubmit, reset: resetModule } = useForm<ModuleForm>();
  const { register: registerLesson, handleSubmit: handleLessonSubmit, reset: resetLesson } = useForm<LessonForm>();

  const fetchCourseData = async () => {
    try {
      // In a real app, this should be a protected endpoint that returns modules and lessons.
      // We will use the getClassroom endpoint since it returns the full nested structure.
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
      fetchCourseData(); // Refresh the list
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
      fetchCourseData(); // Refresh the list
    } catch (err) {
      alert("Failed to add lesson");
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;
  if (!course) return <div className="p-10 text-red-500">Course not found. Ensure you are enrolled or own it.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Syllabus Builder</h1>
        <p className="text-slate-600 mt-1">Editing: <span className="font-semibold text-slate-800">{course.title}</span></p>
      </div>

      <div className="space-y-6">
        {/* Render Existing Modules and Lessons */}
        {course.modules?.map((module: any, index: number) => (
          <div key={module.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Folder className="text-brand-500" size={20} />
                <h3 className="font-bold text-lg text-slate-900">Module {index + 1}: {module.title}</h3>
              </div>
              <button 
                onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1"
              >
                <Plus size={16} /> Add Lesson
              </button>
            </div>

            <div className="p-4">
              {/* Lessons List */}
              {module.lessons?.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {module.lessons.map((lesson: any, lIndex: number) => (
                    <li key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      {lesson.content.includes('http') ? <Video size={18} className="text-slate-400" /> : <FileText size={18} className="text-slate-400" />}
                      <span className="text-slate-700 font-medium">{lIndex + 1}. {lesson.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic mb-4">No lessons in this module yet.</p>
              )}

              {/* Add Lesson Form (Toggleable per module) */}
              {activeModuleId === module.id && (
                <form onSubmit={handleLessonSubmit(onAddLesson)} className="mt-4 p-4 bg-brand-50 rounded-lg border border-brand-100 space-y-4">
                  <h4 className="font-semibold text-brand-800 text-sm">New Lesson</h4>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Lesson Title" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-500"
                      {...registerLesson("title", { required: true })}
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Content (Text or Video URL)" 
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-500"
                      {...registerLesson("content", { required: true })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActiveModuleId(null)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-md hover:bg-brand-700 flex items-center gap-1">
                      <Save size={14} /> Save Lesson
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}

        {/* Add Module Button/Form */}
        {!showModuleForm ? (
          <button 
            onClick={() => setShowModuleForm(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add New Module
          </button>
        ) : (
          <form onSubmit={handleModuleSubmit(onAddModule)} className="bg-white p-6 rounded-xl shadow-sm border border-brand-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Create New Module</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="e.g. Week 1: Introduction to React" 
                className="flex-1 px-4 py-2 border border-slate-300 rounded-md outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                {...registerModule("title", { required: true })}
              />
              <button type="submit" className="btn-primary py-2 px-6">Save</button>
              <button type="button" onClick={() => setShowModuleForm(false)} className="btn-secondary py-2 px-4">Cancel</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

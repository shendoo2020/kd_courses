"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

type CourseFormData = {
  title: string;
  description: string;
  syllabus: string;
  price: string;
};

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>();

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post("/courses", {
        ...data,
        price: parseFloat(data.price) || 0
      });
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You are not authorized to create courses. Ensure you are logged in as an INSTRUCTOR.");
      } else {
        setError(err.response?.data?.message || "Failed to create course.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create a New Course</h1>
        <p className="text-slate-600 mt-1">Fill out the details below to publish your course to the catalog.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Course Title *
            </label>
            <input
              id="title"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g. Advanced React Patterns"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Short Description *
            </label>
            <textarea
              id="description"
              rows={3}
              className={`w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="A brief overview of what students will learn..."
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="syllabus" className="block text-sm font-medium text-slate-700 mb-1">
              Detailed Syllabus *
            </label>
            <textarea
              id="syllabus"
              rows={6}
              className={`w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors ${errors.syllabus ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="- Week 1: Introduction&#10;- Week 2: Deep Dive..."
              {...register("syllabus", { required: "Syllabus is required" })}
            />
            {errors.syllabus && <p className="text-red-500 text-xs mt-1">{errors.syllabus.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
              Price (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                placeholder="0.00"
                {...register("price")}
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Leave at 0.00 for a free course.</p>
          </div>

        </div>
        
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Publishing...
              </>
            ) : (
              "Publish Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

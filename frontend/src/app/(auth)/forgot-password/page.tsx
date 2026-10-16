"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process password reset request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-muted dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800">
        <div>
          <div className="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md">
            <KeyRound size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your registered email address to receive a temporary login password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 rounded-xl p-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-base font-bold text-green-900 dark:text-green-200 mb-1">
                Instructions Dispatched
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                If an account exists with that email address, a temporary password has been sent. Check your inbox (or spam folder) and log in with your temporary password.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/60 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    errors.email ? 'border-red-300 dark:border-red-700' : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Sending Temporary Password...
                  </>
                ) : (
                  "Send Temporary Password"
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <ArrowLeft size={14} className="mr-1" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

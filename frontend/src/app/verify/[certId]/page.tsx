"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Award, CheckCircle2, XCircle, Calendar, User, BookOpen, ShieldCheck, ArrowLeft } from "lucide-react";

interface VerificationData {
  valid: boolean;
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
}

export default function CertificateVerificationPage() {
  const { certId } = useParams();
  const [data, setData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        const response = await api.get(`/certificates/verify/${certId}`);
        setData(response.data);
      } catch (err: any) {
        setError("This certificate could not be verified. It may be invalid or does not exist.");
      } finally {
        setIsLoading(false);
      }
    };
    if (certId) verifyCert();
  }, [certId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back to KLZ Academy
        </Link>

        {isLoading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center animate-pulse">
            <Award className="mx-auto text-brand-500 mb-4 h-16 w-16" />
            <h2 className="text-xl font-bold">Verifying credential against registry...</h2>
          </div>
        ) : error || !data?.valid ? (
          <div className="bg-slate-900 border border-red-900/50 rounded-3xl p-10 sm:p-14 text-center shadow-2xl">
            <XCircle className="mx-auto text-red-500 mb-6 h-20 w-20" />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Invalid Credential</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              {error || "The credential identifier provided does not match any official completion certificate issued by KLZ Academy."}
            </p>
            <div className="text-xs text-slate-600 font-mono">Certificate ID: {certId}</div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-brand-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 bg-brand-500/10 w-40 h-40 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 text-green-400 font-bold text-sm uppercase tracking-wider mb-8 bg-green-500/10 px-4 py-2 rounded-full w-fit border border-green-500/20">
              <ShieldCheck size={18} /> Official Verified Credential
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Certificate of Completion
            </h1>
            <p className="text-slate-400 text-sm mb-8">
              Issued by <span className="text-white font-bold">KLZ Academy</span> for proven curriculum mastery.
            </p>

            <div className="space-y-6 border-t border-slate-800 pt-8 mb-10 text-sm">
              <div className="flex items-start gap-3">
                <User size={20} className="text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Recipient</div>
                  <div className="text-lg font-bold text-white">{data.studentName}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen size={20} className="text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Course Program</div>
                  <div className="text-base font-bold text-slate-200">{data.courseTitle}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Date of Issuance</div>
                  <div className="text-sm font-semibold text-slate-300">
                    {new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono truncate">ID: {data.certificateId}</span>
              <span className="text-brand-400 font-semibold shrink-0 ml-2">Verified Authenticity</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

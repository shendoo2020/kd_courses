"use client";

import { useEffect, useState } from "react";
import { api, orgsApi, Organization, OrgMembership } from "@/lib/api";
import Link from "next/link";
import { 
  Building2, Users, Download, ShieldCheck, Mail, ArrowRight, BookOpen, AlertCircle
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function OrgDashboardPage() {
  const { language, isRTL, t } = useLanguage();
  
  const [memberships, setMemberships] = useState<OrgMembership[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrgs();
  }, []);

  const fetchMyOrgs = async () => {
    try {
      const res = await orgsApi.getMy();
      setMemberships(res.data);
      if (res.data.length > 0) {
        setSelectedOrgId(res.data[0].orgId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrgId) {
      fetchOrgDashboard(selectedOrgId);
    }
  }, [selectedOrgId]);

  const fetchOrgDashboard = async (id: string) => {
    try {
      const res = await orgsApi.getDashboard(id);
      setOrgData(res.data);
    } catch (e) {
      console.error(e);
      setOrgData(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold text-sm">Loading Enterprise Dashboard...</div>;

  if (memberships.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full text-center border border-slate-200 dark:border-slate-800 shadow-xl">
          <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Enterprise Organizations Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            You are not currently associated with any B2B teams or enterprise cohorts.
          </p>
          <Link href="/custom-courses" className="btn-primary w-full justify-center rounded-xl py-3 text-sm">
            Request an Enterprise Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise & B2B Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage team licenses and track learning progression.</p>
          </div>
          
          {memberships.length > 1 && (
            <select
              value={selectedOrgId || ""}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            >
              {memberships.map((m) => (
                <option key={m.orgId} value={m.orgId}>{m.org?.name}</option>
              ))}
            </select>
          )}
        </div>

        {orgData ? (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-brand-600 dark:text-brand-400">
                  <Users size={20} />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Team Members</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">
                  {orgData.activeSeats} <span className="text-base text-slate-400 font-medium">/ {orgData.seatLimit}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4">
                  <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(orgData.activeSeats / orgData.seatLimit) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                  <BookOpen size={20} />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Total Enrollments</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">
                  {orgData.members?.reduce((acc, m) => acc + (m.user?.enrollments?.length || 0), 0) || 0}
                </div>
                <p className="text-xs text-slate-500 mt-2">Active courses across the team</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={20} />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Invite Code</h3>
                </div>
                <div className="text-xl font-mono font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  {orgData.joinCode}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">Share this code with employees to claim a seat.</p>
              </div>
            </div>

            {/* Team Roster List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Team Roster</h3>
                <button className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/50 px-3 py-1.5 rounded-lg transition-colors">
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Join Date</th>
                      <th className="px-6 py-4">Course Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orgData.members?.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <strong className="text-slate-900 dark:text-white block">{m.user?.name}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">{m.user?.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            m.role === "ORG_ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          }`}>
                            {m.role.replace("ORG_", "")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {new Date(m.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {m.user?.enrollments?.length || 0}
                            </span>
                            <span className="text-slate-500">enrolled courses</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <AlertCircle size={32} className="mx-auto text-rose-500 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Access Denied</h3>
            <p className="text-xs text-slate-500 mt-1">You must be an ORG_ADMIN to view the enterprise dashboard.</p>
          </div>
        )}

      </div>
    </div>
  );
}

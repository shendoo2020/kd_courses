import Link from "next/link";
import { 
  LayoutDashboard, PlusCircle, DollarSign, Building2, 
  Truck, Users, Calendar, Sparkles 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-muted dark:bg-slate-950 pt-16">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:block shrink-0">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Academic Operations
            </h2>
            <nav className="space-y-1">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm font-semibold"
              >
                <LayoutDashboard size={18} />
                <span>Control Center</span>
              </Link>
              <Link 
                href="/admin/courses/new" 
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm font-semibold"
              >
                <PlusCircle size={18} />
                <span>Create Course</span>
              </Link>
              <Link 
                href="/admin/analytics" 
                className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm font-semibold"
              >
                <DollarSign size={18} className="text-emerald-500" />
                <span>Analytics & Revenue</span>
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Direct Portals
            </h2>
            <nav className="space-y-1 text-xs">
              <Link 
                href="/custom-courses" 
                className="flex items-center gap-2.5 px-3 py-2 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Building2 size={16} /> Custom Course Form
              </Link>
              <Link 
                href="/events" 
                className="flex items-center gap-2.5 px-3 py-2 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Calendar size={16} /> Seminars Calendar
              </Link>
              <Link 
                href="/teach" 
                className="flex items-center gap-2.5 px-3 py-2 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Users size={16} /> Teach with Us Form
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

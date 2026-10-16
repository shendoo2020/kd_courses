import Link from "next/link";
import { LayoutDashboard, PlusCircle } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-muted pt-16">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Instructor Portal
          </h2>
          <nav className="space-y-2">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link 
              href="/admin/courses/new" 
              className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              <PlusCircle size={20} />
              <span className="font-medium">Create Course</span>
            </Link>
            <Link 
              href="/admin/analytics" 
              className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              <span className="font-bold text-green-600">$</span>
              <span className="font-medium">Analytics & Revenue</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}

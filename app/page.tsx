'use client';

import React from 'react';
import { DashboardCards } from '@/components/DashboardCards';
import { 
  TrendingUp, 
  Activity, 
  Users, 
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 mt-2 text-lg">Welcome back. Here&apos;s what&apos;s happening with your assets today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/assets" 
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/20"
          >
            <Plus size={18} />
            Add Asset
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardCards />

      {/* Secondary Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Placeholder */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Activity size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Recent Activity</h2>
            </div>
            <button className="text-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">
                    <span className="text-emerald-400 font-semibold">John Doe</span> assigned a <span className="text-zinc-100">MacBook Pro M2</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">2 hours ago • Serial: MacBook-2023-00{i}</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">
                  Assigned
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <TrendingUp size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Insights</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <p className="text-sm text-zinc-400">Asset utilization is up by <span className="text-emerald-400 font-bold">12%</span> this month.</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <p className="text-sm text-zinc-400">Next maintenance check for <span className="text-amber-400 font-bold">5 devices</span> is due in 3 days.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-900/20">
            <h3 className="text-lg font-bold">Need Help?</h3>
            <p className="text-emerald-100 text-sm mt-2 opacity-90">Check out our documentation or contact the system administrator for support.</p>
            <button className="mt-4 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

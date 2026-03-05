'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  Settings, 
  Package,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Data Assets', href: '/assets', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950">
          <Package size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-zinc-100 text-lg tracking-tight">AssetFlow</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                  : "hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn(isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">IT Support Team</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
              IT
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">Admin Support</p>
              <p className="text-[10px] text-zinc-500 truncate">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

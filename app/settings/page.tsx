'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { name: 'General', icon: SettingsIcon, description: 'Basic application settings and preferences.' },
    { name: 'Account', icon: User, description: 'Manage your profile and account security.' },
    { name: 'Database', icon: Database, description: 'Supabase connection and synchronization settings.' },
    { name: 'Notifications', icon: Bell, description: 'Configure email and system alerts.' },
    { name: 'Security', icon: Shield, description: 'Access control and audit log settings.' },
    { name: 'Appearance', icon: Palette, description: 'Customize the look and feel of your dashboard.' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Settings</h1>
        <p className="text-zinc-500 mt-2 text-lg">Configure your asset management environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">{section.name}</h3>
                <p className="text-zinc-500 text-sm mt-1">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-zinc-100 mb-6">System Information</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-500">Version</span>
            <span className="text-zinc-100 font-mono">1.0.0-stable</span>
          </div>
          <div className="flex justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-500">Database Status</span>
            <span className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-zinc-500">Last Sync</span>
            <span className="text-zinc-300">Today at 14:45 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

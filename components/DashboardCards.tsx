'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  total: number;
  inUse: number;
  available: number;
  maintenance: number;
}

export function DashboardCards() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    inUse: 0,
    available: 0,
    maintenance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from('assets').select('status');
        
        if (error) throw error;

        if (data) {
          const newStats = data.reduce((acc, curr) => {
            acc.total++;
            if (curr.status === 'In Use') acc.inUse++;
            if (curr.status === 'Available') acc.available++;
            if (curr.status === 'Maintenance' || curr.status === 'Broken') acc.maintenance++;
            return acc;
          }, { total: 0, inUse: 0, available: 0, maintenance: 0 });
          
          setStats(newStats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Fallback to dummy data if error (as requested)
        setStats({
          total: 124,
          inUse: 85,
          available: 32,
          maintenance: 7
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { 
      name: 'Total Assets', 
      value: stats.total, 
      icon: Box, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      trend: '+12%',
      trendUp: true
    },
    { 
      name: 'Assets In Use', 
      value: stats.inUse, 
      icon: Clock, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      trend: '+5%',
      trendUp: true
    },
    { 
      name: 'Available', 
      value: stats.available, 
      icon: CheckCircle2, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      trend: '-2%',
      trendUp: false
    },
    { 
      name: 'Maintenance', 
      value: stats.maintenance, 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10',
      trend: '+1%',
      trendUp: false
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {card.trend}
              {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">{card.name}</p>
            <h3 className="text-3xl font-bold text-zinc-100 mt-1">
              {loading ? '...' : card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

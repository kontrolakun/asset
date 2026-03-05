'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  History as HistoryIcon, 
  Calendar, 
  Tag, 
  Hash, 
  User, 
  Info, 
  Layers,
  Loader2,
  Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AssetDetailModalProps {
  asset: any;
  onClose: () => void;
}

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!asset?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('asset_history')
          .select('*')
          .eq('asset_id', asset.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (err) {
        console.error('Error fetching asset history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [asset?.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 border border-zinc-700">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Asset Details</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Comprehensive overview of {asset.asset_name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Basic Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={Tag} label="Asset Name" value={asset.asset_name} />
                <InfoItem icon={Layers} label="Category" value={asset.categories?.name || asset.category || 'N/A'} />
                <InfoItem icon={Hash} label="Serial Number" value={asset.serial_number} isMono />
                <InfoItem icon={User} label="Assigned To" value={asset.assigned_to || 'Unassigned'} />
                <InfoItem icon={Building2} label="Department" value={asset.departments?.name || 'N/A'} />
                <InfoItem icon={Calendar} label="Purchase Date" value={asset.purchase_date ? format(new Date(asset.purchase_date), 'PPP') : 'N/A'} />
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Info size={12} /> Status
                  </p>
                  <div className="pt-1">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      asset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      asset.status === 'In Use' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    )}>
                      {asset.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Info size={12} /> Notes
                </p>
                <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl text-zinc-300 text-sm leading-relaxed">
                  {asset.notes || 'No additional notes provided for this asset.'}
                </div>
              </div>
            </div>

            {/* Specific Details (JSONB) */}
            <div className="space-y-6 p-6 bg-zinc-800/30 border border-zinc-800 rounded-3xl">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Technical Specifications</p>
              {asset.specific_details && Object.keys(asset.specific_details).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(asset.specific_details).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-zinc-200 font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 italic">No specific technical details recorded.</p>
              )}
            </div>
          </div>

          {/* Bottom: History Timeline */}
          <div className="space-y-6 border-t border-zinc-800 pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <HistoryIcon size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">Asset History</h3>
              </div>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                {history.length} Events Recorded
              </span>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-zinc-800 before:to-transparent">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                  <p className="text-zinc-500 text-sm font-medium">Fetching history timeline...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <p className="text-sm">No history records found for this asset.</p>
                </div>
              ) : (
                history.map((event, idx) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    {/* Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-zinc-100 text-sm">{event.action_type}</div>
                        <time className="font-mono text-[10px] text-zinc-500">
                          {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
                        </time>
                      </div>
                      <div className="text-zinc-400 text-xs">{event.description}</div>
                      {event.assigned_to && (
                        <div className="mt-1 text-[10px] text-zinc-500 italic">
                          Assigned to: {event.assigned_to}
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-zinc-600 flex items-center gap-1">
                        <Clock size={10} />
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-bold transition-all border border-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, isMono = false }: { icon: any, label: string, value: string, isMono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
        <Icon size={12} /> {label}
      </p>
      <p className={cn(
        "text-zinc-100 font-medium",
        isMono ? "font-mono text-sm bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800 inline-block" : "text-base"
      )}>
        {value}
      </p>
    </div>
  );
}

function Clock({ size, className }: { size?: number, className?: string }) {
  return <HistoryIcon size={size} className={className} />;
}

'use client';

import React from 'react';
import { 
  Edit2, 
  Trash2, 
  MoreVertical,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  Globe,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetTableProps {
  assets: any[];
  onEdit: (asset: any) => void;
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'laptop': return Laptop;
    case 'desktop': return Monitor;
    case 'mobile': return Smartphone;
    case 'tablet': return Tablet;
    case 'peripheral': return Cpu;
    case 'networking': return Globe;
    default: return HelpCircle;
  }
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'in use': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'broken': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'retired': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
};

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset Details</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Serial Number</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <HelpCircle size={40} className="opacity-20" />
                    <p className="text-lg font-medium">No assets found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              assets.map((asset) => {
                const Icon = getCategoryIcon(asset.category);
                return (
                  <tr key={asset.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{asset.asset_name}</p>
                          <p className="text-xs text-zinc-500">{asset.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                        {asset.serial_number}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusStyles(asset.status)
                      )}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {asset.assigned_to ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {asset.assigned_to.charAt(0)}
                            </div>
                            <span className="text-sm text-zinc-300">{asset.assigned_to}</span>
                          </>
                        ) : (
                          <span className="text-xs text-zinc-600 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(asset)}
                          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-emerald-400 transition-all"
                          title="Edit Asset"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(asset.id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-rose-400 transition-all"
                          title="Delete Asset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

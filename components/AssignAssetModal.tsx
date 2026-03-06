'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  Send, 
  Loader2,
  User,
  Building2,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AssignAssetModalProps {
  asset: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignAssetModal({ asset, onClose, onSuccess }: AssignAssetModalProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  
  const [formData, setFormData] = useState({
    assigned_to: asset?.assigned_to || '',
    department_id: asset?.department_id || '',
    status: 'In Use'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const { data, error } = await supabase.from('departments').select('*').order('name');
        if (error) throw error;
        setDepartments(data || []);
        if (data && data.length > 0) {
          setFormData(prev => {
            if (!prev.department_id) {
              return { ...prev, department_id: data[0].id };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingDeps(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Asset
      const { error: updateError } = await supabase
        .from('assets')
        .update({
          assigned_to: formData.assigned_to,
          department_id: formData.department_id,
          status: formData.status
        })
        .eq('id', asset.id);
      
      if (updateError) throw updateError;

      // 2. Insert into History
      const deptName = departments.find(d => d.id === formData.department_id)?.name || 'Unknown';
      const { error: historyError } = await supabase
        .from('asset_history')
        .insert([{
          asset_id: asset.id,
          action_type: 'Assigned',
          description: `Asset assigned to ${formData.assigned_to} (${deptName})`,
          assigned_to: formData.assigned_to,
          department_id: formData.department_id
        }]);
      
      if (historyError) throw historyError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error assigning asset:', err);
      alert('Failed to assign asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['Available', 'In Use', 'Maintenance', 'Broken', 'Retired'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-blue-400 border border-zinc-700">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Assign Asset</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Assign {asset.asset_name} to a user.</p>
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
        <form id="assign-form" onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> Assigned To
            </label>
            <input
              required
              type="text"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              placeholder="Enter employee name..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={12} /> Department
            </label>
            <select
              required
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
            >
              {loadingDeps ? (
                <option>Loading...</option>
              ) : (
                departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Info size={12} /> Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
            >
              {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all font-bold"
          >
            Cancel
          </button>
          <button
            form="assign-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Assign Asset
          </button>
        </div>
      </div>
    </div>
  );
}

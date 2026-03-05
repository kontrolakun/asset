'use client';

import React from 'react';
import { 
  X, 
  Save, 
  Loader2,
  Calendar,
  Tag,
  Hash,
  User,
  Info,
  Layers
} from 'lucide-react';

interface AssetFormProps {
  asset?: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function AssetModal({ asset, onClose, onSave }: AssetFormProps) {
  const [formData, setFormData] = React.useState({
    asset_name: asset?.asset_name || '',
    category: asset?.category || 'Laptop',
    serial_number: asset?.serial_number || '',
    status: asset?.status || 'Available',
    assigned_to: asset?.assigned_to || '',
    purchase_date: asset?.purchase_date || '',
    notes: asset?.notes || ''
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Laptop', 'Desktop', 'Monitor', 'Mobile', 'Tablet', 'Peripheral', 'Networking', 'Other'];
  const statuses = ['Available', 'In Use', 'Maintenance', 'Broken', 'Retired'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">{asset ? 'Edit Asset' : 'Add New Asset'}</h2>
            <p className="text-zinc-500 text-sm mt-1">Fill in the details below to manage your IT asset.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Tag size={14} /> Asset Name
              </label>
              <input
                required
                type="text"
                value={formData.asset_name}
                onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                placeholder="e.g. MacBook Pro M2"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Layers size={14} /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Hash size={14} /> Serial Number
              </label>
              <input
                required
                type="text"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="SN-2023-XXXX"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Info size={14} /> Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
              >
                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <User size={14} /> Assigned To
              </label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                placeholder="Employee Name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Calendar size={14} /> Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
              <Info size={14} /> Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details about the asset..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {asset ? 'Update Asset' : 'Save Asset'}
          </button>
        </div>
      </div>
    </div>
  );
}

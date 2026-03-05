'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  Save, 
  Loader2,
  Calendar,
  Tag,
  Hash,
  User,
  Info,
  Layers,
  Cpu,
  Monitor as MonitorIcon,
  Globe,
  Printer as PrinterIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AssetFormProps {
  asset?: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function AssetModal({ asset, onClose, onSave }: AssetFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    asset_name: asset?.asset_name || '',
    category_id: asset?.category_id || '',
    serial_number: asset?.serial_number || '',
    status: asset?.status || 'Available',
    purchase_date: asset?.purchase_date || '',
    notes: asset?.notes || '',
    specific_details: asset?.specific_details || {}
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

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

  const handleSpecificDetailChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specific_details: {
        ...prev.specific_details,
        [key]: value
      }
    }));
  };

  const selectedCategoryName = categories.find(c => c.id === formData.category_id)?.name || '';

  const renderDynamicFields = () => {
    const name = selectedCategoryName.toLowerCase();
    
    if (name.includes('laptop')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800">
          <DynamicField label="Processor" icon={Cpu} value={formData.specific_details.processor || ''} onChange={(v) => handleSpecificDetailChange('processor', v)} />
          <DynamicField label="RAM" icon={Info} value={formData.specific_details.ram || ''} onChange={(v) => handleSpecificDetailChange('ram', v)} />
          <DynamicField label="Storage" icon={Info} value={formData.specific_details.storage || ''} onChange={(v) => handleSpecificDetailChange('storage', v)} />
        </div>
      );
    }
    
    if (name.includes('monitor')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800">
          <DynamicField label="Screen Size" icon={MonitorIcon} value={formData.specific_details.screen_size || ''} onChange={(v) => handleSpecificDetailChange('screen_size', v)} />
          <DynamicField label="Resolution" icon={Info} value={formData.specific_details.resolution || ''} onChange={(v) => handleSpecificDetailChange('resolution', v)} />
        </div>
      );
    }
    
    if (name.includes('networking')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800">
          <DynamicField label="IP Address" icon={Globe} value={formData.specific_details.ip_address || ''} onChange={(v) => handleSpecificDetailChange('ip_address', v)} />
          <DynamicField label="MAC Address" icon={Hash} value={formData.specific_details.mac_address || ''} onChange={(v) => handleSpecificDetailChange('mac_address', v)} />
        </div>
      );
    }
    
    if (name.includes('printer')) {
      return (
        <div className="grid grid-cols-1 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <PrinterIcon size={12} /> Printer Type
            </label>
            <select
              value={formData.specific_details.printer_type || ''}
              onChange={(e) => handleSpecificDetailChange('printer_type', e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Select Type</option>
              <option value="Inkjet">Inkjet</option>
              <option value="Laser">Laser</option>
              <option value="Dot Matrix">Dot Matrix</option>
            </select>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const statuses = ['Available', 'In Use', 'Maintenance', 'Broken', 'Retired'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
        <form id="asset-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={12} /> Asset Name
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
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Layers size={12} /> Category
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value, specific_details: {} })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
              >
                {loadingCategories ? (
                  <option>Loading...</option>
                ) : (
                  categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                )}
              </select>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Hash size={12} /> Serial Number
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
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Info size={12} /> Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
              >
                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={12} /> Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Dynamic Fields Section */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category Specific Details</p>
            {renderDynamicFields() || (
              <div className="p-4 bg-zinc-800/20 border border-zinc-800 border-dashed rounded-2xl text-center">
                <p className="text-zinc-600 text-xs italic">No additional fields for this category.</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Info size={12} /> Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details about the asset..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
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
            form="asset-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {asset ? 'Update Asset' : 'Save Asset'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DynamicField({ label, icon: Icon, value, onChange }: { label: string, icon: any, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex items-center gap-1.5">
        <Icon size={10} /> {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
      />
    </div>
  );
}


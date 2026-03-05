'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AssetTable } from '@/components/AssetTable';
import { AssetModal } from '@/components/AssetModal';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      let query = supabase.from('assets').select('*').order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      // Mock data for demo if Supabase fails
      setAssets([
        { id: '1', asset_name: 'MacBook Pro M2', category: 'Laptop', serial_number: 'SN-2023-001', status: 'In Use', assigned_to: 'John Doe', purchase_date: '2023-01-15' },
        { id: '2', asset_name: 'Dell UltraSharp 27', category: 'Monitor', serial_number: 'SN-2023-002', status: 'Available', assigned_to: '', purchase_date: '2023-02-10' },
        { id: '3', asset_name: 'iPhone 14 Pro', category: 'Mobile', serial_number: 'SN-2023-003', status: 'Maintenance', assigned_to: 'Jane Smith', purchase_date: '2023-03-05' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      if (editingAsset) {
        const { error } = await supabase
          .from('assets')
          .update(formData)
          .eq('id', editingAsset.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assets')
          .insert([formData]);
        if (error) throw error;
      }
      fetchAssets();
    } catch (err) {
      console.error('Error saving asset:', err);
      // For demo purposes, we'll just update the local state if Supabase fails
      if (editingAsset) {
        setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, ...formData } : a));
      } else {
        setAssets([{ id: Date.now().toString(), ...formData }, ...assets]);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) throw error;
      fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(search.toLowerCase()) || 
                         asset.serial_number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Asset Inventory</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage and track all company IT hardware and software.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingAsset(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            <Plus size={20} />
            Add New Asset
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search by asset name or serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-10 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Broken">Broken</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          <button 
            onClick={fetchAssets}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all"
            title="Refresh Data"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all"
            title="Export to CSV"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading && assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-zinc-500 font-medium">Loading your inventory...</p>
        </div>
      ) : (
        <AssetTable 
          assets={filteredAssets} 
          onEdit={(asset) => {
            setEditingAsset(asset);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <AssetModal 
          asset={editingAsset}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAsset(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

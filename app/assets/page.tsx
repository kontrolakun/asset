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
import { AssetDetailModal } from '@/components/AssetDetailModal';
import { AssignAssetModal } from '@/components/AssignAssetModal';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [viewingAsset, setViewingAsset] = useState<any>(null);
  const [assigningAsset, setAssigningAsset] = useState<any>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // Join with departments (categories is now a text field)
      let query = supabase
        .from('assets')
        .select(`
          *,
          departments (id, name)
        `)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      let assetId = editingAsset?.id;
      let actionType = 'Updated';
      let description = `Updated details for: ${formData.asset_name}`;

      if (editingAsset) {
        const { error } = await supabase
          .from('assets')
          .update(formData)
          .eq('id', editingAsset.id);
        if (error) throw error;
      } else {
        actionType = 'Created';
        description = `Added new asset: ${formData.asset_name}`;
        const { data, error } = await supabase
          .from('assets')
          .insert([formData])
          .select();
        if (error) throw error;
        if (data && data.length > 0) {
          assetId = data[0].id;
        }
      }

      // Record in asset_history
      if (assetId) {
        await supabase.from('asset_history').insert([{
          asset_id: assetId,
          action_type: actionType,
          description: description
        }]);
      }

      fetchAssets();
    } catch (err) {
      console.error('Error saving asset:', err);
      alert('Error saving asset. Check console for details.');
    }
  };

  const handleExportCSV = () => {
    if (filteredAssets.length === 0) return;

    const headers = ['Asset Name', 'Category', 'Serial Number', 'Status', 'Assigned To', 'Department', 'Purchase Date', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        `"${asset.asset_name}"`,
        `"${asset.category || ''}"`,
        `"${asset.serial_number}"`,
        `"${asset.status}"`,
        `"${asset.assigned_to || ''}"`,
        `"${asset.departments?.name || ''}"`,
        `"${asset.purchase_date || ''}"`,
        `"${(asset.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) throw error;
      fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
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
            onClick={handleExportCSV}
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
          onView={(asset) => {
            setViewingAsset(asset);
            setIsDetailModalOpen(true);
          }}
          onDelete={handleDelete}
          onAssign={(asset) => {
            setAssigningAsset(asset);
            setIsAssignModalOpen(true);
          }}
        />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && viewingAsset && (
        <AssetDetailModal 
          asset={viewingAsset}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingAsset(null);
          }}
        />
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && assigningAsset && (
        <AssignAssetModal 
          asset={assigningAsset}
          onClose={() => {
            setIsAssignModalOpen(false);
            setAssigningAsset(null);
          }}
          onSuccess={fetchAssets}
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


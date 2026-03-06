'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  Layers,
  Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newDepartment, setNewDepartment] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('departments').select('*').order('name');
      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newDepartment.trim()) return;
    try {
      const { error } = await supabase.from('departments').insert([{ name: newDepartment }]);
      if (error) throw error;
      setNewDepartment('');
      fetchData();
    } catch (err) {
      console.error('Error adding department:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This might affect existing assets.')) return;
    try {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Cannot delete: This item might be in use by an asset.');
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editValue.trim()) return;
    try {
      const { error } = await supabase.from('departments').update({ name: editValue }).eq('id', editingId);
      if (error) throw error;
      setEditingId(null);
      setEditValue('');
      fetchData();
    } catch (err) {
      console.error('Error updating department:', err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Settings</h1>
        <p className="text-zinc-500 mt-2 text-lg">Manage departments for your asset inventory.</p>
      </div>

      <div className="max-w-2xl">
        {/* Departments CRUD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg text-blue-400">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Departments</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="New department name..."
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button 
                onClick={handleAdd}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-600" /></div>
              ) : departments.length === 0 ? (
                <p className="text-center py-10 text-zinc-600 text-sm italic">No departments defined yet.</p>
              ) : (
                departments.map(dep => (
                  <div key={dep.id} className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-all">
                    {editingId === dep.id ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input 
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-zinc-100 focus:outline-none"
                        />
                        <button onClick={handleUpdate} className="text-emerald-400 p-1 hover:bg-zinc-800 rounded"><Save size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="text-zinc-500 p-1 hover:bg-zinc-800 rounded"><X size={16} /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-zinc-300 font-medium">{dep.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingId(dep.id); setEditValue(dep.name); }}
                            className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(dep.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


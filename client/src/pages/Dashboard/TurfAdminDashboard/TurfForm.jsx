import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TurfForm({ isOpen, onClose, onTurfAdded, editingTurf, darkMode }) {
  const [form, setForm] = useState({ name: '', location: '', pricePerHour: 0, sportType: 'football', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTurf) setForm({ ...editingTurf });
    else setForm({ name: '', location: '', pricePerHour: 0, sportType: 'football', description: '' });
  }, [editingTurf, isOpen]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // try backend create/update
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      if (editingTurf && editingTurf._id) {
        await fetch(`${API_BASE}/api/turfs/${editingTurf._id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Turf updated');
      } else {
        await fetch(`${API_BASE}/api/turfs`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        toast.success('Turf created');
      }
      onTurfAdded && onTurfAdded();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      toast.error('Could not save turf (dev fallback)');
      // as dev fallback, call onTurfAdded
      onTurfAdded && onTurfAdded();
      onClose && onClose();
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <form onSubmit={submit} className={`relative z-10 w-full max-w-lg p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{editingTurf ? 'Edit Turf' : 'Add Turf'}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Turf name" className="px-3 py-2 border rounded" />
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" className="px-3 py-2 border rounded" />
          <input type="number" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: Number(e.target.value) }))} placeholder="Price per hour" className="px-3 py-2 border rounded" />
          <select value={form.sportType} onChange={e => setForm(f => ({ ...f, sportType: e.target.value }))} className="px-3 py-2 border rounded">
            <option value="football">Football</option>
            <option value="cricket">Cricket</option>
            <option value="basketball">Basketball</option>
            <option value="volleyball">Volleyball</option>
            <option value="badminton">Badminton</option>
            <option value="tennis">Tennis</option>
          </select>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="px-3 py-2 border rounded" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2">{loading ? 'Saving...' : (<><Save className="w-4 h-4" /> Save</>)}</button>
        </div>
      </form>
    </div>
  );
}

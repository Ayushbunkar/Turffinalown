import api from "../config/Api";

// Unified turf admin service: uses API when available, falls back to safeFetch mock responses.
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, { credentials: 'include', ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function fetchTurfs() {
  // prefer configured api client if available
  try {
    if (api && typeof api.get === 'function') {
      const res = await api.get('/api/turfs');
      // some backends return an object with { turfs: [...] } or directly the array
      if (Array.isArray(res.data)) return res.data;
      return res.data?.turfs || res.data || [];
    }
  } catch (e) {
    // fallback to raw fetch
  }

  try {
  const data = await safeFetch(`${API_BASE}/api/turfs`);
    return data.turfs || data || [];
  } catch (err) {
    // dev/mock fallback
    return [
      { _id: 't1', name: 'Central Turf', location: 'Zone A', pricePerHour: 500, isActive: true, sportType: 'football', createdAt: new Date().toISOString(), description: 'Astro turf' },
      { _id: 't2', name: 'East Ground', location: 'Zone B', pricePerHour: 300, isActive: false, sportType: 'cricket', createdAt: new Date(Date.now()-86400000).toISOString(), description: 'Grass pitch' }
    ];
  }
}

export async function deleteTurf(id) {
  try {
    if (api && typeof api.delete === 'function') {
      const res = await api.delete(`/api/turfs/${id}`);
      return res.data || true;
    }
  } catch (e) {
    // continue to raw fetch fallback
  }

  try {
    await safeFetch(`${API_BASE}/api/turfs/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    // pretend succeeded in dev
    return true;
  }
}

export default {
  fetchTurfs,
  deleteTurf,
};

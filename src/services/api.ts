import { pharmacies, Pharmacy } from './data';

export interface SearchParams {
  q?: string;
  loc?: string;
  insurance?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function searchPharmacies(params: SearchParams): Promise<Pharmacy[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.loc) queryParams.set('loc', params.loc);
    if (params.insurance) queryParams.set('insurance', params.insurance);
    
    const response = await fetch(`${API_BASE}/pharmacies?${queryParams.toString()}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API unavailable, using mock data', error);
  }
  
  // Fallback to mock data
  const { q, loc, insurance } = params;
  let results = pharmacies;
  if (loc) {
    results = results.filter(p => p.sector.toLowerCase().includes(loc.toLowerCase()));
  }
  if (insurance) {
    results = results.filter(p => p.accepts.map(a => a.toLowerCase()).includes(insurance.toLowerCase()));
  }
  if (q) {
    results = results.filter(p => p.stocks.some(s => s.name.toLowerCase().includes(q.toLowerCase())));
  }
  await new Promise(r => setTimeout(r, 200));
  return results;
}

export async function getPharmacy(id: string): Promise<Pharmacy | undefined> {
  try {
    const response = await fetch(`${API_BASE}/pharmacies/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API unavailable, using mock data', error);
  }
  
  // Fallback to mock data
  await new Promise(r => setTimeout(r, 150));
  return pharmacies.find(p => p.id === id);
}



import { apiFetch, setAuthToken, clearAuthToken } from './client.js';
import { Item, Room, Household, DashboardData } from '../types/inventory.types.js';

export const api = {
  // Items
  async getItems(params?: { room_id?: string; category?: string; dressing_status?: string; search?: string }): Promise<Item[]> {
    const searchParams = new URLSearchParams();
    if (params?.room_id) searchParams.set('room_id', params.room_id);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.dressing_status) searchParams.set('dressing_status', params.dressing_status);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return apiFetch<Item[]>(`/items${qs ? `?${qs}` : ''}`);
  },

  async createItem(payload: any, photoFile?: File): Promise<Item> {
    if (photoFile) {
      const formData = new FormData();
      Object.keys(payload).forEach((k) => {
        if (payload[k] !== undefined && payload[k] !== null) {
          formData.append(k, String(payload[k]));
        }
      });
      formData.append('photo', photoFile);
      return apiFetch<Item>('/items', { method: 'POST', body: formData });
    }
    return apiFetch<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async checkDuplicates(name: string): Promise<Array<{ id: string; name: string; room_name: string; category: string; photo_url: string | null }>> {
    if (!name || name.trim().length < 2) return [];
    return apiFetch(`/items/check-duplicates?name=${encodeURIComponent(name.trim())}`);
  },

  async getItemById(id: string): Promise<Item> {
    return apiFetch<Item>(`/items/${id}`);
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    return apiFetch<Item>(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteItem(id: string): Promise<void> {
    return apiFetch<void>(`/items/${id}`, { method: 'DELETE' });
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    return apiFetch<Room[]>('/rooms');
  },

  async createRoom(name: string, icon = 'door'): Promise<Room> {
    return apiFetch<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify({ name, icon }),
    });
  },

  async updateRoom(id: string, data: { name?: string; icon?: string }): Promise<Room> {
    return apiFetch<Room>(`/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteRoom(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  // Dashboard & Household
  async getDashboard(): Promise<DashboardData> {
    return apiFetch<DashboardData>('/dashboard');
  },

  async getHousehold(): Promise<Household> {
    return apiFetch<Household>('/household');
  },

  // Auth
  async register(data: { email: string; name: string; password: string; invite_code?: string; household_name?: string }) {
    const res = await apiFetch<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  logout() {
    clearAuthToken();
  },
};

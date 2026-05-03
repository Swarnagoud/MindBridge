const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  register: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  chat: async (message, token, language = 'en') => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message, language })
    });
    return res.json();
  },
  addMood: async (mood, note, token) => {
    const res = await fetch(`${API_BASE}/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mood, note })
    });
    return res.json();
  },
  getMoods: async (token) => {
    const res = await fetch(`${API_BASE}/mood`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  getRecommendations: async (token) => {
    const res = await fetch(`${API_BASE}/recommend`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  getCounselors: async (token) => {
    const res = await fetch(`${API_BASE}/counselors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  createBooking: async (data, token) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getBookings: async (token) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  cancelBooking: async (id, token) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};

export default api;
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Accept both `https://...` and `https://.../api` in env without breaking existing setups.
const API_BASE = rawBase.replace(/\/+$/, '').endsWith('/api')
  ? rawBase.replace(/\/+$/, '')
  : `${rawBase.replace(/\/+$/, '')}/api`;

const safeJson = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Non-JSON response (HTTP ${res.status})`);
  }
  return res.json();
};

const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return safeJson(res);
  },
  register: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return safeJson(res);
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
    return safeJson(res);
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
    return safeJson(res);
  },
  getMoods: async (token) => {
    const res = await fetch(`${API_BASE}/mood`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return safeJson(res);
  },
  getRecommendations: async (token) => {
    const res = await fetch(`${API_BASE}/recommend`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return safeJson(res);
  },
  getCounselors: async (token) => {
    const res = await fetch(`${API_BASE}/counselors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return safeJson(res);
  },
  createBooking: async (data, token) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return safeJson(res);
  },
  getBookings: async (token) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return safeJson(res);
  },
  cancelBooking: async (id, token) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return safeJson(res);
  },
  unlockJournal: async (password, token) => {
    const res = await fetch(`${API_BASE}/journal/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ password })
    });
    return safeJson(res);
  },
  getJournals: async (token, journalToken) => {
    const res = await fetch(`${API_BASE}/journal`, {
      headers: { 'Authorization': `Bearer ${token}`, 'X-Journal-Token': journalToken }
    });
    return safeJson(res);
  },
  createJournal: async (data, token, journalToken) => {
    const res = await fetch(`${API_BASE}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Journal-Token': journalToken
      },
      body: JSON.stringify(data)
    });
    return safeJson(res);
  },
  updateJournal: async (id, data, token, journalToken) => {
    const res = await fetch(`${API_BASE}/journal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Journal-Token': journalToken
      },
      body: JSON.stringify(data)
    });
    return safeJson(res);
  },
  deleteJournal: async (id, token, journalToken) => {
    const res = await fetch(`${API_BASE}/journal/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'X-Journal-Token': journalToken }
    });
    return safeJson(res);
  }
};

export default api;

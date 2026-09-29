const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
   window.location.port === '5173'
    ? 'http://127.0.0.1:8000'
    : '')
).replace(/\/+$/, '');

function getAuthHeaders() {
  const token = localStorage.getItem('dealmemory_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getAdminAuthHeaders() {
  const token = localStorage.getItem('dealmemory_admin_token') || localStorage.getItem('dealmemory_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend health');
  return res.json();
}

// ----------------- Company Auth Endpoints -----------------

export async function registerCompany(formData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to submit company registration');
  }
  return data;
}

export const registerUser = registerCompany;

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Invalid email or password');
  }
  return data;
}

export async function fetchMe() {
  const token = localStorage.getItem('dealmemory_token');
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    localStorage.removeItem('dealmemory_token');
    return null;
  }
  return res.json();
}

export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('dealmemory_token');
  }
}

export async function updateUserProfile(profileData) {
  return { user: profileData };
}

// ----------------- Admin Portal Endpoints -----------------

export async function adminLogin({ email, password }) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Invalid administrator credentials');
  }
  return data;
}

export const adminLoginUser = adminLogin;

export async function fetchAdminMe() {
  const token = localStorage.getItem('dealmemory_admin_token');
  if (!token) return null;
  const res = await fetch(`${API_BASE}/admin/auth/me`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    localStorage.removeItem('dealmemory_admin_token');
    return null;
  }
  return res.json();
}

export const adminFetchMe = fetchAdminMe;

export async function adminLogout() {
  try {
    await fetch(`${API_BASE}/admin/auth/logout`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
    });
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('dealmemory_admin_token');
  }
}

export const adminLogoutUser = adminLogout;

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to load admin stats');
  }
  return res.json();
}

export async function fetchAdminCompanies(statusFilter = 'all') {
  let url = `${API_BASE}/admin/companies`;
  if (statusFilter && statusFilter !== 'all') {
    url += `?status_filter=${statusFilter}`;
  }
  const res = await fetch(url, { headers: getAdminAuthHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch companies');
  }
  return res.json();
}

export async function fetchAdminCompanyDetail(companyId) {
  const res = await fetch(`${API_BASE}/admin/companies/${companyId}`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch company details');
  }
  return res.json();
}

export async function fetchAdminRequests() {
  const res = await fetch(`${API_BASE}/admin/requests`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch access requests');
  }
  return res.json();
}

export async function approveCompanyRequest(companyId) {
  const res = await fetch(`${API_BASE}/admin/requests/${companyId}/approve`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to approve company request');
  }
  return res.json();
}

export async function rejectCompanyRequest(companyId) {
  const res = await fetch(`${API_BASE}/admin/requests/${companyId}/reject`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to reject company request');
  }
  return res.json();
}

export const approveAdminRequest = approveCompanyRequest;
export const rejectAdminRequest = rejectCompanyRequest;

export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch platform users');
  }
  return res.json();
}

export async function fetchAdminConversations() {
  const res = await fetch(`${API_BASE}/admin/conversations`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch support conversations');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.conversations || []);
}

export async function sendAdminSupportMessage(companyId, message) {
  const res = await fetch(`${API_BASE}/admin/conversations/${companyId}`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to send support reply');
  }
  return res.json();
}

export async function fetchAdminActivity(limit = 50) {
  const res = await fetch(`${API_BASE}/admin/activity?limit=${limit}`, {
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch platform activity');
  }
  return res.json();
}

// ----------------- Company Support Messages -----------------

export async function fetchSupportMessages() {
  const res = await fetch(`${API_BASE}/support/messages`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch support messages');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.messages || []);
}

export async function sendSupportMessage(message) {
  const res = await fetch(`${API_BASE}/support/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to send support message');
  }
  return res.json();
}

export const fetchCompanySupportMessages = fetchSupportMessages;
export const sendCompanySupportMessage = sendSupportMessage;

// ----------------- Company Deals & Customers -----------------

export async function fetchDeals(includeDemo = true) {
  const res = await fetch(`${API_BASE}/deals?include_demo=${includeDemo}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('dealmemory_token');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deals');
  }
  return res.json();
}

export async function createDeal(dealData) {
  const res = await fetch(`${API_BASE}/deals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dealData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create deal');
  }
  return res.json();
}

export async function deleteDeal(dealId) {
  const res = await fetch(`${API_BASE}/deals/${dealId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete deal');
  }
  return res.json();
}

export async function fetchCompanyCustomers() {
  const res = await fetch(`${API_BASE}/deals/customers`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to fetch customers');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.customers || []);
}

export async function createCompanyCustomer(customerData) {
  const res = await fetch(`${API_BASE}/deals/customers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(customerData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to create customer');
  }
  return res.json();
}

// ----------------- History Endpoints -----------------

export async function fetchHistory(activityType = 'all', dealId = 'all', limit = 50) {
  let url = `${API_BASE}/history?limit=${limit}`;
  if (activityType && activityType !== 'all') url += `&activity_type=${activityType}`;
  if (dealId && dealId !== 'all') url += `&deal_id=${dealId}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('dealmemory_token');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch user history');
  }
  return res.json();
}

export async function deleteHistoryItem(activityId) {
  const res = await fetch(`${API_BASE}/history/${activityId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete activity item');
  }
  return res.json();
}

// ----------------- Hindsight Core Deal Intelligence -----------------

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/deals/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch dashboard stats');
  }
  return res.json();
}

export async function fetchDealIntelligence(dealId) {
  if (!dealId) return null;
  const res = await fetch(`${API_BASE}/deals/${dealId}/intelligence`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deal intelligence');
  }
  return res.json();
}

export async function fetchDealOverview(dealId = '') {
  if (!dealId) return null;
  const res = await fetch(`${API_BASE}/deals/${dealId}/overview`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch deal overview');
  }
  return res.json();
}

export async function fetchDealMemory(dealId = '', query = '', tag = '') {
  if (!dealId) return { memories: [] };
  let url = `${API_BASE}/deals/${dealId}/memory?max_tokens=3000`;
  if (query) url += `&query=${encodeURIComponent(query)}`;
  if (tag) url += `&tag=${encodeURIComponent(tag)}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to recall memories from Hindsight');
  }
  return res.json();
}

export async function triggerMeetingPrep(dealId = '') {
  if (!dealId) return null;
  const res = await fetch(`${API_BASE}/deals/${dealId}/prepare`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Meeting preparation failed');
  }
  return res.json();
}

export const fetchMeetingPrep = triggerMeetingPrep;

export async function fetchLearnedInsights(dealId = '') {
  if (!dealId) return { learned_insights: [] };
  const res = await fetch(`${API_BASE}/deals/${dealId}/reflect`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to trigger learning reflection');
  }
  return res.json();
}

export function formatDisplayDate(dateVal, includeTime = false) {
  if (!dateVal) return 'Recent';
  try {
    let d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      const str = String(dateVal).replace(' ', 'T');
      d = new Date(str.endsWith('Z') || str.includes('+') ? str : str + 'Z');
    }
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {}),
    });
  } catch {
    return String(dateVal);
  }
}

export async function fetchAgentState(dealId = '') {
  const url = dealId
    ? `${API_BASE}/deals/agent/state?deal_id=${encodeURIComponent(dealId)}`
    : `${API_BASE}/deals/agent/state`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch DealMemory agent state');
  }
  return res.json();
}

export async function askDealAgent(dealId = 'agent', question) {
  const targetDeal = dealId || 'agent';
  const res = await fetch(`${API_BASE}/deals/${targetDeal}/ask`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to get answer from DealMemory Agent');
  }
  return res.json();
}

export async function createInteraction(dealId = '', data) {
  const targetId = dealId || 'general';
  const res = await fetch(`${API_BASE}/deals/${targetId}/interactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store interaction in Hindsight');
  }
  return res.json();
}

export const postInteraction = createInteraction;

export async function createOutcome(dealId = '', data) {
  const targetId = dealId || 'general';
  const res = await fetch(`${API_BASE}/deals/${targetId}/outcomes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to store outcome in Hindsight');
  }
  return res.json();
}

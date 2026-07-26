const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
}

// User Profile
export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

// Audit Targets
export async function fetchAuditTargets(orgId) {
  const res = await fetch(`${API_BASE}/audit-targets/organization/${orgId}`, {
    headers: getAuthHeaders(),
  });
  console.log('Fetched targets:', res.data);
  if (!res.ok) throw new Error('Failed to fetch audit targets');
  return res.json();
}

export async function createAuditTarget(data) {
  const res = await fetch(`${API_BASE}/audit-targets`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create audit target');
  return res.json();
}

export async function pauseAuditTarget(targetId) {
  const res = await fetch(`${API_BASE}/audit-targets/${targetId}/pause`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to pause target');
  return res.json();
}

export async function activateAuditTarget(targetId) {
  const res = await fetch(`${API_BASE}/audit-targets/${targetId}/activate`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to activate target');
  return res.json();
}

// Audits & Documents
export async function submitDocument(targetId, file) {
  const formData = new FormData();
  formData.append('auditTargetId', targetId);
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/audits/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit document');
  return res.json();
}

export async function fetchAuditsByTarget(targetId) {
  const res = await fetch(`${API_BASE}/audits/target/${targetId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch audits');
  return res.json();
}

export async function fetchAuditById(auditId) {
  const res = await fetch(`${API_BASE}/audits/${auditId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch audit details');
  return res.json();
}

export async function fetchAuditFindings(auditId) {
  const res = await fetch(`${API_BASE}/audits/${auditId}/findings`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch audit findings');
  return res.json();
}

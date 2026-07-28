let RAW_BASE = import.meta.env.VITE_API_BASE_URL;
RAW_BASE = RAW_BASE.trim().replace(/\/+$/, '');
if (!RAW_BASE.startsWith('http://') && !RAW_BASE.startsWith('https://')) {
  RAW_BASE = `https://${RAW_BASE}`;
}
const API_BASE_URL = RAW_BASE;

export async function registerUser(data) {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resultText = await response.text();
  if (!response.ok) {
    throw new Error(resultText || 'Registration failed');
  }
  return resultText; // e.g. "Saved" or "User Already Registered"
}

/**
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const tokenOrFail = await response.text();
  if (!response.ok || tokenOrFail === 'Fail') {
    throw new Error('Invalid email or password');
  }
  return tokenOrFail; // Returns the JWT token string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1/auth';

/**
 * Register a new user and organization
 * @param {Object} data - { fName, lName, email, password, organizationName, organizationSlug }
 */
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

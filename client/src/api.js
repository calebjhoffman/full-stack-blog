import { fetchWithAuth } from './fetchWithAuth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Auth
export async function signup(data) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  return res.json();
}

export async function logout() {
  return fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

export async function getMe() {
  const res = await fetchWithAuth('/auth/me');
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

// Posts (authenticated)
export async function getUserPosts() {
  const res = await fetchWithAuth('/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function createPost(data) {
  const res = await fetchWithAuth('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

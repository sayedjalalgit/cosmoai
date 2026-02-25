const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Store token in memory
let authToken: string | null = null

export function setToken(token: string) {
  authToken = token
  localStorage.setItem('cosmoai_token', token)
}

export function getToken(): string | null {
  if (authToken) return authToken
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('cosmoai_token')
  }
  return authToken
}

export function clearToken() {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cosmoai_token')
    localStorage.removeItem('cosmoai_user')
  }
}

// Auth API
export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Registration failed')
  }
  return res.json()
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Login failed')
  }
  return res.json()
}

export async function getMe() {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

// Chat API
export async function sendMessage(
  message: string,
  language: string = 'auto',
  conversationId?: string
) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      language,
      conversation_id: conversationId || null,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to send message')
  }
  return res.json()
}

export async function getConversations() {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to get conversations')
  return res.json()
}

export async function getConversation(id: string) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to get conversation')
  return res.json()
}

export async function deleteConversation(id: string) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete conversation')
  return res.json()
}

export async function rateMessage(
  convId: string,
  msgId: string,
  rating: number
) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(
    `${API_URL}/chat/conversations/${convId}/messages/${msgId}/rate?rating=${rating}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!res.ok) throw new Error('Failed to rate message')
  return res.json()
}
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

export async function sendMessageStream(
  message: string,
  language: string = 'auto',
  conversationId?: string,
  model?: string,
  image?: string,
  onToken: (token: string) => void = () => {},
  onDone: (messageId: string, convId: string) => void = () => {},
  onError: (error: string) => void = () => {}
) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      language,
      conversation_id: conversationId || null,
      model: model || null,
      image: image || null,
    }),
  })

  if (!res.ok) throw new Error('Stream failed')

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) throw new Error('No reader')

  let convId = conversationId || ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))

          if (data.type === 'start') {
            convId = data.conversation_id
          } else if (data.type === 'token') {
            onToken(data.content)
          } else if (data.type === 'done') {
            onDone(data.message_id, convId)
          } else if (data.type === 'error') {
            onError(data.message)
          }
        } catch {
          // skip invalid JSON
        }
      }
    }
  }
}
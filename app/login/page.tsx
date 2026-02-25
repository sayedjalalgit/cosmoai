'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser, setToken } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')

    try {
      let data
      if (isLogin) {
        data = await loginUser(email, password)
      } else {
        if (!name) { setError('Name is required'); setLoading(false); return }
        data = await registerUser(name, email, password)
      }
      setToken(data.access_token)
      localStorage.setItem('cosmoai_user', JSON.stringify(data.user))
      router.push('/chat')
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'DM Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    marginBottom: '12px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛸</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '24px', fontWeight: 800,
            letterSpacing: '3px',
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>COSMOAI</h1>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '8px',
          marginBottom: '24px',
        }}>
          {['Login', 'Register'].map((tab, i) => (
            <button key={tab} onClick={() => setIsLogin(i === 0)} style={{
              flex: 1, padding: '10px',
              border: `1px solid ${(i === 0) === isLogin ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              background: (i === 0) === isLogin ? 'var(--glow)' : 'transparent',
              color: (i === 0) === isLogin ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px', letterSpacing: '1px',
              cursor: 'pointer',
            }}>{tab.toUpperCase()}</button>
          ))}
        </div>

        {/* Form */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ ...inputStyle, marginBottom: '20px' }}
        />

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(255,95,109,0.1)',
            border: '1px solid rgba(255,95,109,0.3)',
            borderRadius: '8px',
            color: '#FF5F6D',
            fontSize: '12px',
            marginBottom: '16px',
          }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border: 'none',
            borderRadius: '8px',
            color: '#080C10',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'PLEASE WAIT...' : isLogin ? 'LOGIN' : 'REGISTER'}
        </button>
      </div>
    </div>
  )
}
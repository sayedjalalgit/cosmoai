'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccess() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push('/chat')
    }
  }, [countdown])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080C10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Mono, monospace',
      color: '#E8EDF2',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '48px',
        border: '1px solid rgba(99,210,255,0.2)',
        borderRadius: '20px',
        background: 'rgba(99,210,255,0.04)',
        maxWidth: '480px',
      }}>

        <div style={{
          fontSize: '64px',
          marginBottom: '24px',
          animation: 'bounce 1s ease infinite',
        }}>🛸</div>

        <div style={{
          fontSize: '11px',
          letterSpacing: '4px',
          color: 'rgba(99,210,255,0.5)',
          marginBottom: '16px',
        }}>PAYMENT SUCCESSFUL</div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(90deg, #63D2FF, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        }}>
          Welcome to COSMOAI!
        </h1>

        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.8',
          marginBottom: '32px',
        }}>
          Your subscription is now active.
          You have full access to all features.
        </p>

        <div style={{
          padding: '16px',
          border: '1px solid rgba(99,210,255,0.1)',
          borderRadius: '10px',
          background: 'rgba(99,210,255,0.04)',
          marginBottom: '24px',
          fontSize: '11px',
          color: '#6B7280',
        }}>
          ✅ Unlimited messages unlocked<br/>
          ✅ All AI models available<br/>
          ✅ Document uploads enabled<br/>
          ✅ Image vision enabled
        </div>

        <div style={{
          fontSize: '12px',
          color: '#6B7280',
          marginBottom: '20px',
        }}>
          Redirecting to chat in{' '}
          <span style={{ color: '#63D2FF', fontWeight: 700 }}>{countdown}</span>
          {' '}seconds...
        </div>

        <button
          onClick={() => router.push('/chat')}
          style={{
            padding: '12px 32px',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #63D2FF, #A78BFA)',
            color: '#080C10',
            fontSize: '11px',
            letterSpacing: '3px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
          }}>
          START CHATTING NOW
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
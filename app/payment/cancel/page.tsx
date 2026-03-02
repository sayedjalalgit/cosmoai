'use client'

import { useRouter } from 'next/navigation'

export default function PaymentCancel() {
  const router = useRouter()

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
        border: '1px solid rgba(255,95,109,0.2)',
        borderRadius: '20px',
        background: 'rgba(255,95,109,0.04)',
        maxWidth: '480px',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛸</div>

        <div style={{
          fontSize: '11px',
          letterSpacing: '4px',
          color: 'rgba(255,95,109,0.5)',
          marginBottom: '16px',
        }}>PAYMENT CANCELLED</div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '36px',
          fontWeight: 800,
          color: '#E8EDF2',
          marginBottom: '16px',
        }}>No Problem!</h1>

        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.8',
          marginBottom: '32px',
        }}>
          You can upgrade anytime.
          Your free account is still active.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              padding: '12px 24px',
              border: '1px solid rgba(99,210,255,0.3)',
              borderRadius: '10px',
              background: 'transparent',
              color: '#63D2FF',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
            }}>
            VIEW PLANS
          </button>

          <button
            onClick={() => router.push('/chat')}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #63D2FF, #A78BFA)',
              color: '#080C10',
              fontSize: '11px',
              letterSpacing: '2px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
            }}>
            GO TO CHAT
          </button>
        </div>
      </div>
    </div>
  )
}

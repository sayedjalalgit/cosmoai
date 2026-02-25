'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      padding: '40px 20px',
      textAlign: 'center',
    }}>

      <div style={{
        fontSize: '72px', marginBottom: '32px',
        filter: 'drop-shadow(0 0 40px rgba(99,210,255,0.6))',
        animation: 'float 3s ease-in-out infinite',
      }}>🛸</div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '56px', fontWeight: 800,
        letterSpacing: '6px',
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px',
      }}>COSMOAI</h1>

      <p style={{
        fontSize: '14px', color: 'var(--muted)',
        letterSpacing: '2px', marginBottom: '8px',
      }}>PRIVATE INTELLIGENCE SYSTEM</p>

      <p style={{
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: '15px', color: 'var(--muted)',
        marginBottom: '48px',
      }}>আপনার ব্যক্তিগত AI সহকারী</p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => router.push('/login')} style={{
          padding: '14px 36px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          border: 'none', borderRadius: '10px',
          color: '#080C10', fontFamily: 'Syne, sans-serif',
          fontWeight: 700, fontSize: '14px',
          letterSpacing: '2px', cursor: 'pointer',
          boxShadow: '0 0 30px rgba(99,210,255,0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          START CHATTING
        </button>

        <button style={{
          padding: '14px 36px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          color: 'var(--text)', fontFamily: 'Syne, sans-serif',
          fontWeight: 600, fontSize: '14px',
          letterSpacing: '2px', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = 'var(--accent)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text)'
        }}>
          LEARN MORE
        </button>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px', marginTop: '80px',
        maxWidth: '700px', width: '100%',
      }}>
        {[
          { icon: '🔒', title: 'Private', desc: 'Your data stays secure' },
          { icon: '⚡', title: 'Ultra Fast', desc: 'Powered by Groq LPU' },
          { icon: '🌐', title: 'Bilingual', desc: 'Bangla and English' },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '24px 20px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            background: 'var(--bg2)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700, fontSize: '14px',
              letterSpacing: '1px', marginBottom: '6px',
              color: 'var(--accent)',
            }}>{f.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

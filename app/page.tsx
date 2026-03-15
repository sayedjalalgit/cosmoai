'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{

      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '40px 20px',
      textAlign: 'center',
      boxSizing: 'border-box',
    }}>

      <div style={{
        fontSize: '64px',
        marginBottom: '28px',
        filter: 'drop-shadow(0 0 40px rgba(99,210,255,0.6))',
        animation: 'float 3s ease-in-out infinite',
      }}>🛸</div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(32px, 10vw, 56px)',
        fontWeight: 800,
        letterSpacing: 'clamp(2px, 2vw, 6px)',
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px',
        width: '100%',
      }}>COSMOAI</h1>

      <p style={{
        fontSize: '13px',
        color: 'var(--muted)',
        letterSpacing: '2px',
        marginBottom: '8px',
      }}>PRIVATE INTELLIGENCE SYSTEM</p>

      <p style={{
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: '15px',
        color: 'var(--muted)',
        marginBottom: '40px',
      }}>আপনার ব্যক্তিগত AI সহকারী</p>

      <p style={{
        fontSize: '13px',
        color: 'var(--text)',
        maxWidth: '320px',
        lineHeight: '1.6',
        marginBottom: '12px',
        opacity: 0.7,
      }}>
        Your private intelligence system. Ask anything in English or Bangla.
      </p>

      <p style={{
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: '14px',
        color: 'var(--muted)',
        marginBottom: '40px',
      }}>আপনার প্রশ্ন বাংলা বা ইংরেজিতে লিখুন</p>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
      }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border: 'none',
            borderRadius: '10px',
            color: '#080C10',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '2px',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(99,210,255,0.4)',
            transition: 'all 0.2s',
            flex: '1',
            minWidth: '140px',
          }}>
          START CHATTING
        </button>

        <button
          onClick={() => router.push('/pricing')}
          style={{
            padding: '14px 24px',
            border: '1px solid rgba(167,139,250,0.4)',
            borderRadius: '10px',
            background: 'transparent',
            color: '#A78BFA',
            fontSize: '13px',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
            transition: 'all 0.2s',
            flex: '1',
            minWidth: '120px',
          }}>
          VIEW PRICING
        </button>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '14px',
        marginTop: '60px',
        maxWidth: '500px',
        width: '100%',
      }}>
        {[
          { icon: '🔒', title: 'Private', desc: 'Your data stays secure' },
          { icon: '⚡', title: 'Ultra Fast', desc: 'Powered by Groq LPU' },
          { icon: '🌐', title: 'Bilingual', desc: 'Bangla and English' },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '20px 16px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            background: 'var(--bg2)',
          }}>
            <div style={{ fontSize: '26px', marginBottom: '10px' }}>{f.icon}</div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '1px',
              marginBottom: '6px',
              color: 'var(--accent)',
            }}>{f.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

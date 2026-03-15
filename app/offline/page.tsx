export const viewport = {
  width: 'device-width',
  initialScale: 1,
}
export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080C10',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '64px' }}>🛸</div>
      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: '28px',
        letterSpacing: '3px',
        background: 'linear-gradient(90deg, #63D2FF, #4ADE80)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>COSMOAI</h1>
      <p style={{
        color: '#6B7280',
        fontFamily: 'DM Mono, monospace',
        fontSize: '13px',
        letterSpacing: '1px',
        maxWidth: '280px',
        lineHeight: '1.6',
      }}>
        You are offline. Please check your internet connection and try again.
      </p>
      <p style={{
        color: '#6B7280',
        fontFamily: 'Hind Siliguri, sans-serif',
        fontSize: '14px',
        maxWidth: '280px',
        lineHeight: '1.6',
      }}>
        আপনি অফলাইনে আছেন। ইন্টারনেট সংযোগ চেক করুন।
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '10px',
          padding: '10px 24px',
          background: 'transparent',
          border: '1px solid #63D2FF',
          borderRadius: '8px',
          color: '#63D2FF',
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          letterSpacing: '2px',
          cursor: 'pointer',
        }}
      >
        TRY AGAIN
      </button>
    </div>
  )
}

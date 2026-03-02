'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/lib/types'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  onSuggestion: (text: string) => void
}

const suggestions = [
  { icon: '🌐', text: 'বাংলাদেশের অর্থনীতি সম্পর্কে বলুন' },
  { icon: '💡', text: 'Explain artificial intelligence simply' },
  { icon: '📊', text: 'What are the latest tech trends?' },
  { icon: '🚀', text: 'How to start a tech business?' },
]

export default function ChatWindow({ messages, isLoading, onSuggestion }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isBangla = (text: string) => /[\u0980-\u09FF]/.test(text)

  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)
  }

  if (messages.length === 0) {
    return (
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        animation: 'fadeIn 0.6s ease',
      }}>
        {/* Welcome */}
        <div style={{
          fontSize: '56px', marginBottom: '24px',
          filter: 'drop-shadow(0 0 30px rgba(99,210,255,0.5))',
          animation: 'float 3s ease-in-out infinite',
        }}>🛸</div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '40px', fontWeight: 800,
          letterSpacing: '4px',
          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>COSMOAI</h1>

        <p style={{
          fontSize: '13px', color: 'var(--muted)',
          maxWidth: '400px', lineHeight: '1.7',
          textAlign: 'center', marginBottom: '8px',
        }}>
          Your private intelligence system. Ask anything in English or Bangla.
        </p>

        <p style={{
          fontFamily: 'Hind Siliguri, sans-serif',
          fontSize: '14px', color: 'var(--muted)',
          marginBottom: '40px',
        }}>
          আপনার প্রশ্ন বাংলা বা ইংরেজিতে লিখুন
        </p>

        {/* Suggestions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          maxWidth: '560px', width: '100%',
        }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onSuggestion(s.text)} style={{
              padding: '14px 16px',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              background: 'var(--bg2)',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'var(--muted)',
              textAlign: 'left',
              transition: 'all 0.2s',
              lineHeight: '1.5',
              fontFamily: isBangla(s.text) ? 'Hind Siliguri, sans-serif' : 'DM Mono, monospace',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.background = 'var(--glow)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
              e.currentTarget.style.background = 'var(--bg2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}>
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '6px' }}>{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>

      {messages.map(msg => (
        <div key={msg.id} style={{
          padding: '8px 24px',
          display: 'flex',
          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          gap: '12px',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          animation: 'slideUp 0.3s ease',
        }}>

          {/* AI Avatar */}
          {msg.role === 'assistant' && (
            <div style={{
              width: '32px', height: '32px', minWidth: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', marginTop: '4px',
              boxShadow: '0 0 16px rgba(99,210,255,0.2)',
            }}>🛸</div>
          )}

          {/* Message Bubble */}
          <div style={{
            maxWidth: '72%',
            padding: '14px 18px',
            borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: msg.role === 'user' ? '#0E2030' : 'var(--bg2)',
            border: msg.role === 'user'
              ? '1px solid rgba(99,210,255,0.15)'
              : '1px solid var(--border)',
            fontSize: isBangla(msg.content) ? '14px' : '13px',
            fontFamily: isBangla(msg.content)
              ? 'Hind Siliguri, sans-serif'
              : 'DM Mono, monospace',
            lineHeight: '1.75',
            color: 'var(--text)',
          }}>

            {/* Show image if attached */}
            {msg.image && (
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={msg.image}
                  alt="uploaded"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    display: 'block',
                    border: '1px solid var(--border)',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}

            {/* Message text */}
            {formatContent(msg.content)}
          </div>
        </div>
      ))}

      {/* Typing indicator — only show when no content yet */}
      {isLoading && messages[messages.length - 1]?.content === '' && (
        <div style={{
          padding: '8px 24px',
          display: 'flex',
          gap: '12px',
          maxWidth: '900px',
          margin: '0 auto',
          animation: 'slideUp 0.3s ease',
        }}>
          <div style={{
            width: '32px', height: '32px', minWidth: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>🛸</div>
          <div style={{
            padding: '14px 18px',
            borderRadius: '14px 14px 14px 4px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex', gap: '5px', alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: `typingBounce 1.2s infinite ${i * 0.2}s`,
              }} />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
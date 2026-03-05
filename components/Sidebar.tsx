'use client'

import { useState, useEffect } from 'react'
import { Conversation } from '@/lib/types'
import { MessageSquare, Plus, Trash2, X, Menu } from 'lucide-react'

interface SidebarProps {
  conversations: Conversation[]
  currentId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  language: 'en' | 'bn' | 'auto'
  onLanguageChange: (lang: 'en' | 'bn' | 'auto') => void
  onLogout: () => void
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function Sidebar({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  language,
  onLanguageChange,
  onLogout,
  selectedModel,
  onModelChange,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when selecting conversation on mobile
  const handleSelect = (id: string) => {
    onSelect(id)
    if (isMobile) setIsOpen(false)
  }

  const handleNew = () => {
    onNew()
    if (isMobile) setIsOpen(false)
  }

  const sidebarContent = (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: isMobile ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: 1000,
      transition: 'transform 0.3s ease',
      transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 0 20px rgba(99,210,255,0.3)',
            }}>🛸</div>
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '3px',
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>COSMOAI</span>
          </div>

          {/* Close button — mobile only */}
          {isMobile && (
            <button onClick={() => setIsOpen(false)} style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <button onClick={handleNew} style={{
          width: '100%',
          padding: '10px 14px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          letterSpacing: '1px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
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
          <Plus size={14} />
          NEW CONVERSATION
        </button>
      </div>

      {/* Language Toggle */}
      <div style={{
        display: 'flex', gap: '6px',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        {(['en', 'bn', 'auto'] as const).map(lang => (
          <button key={lang} onClick={() => onLanguageChange(lang)} style={{
            flex: 1,
            padding: '7px',
            border: `1px solid ${language === lang ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            background: language === lang ? 'var(--glow)' : 'transparent',
            color: language === lang ? 'var(--accent)' : 'var(--muted)',
            fontFamily: lang === 'bn' ? 'Hind Siliguri, sans-serif' : 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: lang === 'bn' ? '0' : '1px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {lang === 'en' ? 'EN' : lang === 'bn' ? 'বাং' : 'AUTO'}
          </button>
        ))}
      </div>

      {/* Model Selector */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'var(--muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}>AI Model</div>

        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '7px',
            color: 'var(--text)',
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            cursor: 'pointer',
            outline: 'none',
          }}>
          <option value="llama-3.3-70b-versatile">🧠 Smart — Best for most tasks</option>
          <option value="llama-3.1-8b-instant">⚡ Flash — Ultra fast replies</option>
          <option value="openai/gpt-oss-120b">🔬 Genius — Most powerful</option>
          <option value="openai/gpt-oss-20b">🚀 Turbo — Fast & capable</option>
          <option value="qwen/qwen3-32b">🌐 Multilingual — Best for Bangla</option>
          <option value="moonshotai/kimi-k2-instruct-0905">💡 Reasoning — Deep thinking</option>
          <option value="meta-llama/llama-4-scout-17b-16e-instruct">👁️ Vision — Understands images</option>
        </select>
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'var(--muted)',
          padding: '4px 8px 10px',
          textTransform: 'uppercase',
        }}>Recent</div>

        {conversations.length === 0 && (
          <div style={{
            fontSize: '12px',
            color: 'var(--muted)',
            padding: '8px',
            textAlign: 'center',
          }}>No conversations yet</div>
        )}

        {conversations.map(conv => (
          <div key={conv.id}
            onClick={() => handleSelect(conv.id)}
            style={{
              padding: '9px 12px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '12px',
              color: currentId === conv.id ? 'var(--text)' : 'var(--muted)',
              background: currentId === conv.id ? 'var(--bg3)' : 'transparent',
              borderLeft: currentId === conv.id ? '2px solid var(--accent)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '2px',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <MessageSquare size={12} style={{ minWidth: '12px', color: 'var(--muted)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title}</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onDelete(conv.id) }}
              style={{
                background: 'none', border: 'none',
                color: 'var(--muted)', cursor: 'pointer',
                padding: '2px', borderRadius: '4px',
                display: 'flex', alignItems: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a3a5c, #0a2040)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', color: 'var(--accent)',
          }}>U</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text)' }}>User</div>
            <div style={{ fontSize: '10px', color: 'var(--accent2)', letterSpacing: '1px' }}>PRO PLAN</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--muted)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          padding: '5px 8px',
          cursor: 'pointer',
          letterSpacing: '1px',
        }}>OUT</button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Hamburger button — mobile only */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 999,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,210,255,0.15)',
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay — mobile only */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {sidebarContent}
    </>
  )
}
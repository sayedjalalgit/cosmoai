'use client'

import { useState } from 'react'
import { Conversation } from '@/lib/types'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'

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
  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
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

        {/* New Chat Button */}
        <button onClick={onNew} style={{
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
          <option value="llama-3.3-70b-versatile">🦙 Llama 3.3 70B — General</option>
          <option value="llama-3.1-8b-instant">⚡ Llama 3.1 8B — Ultra Fast</option>
          <option value="openai/gpt-oss-120b">🤖 GPT OSS 120B — Powerful</option>
          <option value="openai/gpt-oss-20b">🚀 GPT OSS 20B — Fast</option>
          <option value="qwen/qwen3-32b">🌐 Qwen 3 32B — Multilingual</option>
          <option value="moonshotai/kimi-k2-instruct-0905">🌙 Kimi K2 — Best Reasoning</option>
          <option value="meta-llama/llama-4-scout-17b-16e-instruct">🔭 Llama 4 Scout — Vision</option>
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
            onClick={() => onSelect(conv.id)}
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
}
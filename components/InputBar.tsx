'use client'

import { useRef, useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { getToken } from '@/lib/api'

interface InputBarProps {
  onSend: (message: string) => void
  isLoading: boolean
  language: 'en' | 'bn' | 'auto'
}

export default function InputBar({ onSend, isLoading, language }: InputBarProps) {
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const placeholder =
    language === 'bn'
      ? 'আপনার প্রশ্ন লিখুন...'
      : language === 'en'
      ? 'Ask anything...'
      : 'Ask anything... / যেকোনো প্রশ্ন করুন...'

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const token = getToken()

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8000/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(`Upload failed: ${err.detail}`)
        return
      }

      const data = await res.json()
      setUploadedDocs(prev => [...prev, file.name])
      alert(`✅ ${file.name} uploaded!\n${data.chunks} chunks processed.\nYou can now ask questions about this document.`)
    } catch (err) {
      alert('Upload failed. Make sure backend is running.')
    }

    setUploading(false)
    e.target.value = ''
  }

  const removeDoc = (index: number) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{
      padding: '16px 24px 20px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Upload Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}>
          {/* Upload Button */}
          <label style={{
            padding: '6px 12px',
            border: `1px dashed ${uploading ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '7px',
            color: uploading ? 'var(--accent)' : 'var(--muted)',
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '1px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
            }
          }}>
            <Paperclip size={12} />
            {uploading ? 'UPLOADING...' : 'UPLOAD PDF'}
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>

          {/* Uploaded file tags */}
          {uploadedDocs.map((doc, i) => (
            <div key={i} style={{
              padding: '4px 10px',
              background: 'rgba(99,210,255,0.08)',
              border: '1px solid rgba(99,210,255,0.2)',
              borderRadius: '20px',
              fontSize: '11px',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              📄 {doc}
              <button
                onClick={() => removeDoc(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  lineHeight: 1,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}>×</button>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            rows={1}
            style={{
              width: '100%',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '16px 56px 16px 18px',
              color: 'var(--text)',
              fontFamily: language === 'bn' ? 'Hind Siliguri, sans-serif' : 'DM Mono, monospace',
              fontSize: language === 'bn' ? '14px' : '13px',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
              minHeight: '54px',
              maxHeight: '160px',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,210,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            style={{
              position: 'absolute',
              right: '12px', bottom: '12px',
              width: '34px', height: '34px',
              borderRadius: '8px',
              background: text.trim() && !isLoading
                ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                : 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: text.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: text.trim() && !isLoading ? '0 0 14px rgba(99,210,255,0.3)' : 'none',
            }}>
            <Send size={14} color={text.trim() && !isLoading ? '#080C10' : 'var(--muted)'} />
          </button>
        </div>

        {/* Hint */}
        <div style={{
          textAlign: 'center',
          fontSize: '10px',
          color: 'var(--muted)',
          marginTop: '10px',
          letterSpacing: '1px',
        }}>
          ENTER to send · SHIFT+ENTER for new line · COSMOAI Private Intelligence
        </div>
      </div>
    </div>
  )
}
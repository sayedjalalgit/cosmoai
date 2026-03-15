'use client'

import { useRef, useState, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { getToken } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface InputBarProps {
  onSend: (message: string, image?: string) => void
  isLoading: boolean
  language: 'en' | 'bn' | 'auto'
  selectedModel: string
}

export default function InputBar({ onSend, isLoading, language, selectedModel }: InputBarProps) {
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    onSend(text.trim(), imageBase64 || undefined)
    setText('')
    setImageBase64(null)
    setImagePreview(null)
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
      const res = await fetch(`${API_URL}/documents/upload`, {
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
      alert(`✅ ${file.name} uploaded!\n${data.chunks} chunks processed.`)
    } catch (err) {
      alert('Upload failed. Make sure backend is running.')
    }

    setUploading(false)
    e.target.value = ''
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setImageBase64(base64)
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeImage = () => {
    setImageBase64(null)
    setImagePreview(null)
  }

  const removeDoc = (index: number) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{
      padding: isMobile ? '10px 12px 14px' : '16px 24px 20px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
      flexShrink: 0,
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Upload Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          flexWrap: 'wrap',
        }}>
          {/* PDF Upload */}
          <label style={{
            padding: '5px 10px',
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

          {/* Image Upload — vision model only */}
          {selectedModel.includes('llama-4') && (
            <label style={{
              padding: '5px 10px',
              border: '1px dashed var(--border)',
              borderRadius: '7px',
              color: 'var(--muted)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}>
              🖼️ IMAGE
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  height: '36px',
                  width: '36px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid var(--accent)',
                }}
              />
              <button
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '-6px', right: '-6px',
                  width: '16px', height: '16px',
                  borderRadius: '50%',
                  background: '#FF5F6D',
                  border: 'none',
                  color: 'white',
                  fontSize: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>×</button>
            </div>
          )}

          {/* Uploaded doc tags */}
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
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
                  flexShrink: 0,
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
              padding: '14px 52px 14px 16px',
              color: 'var(--text)',
              fontFamily: language === 'bn' ? 'Hind Siliguri, sans-serif' : 'DM Mono, monospace',
              fontSize: language === 'bn' ? '14px' : '13px',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
              minHeight: '50px',
              maxHeight: '160px',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,210,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            style={{
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: text.trim() && !isLoading
                ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                : 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: text.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
            <Send size={13} color={text.trim() && !isLoading ? '#080C10' : 'var(--muted)'} />
          </button>
        </div>

        {/* Hint — hidden on mobile */}
        {!isMobile && (
          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            color: 'var(--muted)',
            marginTop: '8px',
            letterSpacing: '1px',
          }}>
            ENTER to send · SHIFT+ENTER for new line · COSMOAI Private Intelligence
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import InputBar from '@/components/InputBar'
import { Message, Conversation } from '@/lib/types'
import {
  sendMessageStream,
  getConversations,
  getConversation,
  deleteConversation,
  getToken,
  clearToken
} from '@/lib/api'

export default function ChatPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'bn' | 'auto'>('auto')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const data = await getConversations()
      const convs: Conversation[] = data.map((c: any) => ({
        id: c.id,
        title: c.title,
        messages: [],
        createdAt: new Date(c.created_at),
      }))
      setConversations(convs)
    } catch {
      router.push('/login')
    }
  }

  const handleSelect = useCallback(async (id: string) => {
    setCurrentId(id)
    try {
      const data = await getConversation(id)
      const msgs: Message[] = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
      }))
      setMessages(msgs)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const createNewConversation = useCallback(() => {
    setCurrentId(null)
    setMessages([])
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (currentId === id) {
        setCurrentId(null)
        setMessages([])
      }
    } catch (err) {
      console.error(err)
    }
  }, [currentId])

  const handleSend = useCallback(async (text: string, image?: string) => {
    if (isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      image: image,
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const tempId = (Date.now() + 1).toString()
    const aiMsg: Message = {
      id: tempId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMsg])

    try {
      await sendMessageStream(
        text,
        language,
        currentId || undefined,
        selectedModel,
        image,
        (token) => {
          setMessages(prev => prev.map(m =>
            m.id === tempId ? { ...m, content: m.content + token } : m
          ))
        },
        (messageId, convId) => {
          if (!currentId) {
            setCurrentId(convId)
            const newConv: Conversation = {
              id: convId,
              title: text.slice(0, 40),
              messages: [],
              createdAt: new Date(),
            }
            setConversations(prev => [newConv, ...prev])
          }
          setMessages(prev => prev.map(m =>
            m.id === tempId ? { ...m, id: messageId } : m
          ))
          setIsLoading(false)
        },
        (error) => {
          setMessages(prev => prev.map(m =>
            m.id === tempId ? { ...m, content: `Error: ${error}` } : m
          ))
          setIsLoading(false)
        }
      )
    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, content: `Error: ${err.message}` } : m
      ))
      setIsLoading(false)
    }
  }, [currentId, isLoading, language, selectedModel])

  const handleLogout = () => {
    clearToken()
    router.push('/login')
  }

  const currentConv = conversations.find(c => c.id === currentId)

  // Model display name
  const modelDisplay =
    selectedModel.includes('llama-4') ? '👁️ Vision' :
    selectedModel.includes('kimi') ? '💡 Reasoning' :
    selectedModel.includes('qwen') ? '🌐 Multilingual' :
    selectedModel.includes('gpt-oss-120b') ? '🔬 Genius' :
    selectedModel.includes('gpt-oss-20b') ? '🚀 Turbo' :
    selectedModel.includes('llama-3.1') ? '⚡ Flash' :
    '🧠 Smart'

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      height: '100dvh', // dynamic viewport height — fixes mobile browser bar
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>

      <Sidebar
        conversations={conversations}
        currentId={currentId}
        onSelect={handleSelect}
        onNew={createNewConversation}
        onDelete={handleDelete}
        language={language}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Main content — full width on mobile */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        minWidth: 0, // prevents flex overflow
      }}>

        {/* Top bar */}
        <div style={{
          padding: isMobile ? '12px 16px 12px 56px' : '16px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg2)',
          flexShrink: 0,
        }}>
          {/* Title */}
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '11px' : '13px',
            fontWeight: 600,
            letterSpacing: isMobile ? '1px' : '3px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: isMobile ? '120px' : '300px',
          }}>
            {currentConv?.title || 'COSMOAI'}
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px',
            flexShrink: 0,
          }}>

            {/* Upgrade Button */}
            <button
              onClick={() => router.push('/pricing')}
              style={{
                padding: isMobile ? '4px 8px' : '4px 12px',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: '20px',
                background: 'transparent',
                color: '#A78BFA',
                fontSize: '10px',
                letterSpacing: isMobile ? '0px' : '2px',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>
              ⚡ {isMobile ? '' : 'UPGRADE'}
            </button>

            {/* Model Badge — hidden on small mobile */}
            {!isMobile && (
              <span style={{
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                fontSize: '10px',
                letterSpacing: '1px',
                color: 'var(--accent2)',
                whiteSpace: 'nowrap',
              }}>
                {modelDisplay} · GROQ
              </span>
            )}

            {/* Model Badge — compact on mobile */}
            {isMobile && (
              <span style={{
                padding: '4px 8px',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                fontSize: '10px',
                color: 'var(--accent2)',
                whiteSpace: 'nowrap',
              }}>
                {modelDisplay}
              </span>
            )}

            {/* Green dot */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent2)',
              boxShadow: '0 0 8px var(--accent2)',
              flexShrink: 0,
            }} />
          </div>
        </div>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSuggestion={(text) => handleSend(text)}
        />

        <InputBar
          onSend={handleSend}
          isLoading={isLoading}
          language={language}
          selectedModel={selectedModel}
        />
      </main>
    </div>
  )
}

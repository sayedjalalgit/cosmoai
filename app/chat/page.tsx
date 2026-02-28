'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import InputBar from '@/components/InputBar'
import { Message, Conversation } from '@/lib/types'
import {
  sendMessage,
  sendMessageStream,
  getConversations,
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

  // Check auth on load
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
      const { getConversation } = await import('@/lib/api')
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

  const handleSend = useCallback(async (text: string) => {
    if (isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    // Add empty AI message that will be filled by streaming
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

        // onToken — append each word
        (token) => {
          setMessages(prev => prev.map(m =>
            m.id === tempId
              ? { ...m, content: m.content + token }
              : m
          ))
        },

        // onDone — update IDs
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

        // onError
        (error) => {
          setMessages(prev => prev.map(m =>
            m.id === tempId
              ? { ...m, content: `Error: ${error}` }
              : m
          ))
          setIsLoading(false)
        }
      )
    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.id === tempId
          ? { ...m, content: `Error: ${err.message}` }
          : m
      ))
      setIsLoading(false)
    }
  }, [currentId, isLoading, language, selectedModel])

  const handleLogout = () => {
    clearToken()
    router.push('/login')
  }

  const currentConv = conversations.find(c => c.id === currentId)

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>

  

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

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div style={{
          padding: '16px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg2)',
        }}>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '13px', fontWeight: 600,
            letterSpacing: '3px', color: 'var(--muted)',
            textTransform: 'uppercase',
          }}>
            {currentConv?.title || 'Private Intelligence System'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '4px 10px',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              fontSize: '10px', letterSpacing: '1px',
              color: 'var(--accent2)',
            }}>LLAMA 3.3 · GROQ</span>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent2)',
              boxShadow: '0 0 8px var(--accent2)',
            }} />
          </div>
        </div>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSuggestion={handleSend}
        />

        <InputBar
          onSend={handleSend}
          isLoading={isLoading}
          language={language}
        />
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const plans = [
  {
    id: 'free',
    name: 'FREE',
    price_usd: 0,
    price_bdt: 0,
    badge: null,
    color: '#6B7280',
    glow: 'rgba(107,114,128,0.15)',
    messages: '20 / day',
    documents: '1',
    models: 'Llama 3.3 only',
    features: [
      '20 messages per day',
      '1 document upload',
      'Llama 3.3 model',
      'Web search',
      'Bangla + English',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    price_usd: 9.99,
    price_bdt: 1100,
    badge: 'MOST POPULAR',
    color: '#63D2FF',
    glow: 'rgba(99,210,255,0.2)',
    messages: 'Unlimited',
    documents: '10',
    models: 'All 7 models',
    features: [
      'Unlimited messages',
      '10 document uploads',
      'All 7 AI models',
      'Web search',
      'Image vision',
      'Bangla + English',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price_usd: 29.99,
    price_bdt: 3300,
    badge: 'BEST VALUE',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.2)',
    messages: 'Unlimited',
    documents: '50',
    models: 'All models + API',
    features: [
      'Everything in Pro',
      '50 document uploads',
      'API access',
      'Team workspace',
      'Analytics dashboard',
      'Dedicated support',
    ],
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price_usd: 99.99,
    price_bdt: 11000,
    badge: null,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.2)',
    messages: 'Unlimited',
    documents: 'Unlimited',
    models: 'All + Custom',
    features: [
      'Everything in Business',
      'Unlimited documents',
      'Private deployment',
      'Custom model training',
      'SLA guarantee',
      '24/7 dedicated support',
    ],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState<'usd' | 'bdt'>('usd')
  const [loading, setLoading] = useState<string | null>(null)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      router.push('/chat')
      return
    }

    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(planId)
    try {
      const res = await fetch(`${API_URL}/payments/checkout/${planId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      alert('Checkout failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080C10',
      color: '#E8EDF2',
      fontFamily: 'DM Mono, monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(99,210,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,210,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'fixed',
        top: '-20%', left: '20%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(99,210,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%', right: '10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>

          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            style={{
              position: 'absolute', top: '24px', left: '24px',
              background: 'none', border: '1px solid rgba(99,210,255,0.2)',
              borderRadius: '8px', padding: '8px 16px',
              color: 'rgba(99,210,255,0.6)', cursor: 'pointer',
              fontSize: '11px', letterSpacing: '2px',
              fontFamily: 'DM Mono, monospace',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99,210,255,0.6)'
              e.currentTarget.style.color = '#63D2FF'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(99,210,255,0.2)'
              e.currentTarget.style.color = 'rgba(99,210,255,0.6)'
            }}>
            ← BACK
          </button>

          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛸</div>

          <div style={{
            fontSize: '11px', letterSpacing: '6px',
            color: 'rgba(99,210,255,0.5)',
            marginBottom: '16px',
          }}>COSMOAI PRICING</div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #63D2FF, #A78BFA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}>
            Choose Your Plan
          </h1>

          <p style={{
            fontSize: '13px', color: '#6B7280',
            maxWidth: '480px', margin: '0 auto 32px',
            lineHeight: '1.8',
          }}>
            Private AI intelligence for Bangladesh and the world.
            Start free, upgrade when ready.
          </p>

          {/* Currency Toggle */}
          <div style={{
            display: 'inline-flex',
            border: '1px solid rgba(99,210,255,0.15)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}>
            {(['usd', 'bdt'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  padding: '8px 24px',
                  background: currency === c
                    ? 'rgba(99,210,255,0.1)'
                    : 'transparent',
                  border: 'none',
                  color: currency === c ? '#63D2FF' : '#6B7280',
                  cursor: 'pointer',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  fontFamily: 'DM Mono, monospace',
                  transition: 'all 0.2s',
                }}>
                {c === 'usd' ? '$ USD' : '৳ BDT'}
              </button>
            ))}
          </div>

          {currency === 'bdt' && (
            <p style={{ fontSize: '10px', color: '#6B7280', letterSpacing: '1px' }}>
              PRICES IN BANGLADESHI TAKA
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}>
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                position: 'relative',
                border: `1px solid ${hoveredPlan === plan.id
                  ? plan.color
                  : plan.id === 'pro'
                    ? 'rgba(99,210,255,0.3)'
                    : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '16px',
                padding: '32px 28px',
                background: hoveredPlan === plan.id
                  ? plan.glow
                  : plan.id === 'pro'
                    ? 'rgba(99,210,255,0.04)'
                    : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                transform: hoveredPlan === plan.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredPlan === plan.id
                  ? `0 20px 60px ${plan.glow}`
                  : plan.id === 'pro'
                    ? '0 0 40px rgba(99,210,255,0.08)'
                    : 'none',
                opacity: mounted ? 1 : 0,
                animation: mounted ? `fadeUp 0.5s ease ${index * 0.1}s both` : 'none',
              }}>

              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color,
                  color: '#080C10',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div style={{
                fontSize: '11px',
                letterSpacing: '4px',
                color: plan.color,
                marginBottom: '16px',
              }}>
                {plan.name}
              </div>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '44px',
                  fontWeight: 800,
                  color: '#E8EDF2',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {plan.price_usd === 0 ? 'FREE' : (
                    <>
                      {currency === 'usd' ? '$' : '৳'}
                      {currency === 'usd' ? plan.price_usd : plan.price_bdt}
                    </>
                  )}
                </div>
                {plan.price_usd > 0 && (
                  <div style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '1px' }}>
                    PER MONTH
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                {[
                  { label: 'MESSAGES', value: plan.messages },
                  { label: 'DOCUMENTS', value: plan.documents },
                  { label: 'MODELS', value: plan.models },
                ].map(stat => (
                  <div key={stat.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: '10px',
                  }}>
                    <span style={{ color: '#6B7280', letterSpacing: '1px' }}>{stat.label}</span>
                    <span style={{ color: plan.color, fontWeight: 600 }}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div style={{ marginBottom: '28px' }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 0',
                    fontSize: '11px',
                    color: '#9CA3AF',
                    letterSpacing: '0.5px',
                  }}>
                    <span style={{ color: plan.color, fontSize: '14px' }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: `1px solid ${plan.color}`,
                  background: plan.id === 'pro'
                    ? `linear-gradient(135deg, ${plan.color}, #A78BFA)`
                    : 'transparent',
                  color: plan.id === 'pro' ? '#080C10' : plan.color,
                  fontSize: '11px',
                  letterSpacing: '3px',
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 700,
                  cursor: loading === plan.id ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading === plan.id ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (plan.id !== 'pro') {
                    e.currentTarget.style.background = plan.glow
                  }
                }}
                onMouseLeave={e => {
                  if (plan.id !== 'pro') {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}>
                {loading === plan.id ? 'LOADING...' :
                  plan.id === 'free' ? 'START FREE' :
                  plan.id === 'enterprise' ? 'CONTACT US' :
                  'GET STARTED'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <div style={{
            fontSize: '11px', letterSpacing: '4px',
            color: 'rgba(99,210,255,0.4)',
            marginBottom: '40px',
          }}>FREQUENTLY ASKED</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime from your account settings. You keep access until the end of your billing period.'
              },
              {
                q: 'Is my data private?',
                a: 'Absolutely. Your documents and conversations are private and never shared with third parties.'
              },
              {
                q: 'Do you support bKash?',
                a: 'bKash and local payment options coming soon for Bangladesh users.'
              },
              {
                q: 'What is the enterprise plan?',
                a: 'Enterprise includes private deployment on your own server with no data leaving your organization.'
              },
            ].map((faq, i) => (
              <div key={i} style={{
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  fontSize: '12px', color: '#E8EDF2',
                  marginBottom: '8px', fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>{faq.q}</div>
                <div style={{
                  fontSize: '11px', color: '#6B7280',
                  lineHeight: '1.7', letterSpacing: '0.3px',
                }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          fontSize: '10px',
          color: '#374151',
          letterSpacing: '2px',
        }}>
          COSMOAI · PRIVATE INTELLIGENCE · BUILT FOR BANGLADESH AND THE WORLD
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

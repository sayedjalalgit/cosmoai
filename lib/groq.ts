export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function sendToGroq(
  messages: GroqMessage[],
  language: 'en' | 'bn' | 'auto' = 'auto'
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY

  const langInstruction =
    language === 'bn'
      ? 'Always respond in Bangla (Bengali). Use Bangla script only.'
      : language === 'en'
      ? 'Always respond in English.'
      : 'Detect the language of the user message and respond in the same language. If Bangla respond in Bangla. If English respond in English.'

  const systemPrompt = `You are COSMOAI, an intelligent and elegant private AI assistant built for Bangladesh and the world. You are helpful, precise, and professional.

${langInstruction}

Guidelines:
- Be clear and well structured
- Use bullet points when listing items
- Be concise but complete
- If you do not know something say so clearly
- Always be respectful and professional`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Groq API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}
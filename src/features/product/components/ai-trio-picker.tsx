import { useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'

import { FLAVORS } from '@/features/product/constants/product-data'
import { logger } from '@/shared/utils/logger'

import type { Flavor } from '@/shared/types/glossier'

interface AITrioPickerProps {
  onSelectTrio: (flavors: Flavor[]) => void
}

export function AITrioPicker({ onSelectTrio }: AITrioPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt) return
    setLoading(true)
    setError('')

    try {
      const apiKey = ''
      const userQuery = `
        You are a helpful shopping assistant. Pick 3 distinct lip balm flavors from the list below that best match the user's request.
        List: ${FLAVORS.map((f) => f.id + ': ' + f.name + ' (' + f.description + ')').join(', ')}
        User Request: ${prompt}
        Output format: JSON array of strings (IDs only). Example: ["rose", "mint", "coconut"]
        Do not include markdown formatting or explanations. Just the JSON array.
      `

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: userQuery }] }] }),
        }
      )

      if (!response.ok) throw new Error('API Call failed')

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (text) {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const pickedIds: string[] = JSON.parse(cleanedText)
        const selectedFlavors = pickedIds
          .map((id) => FLAVORS.find((f) => f.id === id))
          .filter((f): f is Flavor => f !== undefined)

        if (selectedFlavors.length === 3) {
          onSelectTrio(selectedFlavors)
          setIsOpen(false)
          setPrompt('')
        } else {
          setError("Couldn't find enough matching flavors. Try again!")
        }
      }
    } catch (e) {
      logger.error(e)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-6 bg-linear-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-black py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-all font-medium border border-transparent hover:border-pink-300"
      >
        <Sparkles className="w-5 h-5 text-purple-600" />
        <span className="text-base">AI Mood Matcher</span>
      </button>
    )
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-sm relative animate-in fade-in slide-in-from-top-2">
      <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-black">
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-base font-bold mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        Describe your vibe
      </h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. A cozy winter night by the fire..."
        className="w-full text-sm p-3 border border-gray-300 rounded-sm mb-3 focus:outline-none focus:border-black min-h-[80px]"
      />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="w-full bg-black text-white text-sm py-2.5 rounded-sm hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Finding perfect match...
          </>
        ) : (
          'Generate My Trio'
        )}
      </button>
    </div>
  )
}


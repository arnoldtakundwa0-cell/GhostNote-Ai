import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import VoiceRecorder from './components/VoiceRecorder'
import ArtistSelector from './components/ArtistSelector'
import PaymentButton from './components/PaymentButton'
import AudioPlayer from './components/AudioPlayer'
import { useRecorderStore } from './hooks/useRecorder'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

export default function App() {
  const [convertedURL, setConvertedURL] = useState<string | null>(null)
  const [style, setStyle] = useState("juice_wrld")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioBlob = useRecorderStore(state => state.audioBlob)
  const recordingURL = useRecorderStore(state => state.recordingURL)

  // Check if we came back from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const session = urlParams.get('session_id')
    if (session) {
      setSessionId(session)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const pay = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/payments/create-checkout`)
      setSessionId(res.data.session_id)
      window.location.href = res.data.url // goes to Stripe
    } catch (err) {
      setError('Payment failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const convert = async () => {
    if (!audioBlob || !sessionId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const fd = new FormData()
      fd.append("file", audioBlob)
      fd.append("style", style)
      fd.append("session_id", sessionId)
      
      const res = await axios.post(`${API_URL}/api/transform/convert`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setConvertedURL(res.data.audio_url)
    } catch (err) {
      setError('Conversion failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
          GHOSTNOTE AI
        </h1>
        <p className="text-gray-400 mb-2">Turn your voice into legend</p>
        <p className="text-sm text-gray-500">Record, transform, collaborate</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {!recordingURL ? (
          // Recording Phase
          <VoiceRecorder />
        ) : !convertedURL ? (
          // Processing Phase
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Your Recording</h2>
              <AudioPlayer src={recordingURL} />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Choose Artist Style</h2>
              <ArtistSelector value={style} onChange={setStyle} />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Transform Your Voice</h2>
              <PaymentButton 
                onClick={sessionId ? convert : pay}
                disabled={loading}
                paid={!!sessionId}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          // Result Phase
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg border border-purple-500 text-center">
              <p className="text-2xl font-bold mb-2">✨ Your GhostNote ✨</p>
              <p className="text-gray-300 text-sm">Your voice has been transformed!</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Transformed Audio</h2>
              <AudioPlayer src={convertedURL} />
              <a 
                href={convertedURL} 
                download="ghostnote.wav" 
                className="block mt-6 w-full bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full font-bold text-center transition"
              >
                ⬇️ Download MP3
              </a>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-full font-bold transition"
            >
              Create Another
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 GhostNote AI. All rights reserved.</p>
      </div>
    </div>
  )
}

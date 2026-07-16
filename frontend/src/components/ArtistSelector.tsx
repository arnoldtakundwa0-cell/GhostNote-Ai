import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

interface Artist {
  id: string
  name: string
  genre: string
  description: string
  preview_available: boolean
}

interface ArtistSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function ArtistSelector({ value, onChange }: ArtistSelectorProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/transform/artists`)
        setArtists(res.data)
      } catch (err) {
        console.error(err)
        // Fallback artists if API fails
        setArtists([
          { id: 'juice_wrld', name: 'Juice WRLD', genre: 'Hip-Hop/Rap', description: 'Iconic melodic rap with signature autotune', preview_available: true },
          { id: 'the_weeknd', name: 'The Weeknd', genre: 'R&B/Pop', description: 'Smooth R&B vocals', preview_available: true },
          { id: 'drake', name: 'Drake', genre: 'Hip-Hop', description: 'Toronto rap legend', preview_available: true },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchArtists()
  }, [])

  if (loading) {
    return <div className="text-gray-400">Loading artists...</div>
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {artists.map(artist => (
          <button
            key={artist.id}
            onClick={() => onChange(artist.id)}
            className={`p-4 rounded-lg border-2 transition text-left ${
              value === artist.id
                ? 'border-purple-500 bg-purple-900'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="font-bold">{artist.name}</div>
            <div className="text-sm text-gray-400">{artist.genre}</div>
            <div className="text-xs text-gray-500 mt-1">{artist.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

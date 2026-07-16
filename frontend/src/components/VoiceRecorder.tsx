import { useRecorderStore } from '../hooks/useRecorder'
import AudioPlayer from './AudioPlayer'

export default function VoiceRecorder() {
  const recording = useRecorderStore(state => state.recording)
  const recordingURL = useRecorderStore(state => state.recordingURL)
  const start = useRecorderStore(state => state.start)
  const stop = useRecorderStore(state => state.stop)
  const reset = useRecorderStore(state => state.reset)

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center">
        <h2 className="text-2xl font-bold mb-6">Record Your Voice</h2>
        
        <button 
          onClick={recording ? stop : start} 
          className="bg-red-600 hover:bg-red-700 px-10 py-5 rounded-full text-2xl font-bold transition transform hover:scale-105"
        >
          {recording ? '⏹ Stop Recording' : '🎤 Record'}
        </button>

        {recording && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-400">Recording...</span>
          </div>
        )}
      </div>

      {recordingURL && (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold mb-4">Preview Your Recording</h3>
          <AudioPlayer src={recordingURL} />
          <button
            onClick={reset}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
          >
            Record Again
          </button>
        </div>
      )}
    </div>
  )
}

import { create } from 'zustand'

interface RecorderStore {
  recording: boolean
  recordingURL: string | null
  audioBlob: Blob | null
  recorder: MediaRecorder | null
  chunks: BlobPart[]
  start: () => Promise<void>
  stop: () => void
  reset: () => void
}

export const useRecorderStore = create<RecorderStore>((set) => ({
  recording: false,
  recordingURL: null,
  audioBlob: null,
  recorder: null,
  chunks: [],

  start: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      let chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        set({
          recordingURL: url,
          audioBlob: blob,
          recording: false,
        })
      }

      recorder.start()
      set({ recording: true, recorder, chunks })
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  },

  stop: () => {
    set((state) => {
      if (state.recorder) {
        state.recorder.stop()
        state.recorder.stream.getTracks().forEach((track) => track.stop())
      }
      return { recording: false }
    })
  },

  reset: () => {
    set({ recordingURL: null, audioBlob: null, chunks: [] })
  },
}))

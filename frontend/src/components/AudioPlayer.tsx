interface AudioPlayerProps {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="w-full">
      <audio 
        src={src} 
        controls 
        className="w-full bg-gray-800 rounded-lg"
        style={{
          filter: 'invert(1)'
        }}
      />
    </div>
  )
}

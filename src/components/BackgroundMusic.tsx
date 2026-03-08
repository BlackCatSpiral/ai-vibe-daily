'use client'

import { useAudio } from '@/contexts/AudioContext'
import { Volume2, VolumeX } from 'lucide-react'

export function BackgroundMusic() {
  const { isMuted, toggleMute } = useAudio()

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 
                 bg-card-bg border border-neon-blue/30 rounded-full
                 hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]
                 transition-all duration-300 group"
      title={isMuted ? '开启背景音乐' : '静音'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-neon-blue animate-pulse" />
      )}
    </button>
  )
}

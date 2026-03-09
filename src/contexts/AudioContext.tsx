'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AudioContextType {
  isPlaying: boolean
  isMuted: boolean
  currentTrack: number
  trackName: string
  toggleMute: () => void
  nextTrack: () => void
  prevTrack: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// 多首背景音乐列表
const MUSIC_PLAYLIST = [
  {
    name: 'Reminiscence',
    url: '/music/Reminiscence.ogg',
    artist: 'Pixabay'
  },
  {
    name: 'Tech Ambient',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    artist: 'Pixabay'
  },
  {
    name: 'Cyberpunk',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    artist: 'Pixabay'
  },
  {
    name: 'Electronic Chill',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    artist: 'Pixabay'
  },
  {
    name: 'Lo-Fi Study',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_48f801c4a1.mp3',
    artist: 'Pixabay'
  }
]

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // 初始化音频
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const newAudio = new Audio(MUSIC_PLAYLIST[0].url)
    newAudio.loop = true
    newAudio.volume = 0.3
    setAudio(newAudio)

    // 从 localStorage 读取设置
    const savedMute = localStorage.getItem('nyan-mute')
    const savedTrack = localStorage.getItem('nyan-track')
    
    if (savedMute === 'true') {
      setIsMuted(true)
      newAudio.muted = true
    }
    
    if (savedTrack) {
      const trackIndex = parseInt(savedTrack, 10)
      if (trackIndex >= 0 && trackIndex < MUSIC_PLAYLIST.length) {
        setCurrentTrack(trackIndex)
        newAudio.src = MUSIC_PLAYLIST[trackIndex].url
      }
    }

    return () => {
      newAudio.pause()
      newAudio.src = ''
    }
  }, [])

  // 切换歌曲时更新音频源
  useEffect(() => {
    if (!audio) return
    
    const wasPlaying = !audio.paused
    audio.src = MUSIC_PLAYLIST[currentTrack].url
    audio.load()
    
    if (wasPlaying || isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.log('Auto-play blocked:', err)
        setIsPlaying(false)
      })
    }
    
    localStorage.setItem('nyan-track', String(currentTrack))
  }, [currentTrack, audio])

  // 处理用户首次交互后播放
  useEffect(() => {
    if (!audio || isPlaying) return

    const handleInteraction = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
      } catch (err) {
        console.log('Play failed:', err)
      }
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [audio, isPlaying])

  const toggleMute = useCallback(() => {
    if (!audio) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    audio.muted = newMuted
    localStorage.setItem('nyan-mute', String(newMuted))

    if (!isPlaying && !newMuted) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }, [audio, isMuted, isPlaying])

  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_PLAYLIST.length)
  }, [])

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length)
  }, [])

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      isMuted, 
      currentTrack,
      trackName: MUSIC_PLAYLIST[currentTrack].name,
      toggleMute, 
      nextTrack,
      prevTrack
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

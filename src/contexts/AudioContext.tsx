'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AudioContextType {
  isPlaying: boolean
  isMuted: boolean
  toggleMute: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

const AUDIO_URL = '/music/Reminiscence.ogg'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio(AUDIO_URL) : null)

  useEffect(() => {
    if (!audio) return

    // 配置音频
    audio.loop = true
    audio.volume = 0.3

    // 从 localStorage 读取静音设置
    const savedMute = localStorage.getItem('nyan-mute')
    if (savedMute === 'true') {
      setIsMuted(true)
      audio.muted = true
    }

    // 尝试自动播放
    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        // 自动播放被阻止，等待用户交互
        console.log('Auto-play blocked, waiting for user interaction')
      }
    }

    playAudio()

    return () => {
      audio.pause()
    }
  }, [audio])

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

    // 如果当前没在播放，尝试播放
    if (!isPlaying && !newMuted) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }, [audio, isMuted, isPlaying])

  return (
    <AudioContext.Provider value={{ isPlaying, isMuted, toggleMute }}>
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

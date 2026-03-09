'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getPlaylist, MusicTrack } from '@/config/music'

interface AudioContextType {
  isPlaying: boolean
  isMuted: boolean
  currentTrack: number
  trackName: string
  playlist: MusicTrack[]
  toggleMute: () => void
  nextTrack: () => void
  prevTrack: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// 获取播放列表
const PLAYLIST = getPlaylist()

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // 初始化音频
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (PLAYLIST.length === 0 || !PLAYLIST[0].url) {
      console.log('No music files found in playlist')
      return
    }
    
    const newAudio = new Audio(PLAYLIST[0].url)
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
      if (trackIndex >= 0 && trackIndex < PLAYLIST.length && PLAYLIST[trackIndex].url) {
        setCurrentTrack(trackIndex)
        newAudio.src = PLAYLIST[trackIndex].url
      }
    }

    return () => {
      newAudio.pause()
      newAudio.src = ''
    }
  }, [])

  // 切换歌曲时更新音频源
  useEffect(() => {
    if (!audio || PLAYLIST.length === 0) return
    
    const currentTrackData = PLAYLIST[currentTrack]
    if (!currentTrackData || !currentTrackData.url) return
    
    const wasPlaying = !audio.paused
    audio.src = currentTrackData.url
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
    if (!audio || isPlaying || PLAYLIST.length === 0) return

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
    if (PLAYLIST.length <= 1) return
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length)
  }, [])

  const prevTrack = useCallback(() => {
    if (PLAYLIST.length <= 1) return
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)
  }, [])

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      isMuted, 
      currentTrack,
      trackName: PLAYLIST[currentTrack]?.name || '暂无音乐',
      playlist: PLAYLIST,
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

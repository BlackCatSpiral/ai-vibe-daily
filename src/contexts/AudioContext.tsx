'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getPlaylist, MusicTrack } from '@/config/music'

interface AudioContextType {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTrack: number
  trackName: string
  playlist: MusicTrack[]
  currentTime: number
  duration: number
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  nextTrack: () => void
  prevTrack: () => void
  seekTo: (time: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// 获取播放列表
const PLAYLIST = getPlaylist()

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(30)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const previousVolumeRef = useRef(30)

  // 初始化音频
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (PLAYLIST.length === 0 || !PLAYLIST[0].url) {
      console.log('No music files found in playlist')
      return
    }
    
    // 从 localStorage 读取设置
    const savedMute = localStorage.getItem('nyan-mute')
    const savedTrack = localStorage.getItem('nyan-track')
    const savedVolume = localStorage.getItem('nyan-volume')
    
    const initialVolume = savedVolume ? parseInt(savedVolume, 10) : 30
    setVolumeState(initialVolume)
    previousVolumeRef.current = initialVolume
    
    const newAudio = new Audio(PLAYLIST[0].url)
    newAudio.loop = true
    newAudio.volume = initialVolume / 100
    
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

    // 监听播放进度
    const handleTimeUpdate = () => {
      setCurrentTime(newAudio.currentTime)
    }

    // 监听总时长
    const handleLoadedMetadata = () => {
      setDuration(newAudio.duration || 0)
    }

    newAudio.addEventListener('timeupdate', handleTimeUpdate)
    newAudio.addEventListener('loadedmetadata', handleLoadedMetadata)
    newAudio.addEventListener('durationchange', handleLoadedMetadata)
    
    setAudio(newAudio)

    return () => {
      newAudio.removeEventListener('timeupdate', handleTimeUpdate)
      newAudio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      newAudio.removeEventListener('durationchange', handleLoadedMetadata)
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

  const setVolume = useCallback((newVolume: number) => {
    if (!audio) return
    
    const clampedVolume = Math.max(0, Math.min(100, newVolume))
    setVolumeState(clampedVolume)
    audio.volume = clampedVolume / 100
    localStorage.setItem('nyan-volume', String(clampedVolume))
    
    // 如果音量 > 0，取消静音
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false)
      audio.muted = false
      localStorage.setItem('nyan-mute', 'false')
    }
    
    // 记住非零音量
    if (clampedVolume > 0) {
      previousVolumeRef.current = clampedVolume
    }
  }, [audio, isMuted])

  const toggleMute = useCallback(() => {
    if (!audio) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    audio.muted = newMuted
    localStorage.setItem('nyan-mute', String(newMuted))
    
    if (newMuted) {
      // 静音时记住当前音量
      previousVolumeRef.current = volume
    } else {
      // 取消静音时恢复之前的音量（如果当前是 0）
      if (volume === 0) {
        const restoredVolume = previousVolumeRef.current || 30
        setVolumeState(restoredVolume)
        audio.volume = restoredVolume / 100
        localStorage.setItem('nyan-volume', String(restoredVolume))
      }
    }
  }, [audio, isMuted, volume])

  const togglePlay = useCallback(() => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.log('Play failed:', err)
      })
    }
  }, [audio, isPlaying])

  const nextTrack = useCallback(() => {
    if (PLAYLIST.length <= 1) return
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length)
  }, [])

  const prevTrack = useCallback(() => {
    if (PLAYLIST.length <= 1) return
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)
  }, [])

  const seekTo = useCallback((time: number) => {
    if (!audio) return
    const clampedTime = Math.max(0, Math.min(duration, time))
    audio.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }, [audio, duration])

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      isMuted, 
      volume,
      currentTrack,
      currentTime,
      duration,
      trackName: PLAYLIST[currentTrack]?.name || '暂无音乐',
      playlist: PLAYLIST,
      togglePlay,
      toggleMute,
      setVolume,
      nextTrack,
      prevTrack,
      seekTo
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

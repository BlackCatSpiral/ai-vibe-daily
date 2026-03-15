'use client'

import { useState, useRef, useEffect } from 'react'
import { useAudio } from '@/contexts/AudioContext'
import { Volume2, VolumeX, Volume1, SkipForward, SkipBack, Play, Pause } from 'lucide-react'

export function BackgroundMusic() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume, nextTrack, prevTrack, trackName, currentTrack, playlist } = useAudio()
  const [showVolumeBar, setShowVolumeBar] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const volumeBarRef = useRef<HTMLDivElement>(null)
  
  const hasMultipleTracks = playlist.length > 1

  // 点击音量条设置音量
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return
    const rect = volumeBarRef.current.getBoundingClientRect()
    const percentage = ((e.clientY - rect.top) / rect.height)
    const newVolume = Math.round((1 - percentage) * 100)
    setVolume(newVolume)
  }

  // 拖拽音量
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleVolumeClick(e)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !volumeBarRef.current) return
      const rect = volumeBarRef.current.getBoundingClientRect()
      const percentage = ((e.clientY - rect.top) / rect.height)
      const newVolume = Math.round((1 - Math.max(0, Math.min(1, percentage))) * 100)
      setVolume(newVolume)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, setVolume])

  // 根据音量和静音状态显示不同的图标
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />
    if (volume < 50) return <Volume1 className="w-5 h-5" />
    return <Volume2 className="w-5 h-5" />
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 网页音乐播放器样式 */}
      <div className="bg-card-bg/95 backdrop-blur-md border border-neon-blue/30 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* 歌曲信息 */}
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-400 mb-1">正在播放</p>
          <p className="text-sm text-neon-blue font-medium truncate max-w-[160px] mx-auto">
            {trackName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentTrack + 1} / {playlist.length}
          </p>
        </div>

        {/* 进度条装饰 */}
        <div className="w-full h-1 bg-gray-700/50 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-1000"
            style={{ width: isPlaying ? '60%' : '30%' }}
          />
        </div>

        {/* 播放器按钮组 */}
        <div className="flex items-center justify-center gap-3">
          {/* 上一首 */}
          <button
            onClick={prevTrack}
            disabled={!hasMultipleTracks}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
              ${hasMultipleTracks 
                ? 'hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue' 
                : 'text-gray-600 cursor-not-allowed'}`}
            title="上一首"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* 播放/暂停 */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 
              bg-gradient-to-br from-neon-blue to-neon-purple 
              rounded-full text-white
              hover:shadow-[0_0_20px_rgba(0,245,255,0.5)]
              active:scale-95
              transition-all duration-200"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          {/* 下一首 */}
          <button
            onClick={nextTrack}
            disabled={!hasMultipleTracks}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
              ${hasMultipleTracks 
                ? 'hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue' 
                : 'text-gray-600 cursor-not-allowed'}`}
            title="下一首"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* 分隔线 */}
          <div className="w-px h-6 bg-gray-700 mx-1" />

          {/* 音量控制 - 悬停显示音量条 */}
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeBar(true)}
            onMouseLeave={() => !isDragging && setShowVolumeBar(false)}
          >
            {/* 音量条 - 悬停时显示 */}
            {showVolumeBar && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pb-2"
              >
                <div className="bg-card-bg/95 backdrop-blur-md border border-neon-blue/30 rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                  <div 
                    ref={volumeBarRef}
                    className="w-2 h-24 bg-gray-700/50 rounded-full relative cursor-pointer"
                    onClick={handleVolumeClick}
                    onMouseDown={handleMouseDown}
                  >
                    {/* 音量填充 */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neon-blue to-neon-purple rounded-full transition-all duration-100"
                      style={{ height: `${isMuted ? 0 : volume}%` }}
                    />
                    
                    {/* 音量滑块 */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-neon-blue transition-all duration-100"
                      style={{ bottom: `calc(${isMuted ? 0 : volume}% - 8px)` }}
                    />
                  </div>
                  
                  <div className="text-center mt-2">
                    <span className="text-xs text-neon-blue font-mono">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 静音/取消静音按钮 */}
            <button
              onClick={toggleMute}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                ${isMuted || volume === 0
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-neon-blue hover:bg-neon-blue/20'}`}
              title={isMuted ? '取消静音' : '静音'}
            >
              {getVolumeIcon()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

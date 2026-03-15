'use client'

import { useAudio } from '@/contexts/AudioContext'
import { Volume2, VolumeX, SkipForward, SkipBack, Play, Pause } from 'lucide-react'

export function BackgroundMusic() {
  const { isPlaying, isMuted, togglePlay, toggleMute, nextTrack, prevTrack, trackName, currentTrack, playlist } = useAudio()
  
  const hasMultipleTracks = playlist.length > 1

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

          {/* 静音 */}
          <button
            onClick={toggleMute}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
              ${isMuted 
                ? 'text-gray-500 hover:text-gray-300' 
                : 'text-neon-blue hover:bg-neon-blue/20'}`}
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

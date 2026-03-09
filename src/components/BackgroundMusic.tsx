'use client'

import { useAudio } from '@/contexts/AudioContext'
import { Volume2, VolumeX, SkipForward, SkipBack, Music } from 'lucide-react'
import { useState } from 'react'

export function BackgroundMusic() {
  const { isMuted, toggleMute, nextTrack, prevTrack, trackName, currentTrack } = useAudio()
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* 展开的控制面板 */}
      {showControls && (
        <div className="flex flex-col items-end gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* 歌曲信息 */}
          <div className="bg-card-bg border border-neon-blue/30 rounded-lg px-3 py-2 text-right">
            <p className="text-xs text-gray-400">正在播放</p>
            <p className="text-sm text-neon-blue font-medium truncate max-w-[150px]">
              {trackName}
            </p>
            <p className="text-xs text-gray-500">{currentTrack + 1} / 5</p>
          </div>
          
          {/* 切歌按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevTrack}
              className="flex items-center justify-center w-10 h-10 
                       bg-card-bg border border-neon-blue/30 rounded-full
                       hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]
                       transition-all duration-300 group"
              title="上一首"
            >
              <SkipBack className="w-4 h-4 text-gray-400 group-hover:text-neon-blue transition-colors" />
            </button>
            
            <button
              onClick={nextTrack}
              className="flex items-center justify-center w-10 h-10 
                       bg-card-bg border border-neon-blue/30 rounded-full
                       hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]
                       transition-all duration-300 group"
              title="下一首"
            >
              <SkipForward className="w-4 h-4 text-gray-400 group-hover:text-neon-blue transition-colors" />
            </button>
          </div>
        </div>
      )}
      
      {/* 主控制按钮 */}
      <div className="flex items-center gap-2">
        {/* 展开/收起按钮 */}
        <button
          onClick={() => setShowControls(!showControls)}
          className={`flex items-center justify-center w-10 h-10 
                     bg-card-bg border rounded-full
                     transition-all duration-300 group
                     ${showControls 
                       ? 'border-neon-blue shadow-[0_0_15px_rgba(0,245,255,0.3)]' 
                       : 'border-neon-blue/30 hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]'}`}
          title={showControls ? '收起' : '展开音乐控制'}
        >
          <Music className={`w-4 h-4 transition-colors ${showControls ? 'text-neon-blue' : 'text-gray-400 group-hover:text-neon-blue'}`} />
        </button>
        
        {/* 静音按钮 */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center w-12 h-12 
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
      </div>
    </div>
  )
}

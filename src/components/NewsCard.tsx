'use client'

import { useState } from 'react'
import { NewsItem } from '@/types'
import { cn } from '@/utils'

interface NewsCardProps {
  item: NewsItem
  index: number
}

const unsplashImages = [
  '1518770660439-4636190af475',
  '1555066931-4365d14bab8c',
  '1517694712202-14dd9538aa97',
  '1551288049-bebda4e38f71',
  '1558494949-ef010cbdcc31',
  '1561070791-2526d30994b5',
  '1555949963-aa79dcee981c',
  '1620712943543-bcc4688e7485',
]

const tagStyles: Record<string, string> = {
  crisis: 'bg-red-500/10 text-red-400 border-red-500/30',
  security: 'bg-red-500/10 text-red-400 border-red-500/30',
  update: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
  trend: 'bg-green-500/10 text-green-400 border-green-500/30',
  strategy: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
  default: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
}

export function NewsCard({ item, index }: NewsCardProps) {
  const imgId = unsplashImages[index % unsplashImages.length]
  const tagClass = tagStyles[item.tag_class] || tagStyles.default

  return (
    <article className="group relative bg-card-bg border border-neon-blue/20 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-neon-blue hover:shadow-[0_20px_60px_rgba(0,245,255,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <img
        src={item.image || item.image_url || `https://images.unsplash.com/photo-${imgId}?w=800&h=400&fit=crop`}
        alt={item.title}
        className="w-full h-52 object-cover border-b border-neon-blue/10"
        suppressHydrationWarning
      />
      
      <div className="p-6">
        <span className={cn('inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border mb-4', tagClass)}>
          {item.tag}
        </span>
        
        <h3 className="text-xl font-bold text-white mb-3 leading-snug">{item.title}</h3>
        
        <p className="text-gray-400 leading-relaxed mb-4">{item.summary}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
          <span className="text-neon-pink">{item.source}</span>
          <span className="text-gray-500">{item.date}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neon-blue hover:text-neon-pink transition-all hover:gap-2"
          >
            阅读全文 →
          </a>
        </div>
      </div>
    </article>
  )
}

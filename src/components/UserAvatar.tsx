'use client'

import Image from 'next/image'
import { User } from '@/types'

interface UserAvatarProps {
  user?: User
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl'
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClass = sizeClasses[size]
  
  if (user?.avatar_url) {
    return (
      <Image
        src={user.avatar_url}
        alt={user.username || '用户'}
        width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
        height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
        className={`${sizeClass} rounded-full object-cover border-2 border-neon-blue/30 ${className}`}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold ${className}`}>
      {(user?.username || 'U')[0].toUpperCase()}
    </div>
  )
}

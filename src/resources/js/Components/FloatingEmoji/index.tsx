import React from 'react'

interface FloatingEmojiProps {
    emoji: string
    position: { x: number; y: number }
    size?: 'small' | 'medium' | 'large'
    animationDelay?: number
    animationDuration?: number
    catchable?: boolean
    'data-emoji-id'?: string
}

const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl', 
    large: 'text-6xl'
}

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({
    emoji,
    position,
    size = 'medium',
    animationDelay = 0,
    animationDuration = 3,
    catchable = true,
    'data-emoji-id': emojiId
}) => {
    return (
        <div
            className={`
                absolute cursor-pointer select-none transition-all duration-300
                ${catchable ? 'hover:scale-125' : 'pointer-events-none'}
                animate-bounce ${sizeClasses[size]}
            `}
            style={{
                left: `${position.x}%`,
                top: `${position.y}px`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
                zIndex: 30
            }}
            data-emoji={emoji}
            data-emoji-id={emojiId}
        >
            {emoji}
        </div>
    )
}
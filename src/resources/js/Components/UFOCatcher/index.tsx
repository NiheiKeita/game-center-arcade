import React, { useState, useEffect, useRef, useCallback } from 'react'

interface UFOCatcherProps {
    onCatch?: () => void
    isActive?: boolean
}

export const UFOCatcher: React.FC<UFOCatcherProps> = ({ onCatch, isActive = true }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isCatching, setIsCatching] = useState(false)
    const armRef = useRef<HTMLDivElement>(null)
    const animationFrameRef = useRef<number>()

    const updatePosition = useCallback((e: MouseEvent) => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        })
    }, [])

    useEffect(() => {
        if (!isActive) return

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                setIsCatching(true)
                setTimeout(() => {
                    setIsCatching(false)
                    onCatch?.()
                }, 800)
            }
        }

        window.addEventListener('mousemove', updatePosition, { passive: true })
        window.addEventListener('mousedown', handleMouseDown)

        return () => {
            window.removeEventListener('mousemove', updatePosition)
            window.removeEventListener('mousedown', handleMouseDown)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isActive, onCatch, updatePosition])

    if (!isActive) return null
    const width = 60
    const height = 120
    const LQ = isCatching ? "18" : "12"
    const LL = isCatching ? "22" : "15"
    const RQ = isCatching ? "42" : "48"
    const RL = isCatching ? "38" : "45"

    return (
        <div
            ref={armRef}
            className="pointer-events-none fixed z-50 will-change-transform"
            style={{
                left: mousePosition.x - 30,
                top: mousePosition.y - 60,
                transform: isCatching ? 'scale(0.8)' : 'scale(1)',
                transition: isCatching ? 'transform 0.3s ease-out' : 'none',
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox="0 0 60 120"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Crane claw"
                role="img"
                className={"drop-shadow-lg"}
            >
                <defs>
                    {/* 金属ボディのグラデ */}
                    <linearGradient id="metalBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9fb4c6" />
                        <stop offset="40%" stopColor="#e6edf3" />
                        <stop offset="60%" stopColor="#a7b9c7" />
                        <stop offset="100%" stopColor="#6d7d89" />
                    </linearGradient>

                    {/* 縁のハイライト */}
                    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    {/* 爪（金属） */}
                    <linearGradient id="clawMetal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#cfd8df" />
                        <stop offset="50%" stopColor="#8d9aa5" />
                        <stop offset="100%" stopColor="#6b7780" />
                    </linearGradient>

                    {/* ケーブルのグラデ */}
                    <linearGradient id="cableGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#222" />
                        <stop offset="100%" stopColor="#555" />
                    </linearGradient>

                    {/* ガラス風のLED */}
                    <radialGradient id="ledOn" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffd86b" />
                        <stop offset="60%" stopColor="#f39c12" />
                        <stop offset="100%" stopColor="#a66400" />
                    </radialGradient>
                    <radialGradient id="ledOff" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#7ee2a4" />
                        <stop offset="60%" stopColor="#27ae60" />
                        <stop offset="100%" stopColor="#116a3a" />
                    </radialGradient>

                    {/* 内側シャドウ */}
                    <filter id="innerShadow" filterUnits="objectBoundingBox">
                        <feOffset dx="0" dy="1" />
                        <feGaussianBlur stdDeviation="1.2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0
                                               0 0 0 0 0
                                               0 0 0 0 0
                                               0 0 0 .8 0"/>
                    </filter>

                    {/* ぼかし発光（LED） */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* ボルトのメタル */}
                    <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fafafa" />
                        <stop offset="100%" stopColor="#8b97a1" />
                    </linearGradient>
                </defs>

                {/* ケーブル（わずかに弧を描く） */}
                <path
                    d="M30,0 C30,8 30,16 30,24 C30,28 30,32 30,36"
                    stroke="url(#cableGrad)"
                    strokeWidth="2.2"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* ケーブル巻取りプーリー */}
                <circle cx="30" cy="36" r="3.5" fill="#3b4750" stroke="#1e262b" strokeWidth="0.6" />

                {/* アーム本体（ハウジング） */}
                <g filter="url(#innerShadow)">
                    <rect
                        x="13.5"
                        y="35"
                        width="33"
                        height="16"
                        rx="3.5"
                        fill="url(#metalBody)"
                        stroke="#2e3b45"
                        strokeWidth="0.8"
                    />
                    {/* 上面のハイライト */}
                    <rect x="14" y="36" width="32" height="3" fill="url(#edge)" opacity="0.5" />
                    {/* 側面のエッジ */}
                    <rect x="14" y="35" width="32" height="16" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
                </g>

                {/* ボルト */}
                {[18, 30, 42].map((cx) => (
                    <g key={cx}>
                        <circle cx={cx} cy="43" r="1.6" fill="url(#boltGrad)" stroke="#5a6670" strokeWidth="0.5" />
                        <line x1={cx - 0.9} y1="43" x2={cx + 0.9} y2="43" stroke="#6c7780" strokeWidth="0.5" />
                    </g>
                ))}

                {/* アームの関節（中央ジョイント） */}
                <circle cx="30" cy="52" r="2.2" fill="url(#boltGrad)" stroke="#5a6670" strokeWidth="0.6" />

                {/* 左側のクロー（2節構造＋刃先） */}
                <g className="transition-all duration-300">
                    {/* 上節 */}
                    <path
                        d={`M 22 52 Q 16 56 ${LQ} 64`}
                        fill="none"
                        stroke="url(#clawMetal)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    {/* 下節 */}
                    <path
                        d={`M ${LQ} 64 Q ${isCatching ? 20 : 14} 70 ${LL} 72`}
                        fill="none"
                        stroke="url(#clawMetal)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* 刃先（ポリッシュ） */}
                    <path
                        d={`M ${LL} 72 L ${Number(LL) + 3} 69`}
                        stroke="#dfe6eb"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                    {/* 関節ピン */}
                    <circle cx={Number(LQ)} cy="64" r="1.6" fill="url(#boltGrad)" stroke="#5a6670" strokeWidth="0.5" />
                </g>

                {/* 右側のクロー */}
                <g className="transition-all duration-300">
                    {/* 上節 */}
                    <path
                        d={`M 38 52 Q 44 56 ${RQ} 64`}
                        fill="none"
                        stroke="url(#clawMetal)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    {/* 下節 */}
                    <path
                        d={`M ${RQ} 64 Q ${isCatching ? 40 : 46} 70 ${RL} 72`}
                        fill="none"
                        stroke="url(#clawMetal)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* 刃先 */}
                    <path
                        d={`M ${RL} 72 L ${Number(RL) - 3} 69`}
                        stroke="#dfe6eb"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                    {/* 関節ピン */}
                    <circle cx={Number(RQ)} cy="64" r="1.6" fill="url(#boltGrad)" stroke="#5a6670" strokeWidth="0.5" />
                </g>

                {/* クロー基部のヨーク（左右を繋ぐ） */}
                <path
                    d="M24 50 H36"
                    stroke="url(#clawMetal)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                />

                {/* ガラス風LED（発光） */}
                <g filter="url(#glow)">
                    <circle
                        cx="22"
                        cy="42"
                        r="2.6"
                        fill={isCatching ? "url(#ledOn)" : "url(#ledOff)"}
                    />
                    <circle
                        cx="38"
                        cy="42"
                        r="2.6"
                        fill={isCatching ? "url(#ledOn)" : "url(#ledOff)"}
                    />
                </g>

                {/* 微細な反射ライン */}
                <path d="M16 39.5 H44" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />
            </svg>
        </div>
    )
}

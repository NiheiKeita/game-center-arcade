import { useState, useCallback } from 'react'

interface GameScoreState {
    score: number
    catches: number
    combo: number
    lastCatchTime: number
}

export const useGameScore = () => {
    const [gameState, setGameState] = useState<GameScoreState>({
        score: 0,
        catches: 0,
        combo: 0,
        lastCatchTime: 0
    })

    const [showScore, setShowScore] = useState(false)
    const [recentCatch, setRecentCatch] = useState<{ emoji: string; points: number } | null>(null)

    const addScore = useCallback((emoji: string, basePoints: number) => {
        const currentTime = Date.now()
        setGameState(prev => {
            const timeDiff = currentTime - prev.lastCatchTime
            const isCombo = timeDiff < 3000 // 3秒以内なら連続キャッチ
            const newCombo = isCombo ? prev.combo + 1 : 1
            const comboBonus = Math.max(1, newCombo * 0.5) // コンボボーナス
            const finalPoints = Math.floor(basePoints * comboBonus)

            return {
                score: prev.score + finalPoints,
                catches: prev.catches + 1,
                combo: newCombo,
                lastCatchTime: currentTime
            }
        })

        // 最近のキャッチ情報を表示
        setRecentCatch({ emoji, points: basePoints })
        setShowScore(true)
        
        setTimeout(() => {
            setRecentCatch(null)
        }, 2000)
    }, [])

    const resetScore = useCallback(() => {
        setGameState({
            score: 0,
            catches: 0,
            combo: 0,
            lastCatchTime: 0
        })
        setShowScore(false)
        setRecentCatch(null)
    }, [])

    const toggleScoreDisplay = useCallback(() => {
        setShowScore(prev => !prev)
    }, [])

    return {
        ...gameState,
        showScore,
        recentCatch,
        addScore,
        resetScore,
        toggleScoreDisplay
    }
}
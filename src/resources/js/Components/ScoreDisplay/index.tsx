import React from 'react'

interface ScoreDisplayProps {
    score: number
    catches: number
    combo: number
    visible: boolean
    onToggle: () => void
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    score,
    catches,
    combo,
    visible,
    onToggle
}) => {
    return (
        <div className="fixed right-4 top-4 z-50">
            {/* トグルボタン */}
            <button
                onClick={onToggle}
                className="mb-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-3 text-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:from-yellow-300 hover:to-orange-400"
            >
                {visible ? '📊' : '🎯'}
            </button>

            {/* スコア表示パネル */}
            {visible && (
                <div className="animate-slide-in-right rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-6 text-white shadow-2xl">
                    <div className="text-center">
                        <h3 className="mb-4 text-2xl font-bold">
                            🏆 ゲームスコア
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="rounded-xl bg-white/20 p-3">
                                <div className="text-3xl font-bold text-yellow-300">
                                    {score.toLocaleString()}
                                </div>
                                <div className="text-sm">ポイント</div>
                            </div>
                            
                            <div className="flex justify-between space-x-4">
                                <div className="flex-1 rounded-lg bg-white/20 p-2 text-center">
                                    <div className="text-xl font-bold text-green-300">
                                        {catches}
                                    </div>
                                    <div className="text-xs">キャッチ</div>
                                </div>
                                
                                <div className="flex-1 rounded-lg bg-white/20 p-2 text-center">
                                    <div className="text-xl font-bold text-orange-300">
                                        {combo > 1 ? `${combo}x` : '-'}
                                    </div>
                                    <div className="text-xs">コンボ</div>
                                </div>
                            </div>
                        </div>

                        {combo > 3 && (
                            <div className="mt-3 animate-pulse text-center">
                                <div className="text-lg font-bold text-yellow-400">
                                    🔥 COMBO FIRE! 🔥
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
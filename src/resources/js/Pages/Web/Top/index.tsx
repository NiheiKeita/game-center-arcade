import { Head, Link } from '@inertiajs/react'
import WebLayout from '@/Layouts/WebLayout'
import { Button } from '@/Components/Button'
import { UFOCatcher } from '@/Components/UFOCatcher'
import { FloatingEmoji } from '@/Components/FloatingEmoji'
import { useUFOCatcher } from '@/hooks/useUFOCatcher'
import { useCallback, useState, useEffect } from 'react'

export default function Top() {
    const [floatingEmojis, setFloatingEmojis] = useState<Array<{
        id: string
        emoji: string
        position: { x: number; y: number }
        size: 'small' | 'medium' | 'large'
        animationDelay: number
        animationDuration: number
        isVisible: boolean
    }>>([])

    // ランダムな絵文字を生成する関数
    const generateRandomEmoji = useCallback(() => {
        const emojis = ['🎮', '🕹️', '🎯', '🎊', '⭐', '✨', '🎰', '🏅', '💰', '🧸', '🎈', '🌟', '🎉', '🎪', '🚀', '🎆']
        const sizes = ['small', 'medium', 'large'] as const

        return {
            id: Math.random().toString(36),
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            position: {
                x: Math.random() * 95 + 2.5, // 2.5% ~ 97.5% 画面端まで
                y: Math.random() * 3000 + 100  // 100px ~ 3100px ページ全体の高さに分散
            },
            size: sizes[Math.floor(Math.random() * sizes.length)],
            animationDelay: Math.random() * 4,      // アニメーション開始タイミングをより分散
            animationDuration: 2 + Math.random() * 4, // より多様なアニメーション速度
            isVisible: true
        }
    }, [])

    // 初期絵文字を生成
    useEffect(() => {
        const initialEmojis = Array.from({ length: 20 }, () => generateRandomEmoji())
        setFloatingEmojis(initialEmojis)
    }, [generateRandomEmoji])

    // 絵文字を一時的に隠す関数
    const hideEmoji = useCallback((id: string) => {
        setFloatingEmojis(prev => prev.map(emoji =>
            emoji.id === id ? { ...emoji, isVisible: false } : emoji
        ))

        // 3秒後に復活
        setTimeout(() => {
            setFloatingEmojis(prev => prev.map(emoji =>
                emoji.id === id ? { ...emoji, isVisible: true } : emoji
            ))
        }, 3000)
    }, [])

    const { catchButton } = useUFOCatcher({
        onButtonCatch: (buttonElement) => {
            setTimeout(() => {
                const link = buttonElement.closest('a')
                if (link) {
                    window.location.href = link.href
                } else if (buttonElement.onclick) {
                    buttonElement.click()
                }
            }, 1200)
        },
        onEmojiCatch: (emoji, element) => {
            // 絵文字を一時的に隠す
            const emojiId = element.getAttribute('data-emoji-id')
            if (emojiId) {
                hideEmoji(emojiId)
            }
        }
    })

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            catchButton(e.clientX, e.clientY)
        }
    }, [catchButton])

    return (
        <div onMouseDown={handleMouseDown}>
            <UFOCatcher />

            {/* 浮遊する絵文字たち */}
            {floatingEmojis.map((emoji) => emoji.isVisible && (
                <FloatingEmoji
                    key={emoji.id}
                    emoji={emoji.emoji}
                    position={emoji.position}
                    size={emoji.size}
                    animationDelay={emoji.animationDelay}
                    animationDuration={emoji.animationDuration}
                    catchable={true}
                    data-emoji-id={emoji.id}
                />
            ))}

            <WebLayout>
                <Head title="ゲームセンター筐体データベース" />

                {/* ネオンサイン風ヘッダー */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white">
                    {/* 背景のネオングリッド */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                            linear-gradient(cyan 1px, transparent 1px),
                            linear-gradient(90deg, cyan 1px, transparent 1px)
                        `,
                            backgroundSize: '40px 40px',
                            animation: 'grid-glow 3s ease-in-out infinite alternate'
                        }}></div>
                    </div>


                    <div className="container relative z-10 mx-auto px-4 py-20 text-center">
                        <div className="mb-6">
                            <h1 className="relative mb-4 text-6xl font-bold">
                                <span className="inline-block animate-pulse bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
                                    ゲームセンター
                                </span>
                                <br />
                                <span className="inline-block animate-pulse bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent" style={{ animationDelay: '0.5s' }}>
                                    筐体データベース
                                </span>
                            </h1>
                            <div className="animate-bounce text-2xl">🎪</div>
                        </div>
                        <p className="mb-8 text-xl font-semibold text-pink-200">
                            <span className="inline-block animate-pulse">メダルゲーム・クレーンゲームの情報を</span><br />
                            <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>管理・共有するプラットフォーム</span>
                            <span className="ml-2 inline-block animate-spin text-2xl">🎈</span>
                        </p>
                        <div className="flex justify-center space-x-6">
                            <Link href="/machines">
                                <Button variant="blue" className="transform rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-110 hover:from-cyan-400 hover:to-blue-400">
                                    🎯 筐体を探す
                                </Button>
                            </Link>
                            <Link href="/admin/login">
                                <Button variant="default" className="transform rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-pink-400 hover:to-purple-400">
                                    ⚙️ 管理画面
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 特徴セクション - ポップなカード風 */}
                <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="relative mb-4 text-4xl font-bold text-gray-800">
                                <span className="inline-block animate-pulse">🌟 サービスの特徴 🌟</span>
                            </h2>
                            <p className="text-xl font-medium text-gray-700">
                                ゲームセンターの筐体情報を効率的に管理・共有できます
                                <span className="ml-2 inline-block animate-bounce text-2xl">🎊</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="transform rounded-3xl bg-gradient-to-br from-yellow-300 to-orange-400 p-8 text-center shadow-2xl transition-all duration-300 hover:rotate-2 hover:scale-105">
                                <div className="mb-6 animate-bounce text-6xl" style={{ animationDelay: '0s' }}>🎮</div>
                                <h3 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">
                                    メダルゲーム管理
                                </h3>
                                <p className="text-lg font-semibold text-white drop-shadow">
                                    メダルゲームの筐体情報を詳細に登録・管理できます
                                </p>
                                <div className="mt-4 text-3xl">🏅</div>
                            </div>

                            <div className="transform rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 p-8 text-center shadow-2xl transition-all duration-300 hover:-rotate-2 hover:scale-105">
                                <div className="mb-6 animate-bounce text-6xl" style={{ animationDelay: '0.5s' }}>🎯</div>
                                <h3 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">
                                    クレーンゲーム管理
                                </h3>
                                <p className="text-lg font-semibold text-white drop-shadow">
                                    クレーンゲームの筐体情報と画像を一元管理
                                </p>
                                <div className="mt-4 text-3xl">🧸</div>
                            </div>

                            <div className="transform rounded-3xl bg-gradient-to-br from-green-400 to-blue-500 p-8 text-center shadow-2xl transition-all duration-300 hover:rotate-2 hover:scale-105">
                                <div className="mb-6 animate-bounce text-6xl" style={{ animationDelay: '1s' }}>📱</div>
                                <h3 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">
                                    スタンプラリー
                                </h3>
                                <p className="text-lg font-semibold text-white drop-shadow">
                                    将来的にはユーザー参加型のコレクション機能を予定
                                </p>
                                <div className="mt-4 text-3xl">🎈</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 筐体カテゴリー - レトロアーケード風 */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20">
                    {/* 背景のドット模様 */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle, #ff6b6b 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            animation: 'dots-glow 4s ease-in-out infinite'
                        }}></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="relative mb-4 text-5xl font-bold text-white">
                                <span className="animate-pulse bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                                    🕹️ 筐体カテゴリー 🕹️
                                </span>
                            </h2>
                            <p className="text-2xl font-bold text-pink-300">
                                現在管理している筐体のカテゴリー
                                <span className="ml-2 inline-block animate-spin text-3xl">🎰</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                            {/* メダルゲーム */}
                            <div className="group relative">
                                <div className="transform overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-600 via-orange-500 to-red-500 shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-105">
                                    <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
                                        <div className="animate-bounce text-9xl">🎰</div>
                                        <div className="absolute right-4 top-4 animate-spin text-4xl">🏅</div>
                                        <div className="absolute bottom-4 left-4 animate-pulse text-3xl">💰</div>
                                    </div>
                                    <div className="p-8 text-center">
                                        <h3 className="mb-4 text-3xl font-bold text-white drop-shadow-lg">
                                            🎮 メダルゲーム
                                        </h3>
                                        <p className="text-lg font-semibold text-white drop-shadow">
                                            プッシャーゲーム、スロット、ルーレット系など様々なメダルゲームの筐体情報を管理
                                        </p>
                                        <div className="mt-4 flex justify-center space-x-2">
                                            <span className="animate-bounce text-2xl">🎊</span>
                                            <span className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>🎉</span>
                                            <span className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>🎪</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* クレーンゲーム */}
                            <div className="group relative">
                                <div className="transform overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-purple-500 to-indigo-500 shadow-2xl transition-all duration-500 hover:-rotate-1 hover:scale-105">
                                    <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-pink-400 to-purple-500">
                                        <div className="animate-bounce text-9xl" style={{ animationDelay: '0.5s' }}>🎯</div>
                                        <div className="absolute right-4 top-4 animate-pulse text-4xl">🧸</div>
                                        <div className="absolute bottom-4 left-4 animate-bounce text-3xl">🎈</div>
                                    </div>
                                    <div className="p-8 text-center">
                                        <h3 className="mb-4 text-3xl font-bold text-white drop-shadow-lg">
                                            🎯 クレーンゲーム
                                        </h3>
                                        <p className="text-lg font-semibold text-white drop-shadow">
                                            UFOキャッチャー、三本爪、二本爪など各種クレーンゲームの筐体情報を管理
                                        </p>
                                        <div className="mt-4 flex justify-center space-x-2">
                                            <span className="animate-pulse text-2xl">🌟</span>
                                            <span className="animate-pulse text-2xl" style={{ animationDelay: '0.3s' }}>✨</span>
                                            <span className="animate-pulse text-2xl" style={{ animationDelay: '0.6s' }}>⭐</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA - 最終セクション */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 py-24 text-white">
                    {/* 背景エフェクト */}
                    <div className="absolute inset-0">
                        <div className="absolute left-0 top-0 h-full w-full opacity-20">
                            <div className="absolute left-10 top-10 h-4 w-4 animate-pulse rounded-full bg-yellow-400"></div>
                            <div className="absolute right-20 top-20 h-3 w-3 animate-pulse rounded-full bg-pink-400" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-20 left-1/4 h-2 w-2 animate-pulse rounded-full bg-green-400" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute bottom-32 right-1/3 h-3 w-3 animate-pulse rounded-full bg-blue-400" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <div className="mb-8">
                            <h2 className="relative mb-6 text-5xl font-bold">
                                <span className="animate-pulse bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                                    🎪 ゲームセンター筐体データベース 🎪
                                </span>
                                <br />
                                <span className="mt-4 inline-block animate-bounce text-3xl text-white">
                                    を活用しよう！
                                </span>
                            </h2>
                            <div className="mb-4 animate-bounce text-4xl">🚀</div>
                        </div>
                        <p className="mx-auto mb-12 max-w-4xl text-2xl font-bold text-purple-200">
                            筐体情報の管理から始まり、将来的には全国のユーザーと情報を共有できるプラットフォームへ
                            <span className="ml-2 inline-block animate-spin text-3xl">🌟</span>
                        </p>
                        <div className="space-y-4">
                            <Link href="/machines">
                                <Button variant="blue" className="transform animate-pulse rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 px-12 py-6 text-2xl font-bold text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:from-yellow-300 hover:via-pink-400 hover:to-purple-400">
                                    🎮 今すぐ始める 🎮
                                </Button>
                            </Link>
                            <div className="mt-8 flex justify-center space-x-4">
                                <span className="animate-bounce text-3xl">🎊</span>
                                <span className="animate-bounce text-3xl" style={{ animationDelay: '0.2s' }}>🎉</span>
                                <span className="animate-bounce text-3xl" style={{ animationDelay: '0.4s' }}>🎈</span>
                                <span className="animate-bounce text-3xl" style={{ animationDelay: '0.6s' }}>🎆</span>
                                <span className="animate-bounce text-3xl" style={{ animationDelay: '0.8s' }}>✨</span>
                            </div>
                        </div>
                    </div>
                </div>
            </WebLayout>
        </div>
    )
}

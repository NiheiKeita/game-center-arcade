import { Head, Link } from '@inertiajs/react'
import WebLayout from '@/Layouts/WebLayout'
import { Button } from '@/Components/Button'

export default function Top() {
    return (
        <WebLayout>
            <Head title="ゲームセンター筐体データベース" />

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="mb-6 text-5xl font-bold">
                        ゲームセンター筐体データベース
                    </h1>
                    <p className="mb-8 text-xl text-blue-100">
                        メダルゲーム・クレーンゲームの情報を管理・共有するプラットフォーム
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/machines">
                            <Button variant="blue" className="px-8 py-3 text-lg">
                                筐体を探す
                            </Button>
                        </Link>
                        <Link href="/admin/login">
                            <Button variant="default" className="bg-white px-8 py-3 text-lg text-blue-600">
                                管理画面
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            サービスの特徴
                        </h2>
                        <p className="text-gray-600">
                            ゲームセンターの筐体情報を効率的に管理・共有できます
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="rounded-lg bg-gray-50 p-6 text-center">
                            <div className="mb-4 text-4xl">🎮</div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                メダルゲーム管理
                            </h3>
                            <p className="text-gray-600">
                                メダルゲームの筐体情報を詳細に登録・管理できます
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-6 text-center">
                            <div className="mb-4 text-4xl">🎯</div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                クレーンゲーム管理
                            </h3>
                            <p className="text-gray-600">
                                クレーンゲームの筐体情報と画像を一元管理
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-6 text-center">
                            <div className="mb-4 text-4xl">📱</div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                スタンプラリー
                            </h3>
                            <p className="text-gray-600">
                                将来的にはユーザー参加型のコレクション機能を予定
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            筐体カテゴリー
                        </h2>
                        <p className="text-gray-600">
                            現在管理している筐体のカテゴリー
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                            <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                            <div className="p-6">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    メダルゲーム
                                </h3>
                                <p className="text-gray-600">
                                    プッシャーゲーム、スロット、ルーレット系など様々なメダルゲームの筐体情報を管理
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                            <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-500"></div>
                            <div className="p-6">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    クレーンゲーム
                                </h3>
                                <p className="text-gray-600">
                                    UFOキャッチャー、三本爪、二本爪など各種クレーンゲームの筐体情報を管理
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">
                        ゲームセンター筐体データベースを活用しよう
                    </h2>
                    <p className="mb-8 text-gray-300">
                        筐体情報の管理から始まり、将来的には全国のユーザーと情報を共有できるプラットフォームへ
                    </p>
                    <Link href="/machines">
                        <Button variant="blue" className="px-8 py-3 text-lg">
                            今すぐ始める
                        </Button>
                    </Link>
                </div>
            </div>
        </WebLayout>
    )
}
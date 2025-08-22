
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { router, usePage, Link } from '@inertiajs/react'

type Props = {
    page?: "rental" | "ma",
}
export const WebHeader = React.memo<Props>(function WebHeader({
    page
}) {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const handleScroll = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY
            setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50)
            setLastScrollY(currentScrollY)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    return (
        <header className={`sticky left-0 top-0 z-50 w-full bg-white shadow transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-2xl">🎮</div>
                            <span className="text-xl font-bold text-gray-900">筐体データベース</span>
                        </Link>
                        <nav className="ml-10 hidden space-x-8 md:flex">
                            <Link href="/" className="font-medium text-gray-600 hover:text-blue-600">
                                ホーム
                            </Link>
                            <Link href="/machines" className="font-medium text-gray-600 hover:text-blue-600">
                                筐体一覧
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/login" className="hidden font-medium text-gray-600 hover:text-blue-600 sm:block">
                            管理画面
                        </Link>
                        <Button variant='blue' onClick={() => router.visit(route("user.login"))}>
                            ログイン
                        </Button>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                            {isMenuOpen ? (
                                <span className="block h-6 w-6 text-gray-700">✖</span>
                            ) : (
                                <span className="block h-auto w-6 text-gray-700">
                                    <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
                                    <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
                                    <span className="block h-0.5 w-6 bg-gray-700"></span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* モバイルメニュー */}
            {isMenuOpen && (
                <nav className="border-t border-gray-200 bg-white md:hidden">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            ホーム
                        </Link>
                        <Link href="/machines" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            筐体一覧
                        </Link>
                        <Link href="/admin/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            管理画面
                        </Link>
                    </div>
                </nav>
            )}
        </header >
    )
})
export default WebHeader

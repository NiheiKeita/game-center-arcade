
import React from 'react'
import { Link } from '@inertiajs/react'

type Props = {
    children: React.ReactNode
}

export const AdminLayout = React.memo<Props>(function AdminLayout({
    children
}) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
                                管理画面
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                                ダッシュボード
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/" target="_blank" className="text-gray-600 hover:text-gray-800">
                                フロント画面
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link href="/admin/logout" method="post" className="text-red-600 hover:text-red-800">
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-7xl rounded-lg px-2 pt-6">
                    {children}
                </div>
            </div>
        </div>
    )

})
export default AdminLayout

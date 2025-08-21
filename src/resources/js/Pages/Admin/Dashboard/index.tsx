
import Button from '@/Components/Button'
import React from 'react'
import { router } from "@inertiajs/react"
import { Head } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'

export const Dashboard = React.memo(function Dashboard() {
    return (
        <AdminLayout>
            <Head title="管理画面ダッシュボード" />
            
            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
                    <p className="mt-2 text-gray-600">管理機能の概要とクイックアクセス</p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">🎮 筐体管理</h3>
                        <div className="space-y-2">
                            <Button className="w-full" onClick={() => router.visit(route("admin.machines.index"))}>筐体一覧</Button>
                            <Button className="w-full" variant="outline" onClick={() => router.visit(route("admin.machines.create"))}>筐体作成</Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">📂 マスター管理</h3>
                        <div className="space-y-2">
                            <Button className="w-full" onClick={() => router.visit(route("admin.categories.index"))}>カテゴリー一覧</Button>
                            <Button className="w-full" variant="outline" onClick={() => router.visit(route("admin.categories.create"))}>カテゴリー作成</Button>
                            <Button className="w-full" onClick={() => router.visit(route("admin.series.index"))}>シリーズ一覧</Button>
                            <Button className="w-full" variant="outline" onClick={() => router.visit(route("admin.series.create"))}>シリーズ作成</Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">👥 ユーザー管理</h3>
                        <div className="space-y-2">
                            <Button className="w-full" onClick={() => router.visit(route("user.list"))}>ユーザ一覧</Button>
                            <Button className="w-full" variant="outline" onClick={() => router.visit(route("user.create"))}>ユーザ追加</Button>
                            <Button className="w-full" onClick={() => router.visit(route("admin_user.list"))}>Adminユーザ一覧</Button>
                            <Button className="w-full" variant="outline" onClick={() => router.visit(route("admin_user.create"))}>Adminユーザ作成</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
})
export default Dashboard

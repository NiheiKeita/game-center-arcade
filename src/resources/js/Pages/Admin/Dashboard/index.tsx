
import Button from '@/Components/Button'
import React from 'react'
import { router } from "@inertiajs/react"

export const Dashboard = React.memo(function Dashboard() {
    return (
        <>
            <p className='text-2xl font-bold text-gray-700'>
                Dashboard
            </p>
            <div className='mt-10 space-y-6'>
                <div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>筐体管理</h3>
                    <div className='grid gap-2'>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.machines.index"))}>筐体一覧</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.machines.create"))}>筐体作成</Button>
                    </div>
                </div>

                <div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>マスター管理</h3>
                    <div className='grid gap-2'>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.categories.index"))}>カテゴリー一覧</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.categories.create"))}>カテゴリー作成</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.series.index"))}>シリーズ一覧</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin.series.create"))}>シリーズ作成</Button>
                    </div>
                </div>

                <div>
                    <h3 className='mb-3 text-lg font-semibold text-gray-800'>ユーザー管理</h3>
                    <div className='grid gap-2'>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("user.list"))}>ユーザ一覧</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("user.create"))}>ユーザ追加</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin_user.list"))}>Adminユーザ一覧</Button>
                        <Button className='ml-4 w-fit' onClick={() => router.visit(route("admin_user.create"))}>Adminユーザ作成</Button>
                    </div>
                </div>
            </div>
        </>
    )
})
export default Dashboard

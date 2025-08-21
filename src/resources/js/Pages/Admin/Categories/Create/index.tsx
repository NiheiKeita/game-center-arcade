import React, { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'

export default function CategoriesCreate() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/categories')
  }

  return (
    <AdminLayout>
      <Head title="カテゴリー作成" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">カテゴリー作成</h2>
                <Link href="/admin/categories">
                  <Button variant="default">一覧に戻る</Button>
                </Link>
              </div>

              <form onSubmit={submit} className="max-w-md">
                <div className="mb-4">
                  <InputLabel htmlFor="name" value="カテゴリー名" />
                  <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <Button className="ml-4" disabled={processing}>
                    作成
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
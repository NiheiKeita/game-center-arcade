import React from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'

interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  category: Category;
  [key: string]: any;
}

export default function CategoriesEdit() {
  const { category } = usePage<Props>().props
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/admin/categories/${category.id}`)
  }

  return (
    <AdminLayout>
      <Head title="カテゴリー編集" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">カテゴリー編集</h2>
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
                    更新
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
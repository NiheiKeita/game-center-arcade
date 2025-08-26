import React from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Button } from '@/Components/Button'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import { TextArea } from '@/Components/TextArea'
import InputError from '@/Components/InputError'

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  [key: string]: any;
}

export default function SeriesCreate() {
  const { categories } = usePage<Props>().props
  const { data, setData, post, processing, errors } = useForm({
    category_id: '',
    name: '',
    description: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/series')
  }

  return (
    <AdminLayout>
      <Head title="シリーズ作成" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">シリーズ作成</h2>
                <Link href="/admin/series">
                  <Button variant="default">一覧に戻る</Button>
                </Link>
              </div>

              <form onSubmit={submit} className="max-w-md">
                <div className="mb-4">
                  <InputLabel htmlFor="category_id" value="カテゴリー" />
                  <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">カテゴリーを選択</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.category_id} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="name" value="シリーズ名" />
                  <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="description" value="説明（任意）" />
                  <TextArea
                    id="description"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    rows={3}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  <InputError message={errors.description} className="mt-2" />
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
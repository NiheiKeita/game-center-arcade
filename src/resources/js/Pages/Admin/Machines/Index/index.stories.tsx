import type { Meta, StoryObj } from '@storybook/react'
import MachinesIndex from './index'

const meta = {
  title: 'Pages/Admin/Machines/Index',
  component: MachinesIndex,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MachinesIndex>

export default meta
type Story = StoryObj<typeof meta>

const mockMachines = [
  {
    id: 1,
    name: 'スピンフィーバー',
    version: '1.0',
    description: 'メダルプッシャーゲーム',
    category: { id: 1, name: 'メダルゲーム' },
    series: { id: 1, name: 'プッシャー系' },
    creator: { id: 1, name: '管理者' },
    images: [
      {
        id: 1,
        image_url: 'machines/sample1.jpg',
        caption: 'メイン画面',
      },
    ],
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
  {
    id: 2,
    name: 'UFOキャッチャー',
    version: '2.1',
    description: null,
    category: { id: 2, name: 'クレーンゲーム' },
    series: { id: 2, name: 'UFOキャッチャー系' },
    creator: { id: 1, name: '管理者' },
    images: [],
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
]

const mockCategories = [
  { id: 1, name: 'メダルゲーム' },
  { id: 2, name: 'クレーンゲーム' },
]

const mockSeries = [
  { id: 1, name: 'プッシャー系' },
  { id: 2, name: 'UFOキャッチャー系' },
]

export const Default: Story = {
  parameters: {
    inertia: {
      props: {
        machines: mockMachines,
        categories: mockCategories,
        series: mockSeries,
      },
    },
  },
}
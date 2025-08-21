import type { Meta, StoryObj } from '@storybook/react'
import SeriesIndex from './index'

const meta = {
  title: 'Pages/Admin/Series/Index',
  component: SeriesIndex,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeriesIndex>

export default meta
type Story = StoryObj<typeof meta>

const mockSeries = [
  {
    id: 1,
    name: 'プッシャー系',
    description: 'メダルを落とすプッシャーゲーム',
    machines_count: 5,
    category: { id: 1, name: 'メダルゲーム' },
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
  {
    id: 2,
    name: 'UFOキャッチャー系',
    description: '景品を取るクレーンゲーム',
    machines_count: 3,
    category: { id: 2, name: 'クレーンゲーム' },
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
]

const mockCategories = [
  { id: 1, name: 'メダルゲーム' },
  { id: 2, name: 'クレーンゲーム' },
]

export const Default: Story = {
  parameters: {
    inertia: {
      props: {
        series: mockSeries,
        categories: mockCategories,
      },
    },
  },
}
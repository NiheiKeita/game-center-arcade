import type { Meta, StoryObj } from '@storybook/react'
import CategoriesIndex from './index'

const meta = {
  title: 'Pages/Admin/Categories/Index',
  component: CategoriesIndex,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoriesIndex>

export default meta
type Story = StoryObj<typeof meta>

const mockCategories = [
  {
    id: 1,
    name: 'メダルゲーム',
    series_count: 5,
    machines_count: 15,
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
  {
    id: 2,
    name: 'クレーンゲーム',
    series_count: 3,
    machines_count: 8,
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z',
  },
]

export const Default: Story = {
  parameters: {
    inertia: {
      props: {
        categories: mockCategories,
      },
    },
  },
}
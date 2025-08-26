import type { Meta, StoryObj } from '@storybook/react'
import SeriesCreate from './index'

const meta = {
  title: 'Pages/Admin/Series/Create',
  component: SeriesCreate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeriesCreate>

export default meta
type Story = StoryObj<typeof meta>

const mockCategories = [
  { id: 1, name: 'メダルゲーム' },
  { id: 2, name: 'クレーンゲーム' },
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
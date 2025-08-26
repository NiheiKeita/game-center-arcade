import type { Meta, StoryObj } from '@storybook/react'
import CategoriesEdit from './index'

const meta = {
  title: 'Pages/Admin/Categories/Edit',
  component: CategoriesEdit,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoriesEdit>

export default meta
type Story = StoryObj<typeof meta>

const mockCategory = {
  id: 1,
  name: 'メダルゲーム',
  created_at: '2025-08-21T16:33:56.000000Z',
  updated_at: '2025-08-21T16:33:56.000000Z',
}

export const Default: Story = {
  parameters: {
    inertia: {
      props: {
        category: mockCategory,
      },
    },
  },
}
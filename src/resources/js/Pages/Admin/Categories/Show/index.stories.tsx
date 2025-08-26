import type { Meta, StoryObj } from '@storybook/react'
import CategoriesShow from './index'

const meta = {
  title: 'Pages/Admin/Categories/Show',
  component: CategoriesShow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoriesShow>

export default meta
type Story = StoryObj<typeof meta>

const mockCategory = {
  id: 1,
  name: 'メダルゲーム',
  created_at: '2025-08-21T16:33:56.000000Z',
  updated_at: '2025-08-21T16:33:56.000000Z',
  series: [
    {
      id: 1,
      name: 'プッシャー系',
      description: 'メダルを落とすプッシャーゲーム',
      machines: [
        { id: 1, name: 'スピンフィーバー', version: '1.0' },
        { id: 2, name: 'グランドクロス', version: '2.1' },
      ],
    },
    {
      id: 2,
      name: 'スロット系',
      description: 'スロットマシンタイプのゲーム',
      machines: [
        { id: 3, name: 'ミリオンゲーム', version: '3.0' },
      ],
    },
  ],
  machines: [],
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
import type { Meta, StoryObj } from '@storybook/react'
import MachinesShow from './index'

const meta = {
    title: 'Pages/Web/Machines/Show',
    component: MachinesShow,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachinesShow>

export default meta
type Story = StoryObj<typeof meta>

const mockMachine = {
    id: 1,
    name: 'サンプル筐体',
    version: '1.0',
    description: 'これはサンプルの筐体です。\n詳細な説明がここに入ります。',
    category: {
        id: 1,
        name: 'メダルゲーム'
    },
    series: {
        id: 1,
        name: 'サンプルシリーズ'
    },
    creator: {
        id: 1,
        name: 'テストユーザー'
    },
    images: [
        {
            id: 1,
            url: 'https://via.placeholder.com/400x300',
            alt: 'サンプル画像1'
        }
    ],
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z'
}

export const Default: Story = {
    parameters: {
        inertia: {
            props: {
                machine: mockMachine
            }
        }
    }
}
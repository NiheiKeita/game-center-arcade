import type { Meta, StoryObj } from '@storybook/react'
import MachineEdit from './index'

const meta = {
    title: 'Pages/Admin/Machines/Edit',
    component: MachineEdit,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachineEdit>

export default meta
type Story = StoryObj<typeof meta>

const mockMachine = {
    id: 1,
    name: 'スピンフィーバー',
    version: '1.0',
    description: 'メダルプッシャーゲーム',
    category_id: 1,
    series_id: 1,
    category: { id: 1, name: 'メダルゲーム' },
    series: { id: 1, name: 'プッシャー系' },
    creator: { id: 1, name: '管理者' },
    images: [],
    created_at: '2025-08-21T16:33:56.000000Z',
    updated_at: '2025-08-21T16:33:56.000000Z'
}

const mockCategories = [
    { id: 1, name: 'メダルゲーム' },
    { id: 2, name: 'クレーンゲーム' }
]

const mockSeries = [
    { id: 1, name: 'プッシャー系' },
    { id: 2, name: 'UFOキャッチャー系' }
]

export const Default: Story = {
    parameters: {
        inertia: {
            props: {
                machine: mockMachine,
                categories: mockCategories,
                series: mockSeries
            }
        }
    }
}
import type { Meta, StoryObj } from '@storybook/react'
import MachineCreate from './index'

const meta = {
    title: 'Pages/Admin/Machines/Create',
    component: MachineCreate,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachineCreate>

export default meta
type Story = StoryObj<typeof meta>

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
                categories: mockCategories,
                series: mockSeries
            }
        }
    }
}
import type { Meta, StoryObj } from '@storybook/react'
import MachineShow from './index'

const meta = {
    title: 'Pages/Admin/Machines/Show',
    component: MachineShow,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachineShow>

export default meta
type Story = StoryObj<typeof meta>

const mockMachine = {
    id: 1,
    name: 'スピンフィーバー',
    version: '1.0',
    description: 'メダルプッシャーゲーム\nコインを投入してメダルを獲得するゲームです。',
    category: { id: 1, name: 'メダルゲーム' },
    series: { id: 1, name: 'プッシャー系' },
    creator: { id: 1, name: '管理者' },
    images: [
        {
            id: 1,
            image_url: 'https://via.placeholder.com/400x300',
            caption: 'メイン画面'
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
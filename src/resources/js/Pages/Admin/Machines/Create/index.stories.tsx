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

export const Default: Story = {}
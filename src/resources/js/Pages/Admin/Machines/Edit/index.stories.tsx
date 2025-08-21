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

export const Default: Story = {}
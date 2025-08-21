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

export const Default: Story = {}
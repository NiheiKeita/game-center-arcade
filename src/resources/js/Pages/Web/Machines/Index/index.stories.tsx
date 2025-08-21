import type { Meta, StoryObj } from '@storybook/react'
import MachinesIndex from './index'

const meta = {
    title: 'Pages/Web/Machines/Index',
    component: MachinesIndex,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachinesIndex>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
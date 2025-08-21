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

export const Default: Story = {}
import type { Meta, StoryObj } from '@storybook/react'
import Top from './index'

const meta = {
    title: 'Pages/Web/Top',
    component: Top,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Top>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
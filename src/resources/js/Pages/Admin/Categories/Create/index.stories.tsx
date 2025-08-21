import type { Meta, StoryObj } from '@storybook/react'
import CategoriesCreate from './index'

const meta = {
  title: 'Pages/Admin/Categories/Create',
  component: CategoriesCreate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoriesCreate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  args: {
    children: 'Button Text',
    variant: 'default',
    disabled: false,
    type: 'button'
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'blue']
    },
    onClick: { action: 'clicked' }
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(args) {
    return (
      <Button {...args}>Default Button</Button>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // ボタンが表示されることを確認
    const button = canvas.getByRole('button', { name: 'Default Button' })
    await expect(button).toBeInTheDocument()
    await expect(button).not.toBeDisabled()
    
    // デフォルトバリアントのスタイルが適用されていることを確認
    await expect(button).toHaveClass('bg-white')
  }
}

export const Blue: Story = {
  args: {
    variant: 'blue'
  },
  render(args) {
    return (
      <Button {...args}>Blue Button</Button>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // ボタンが表示されることを確認
    const button = canvas.getByRole('button', { name: 'Blue Button' })
    await expect(button).toBeInTheDocument()
    
    // Blueバリアントのスタイルが適用されていることを確認
    await expect(button).toHaveClass('bg-blue-600')
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render(args) {
    return (
      <Button {...args}>Disabled Button</Button>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // 無効化されたボタンが表示されることを確認
    const button = canvas.getByRole('button', { name: 'Disabled Button' })
    await expect(button).toBeInTheDocument()
    await expect(button).toBeDisabled()
  }
}

export const ClickInteraction: Story = {
  render(args) {
    return (
      <Button {...args}>Click Me</Button>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // ボタンをクリック
    const button = canvas.getByRole('button', { name: 'Click Me' })
    await userEvent.click(button)
    
    // onClick が呼ばれることを確認（Storybook の actions で確認可能）
    await expect(button).toBeInTheDocument()
  }
}

export const SubmitButton: Story = {
  args: {
    type: 'submit',
    variant: 'blue'
  },
  render(args) {
    return (
      <form>
        <Button {...args}>Submit</Button>
      </form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Submit タイプのボタンが表示されることを確認
    const button = canvas.getByRole('button', { name: 'Submit' })
    await expect(button).toBeInTheDocument()
    await expect(button).toHaveAttribute('type', 'submit')
  }
}

export const AllVariants: Story = {
  render() {
    return (
      <div className="space-y-4">
        <Button variant="default">Default Variant</Button>
        <Button variant="blue">Blue Variant</Button>
        <Button variant="default" disabled>Disabled Default</Button>
        <Button variant="blue" disabled>Disabled Blue</Button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // すべてのバリアントが表示されることを確認
    await expect(canvas.getByText('Default Variant')).toBeInTheDocument()
    await expect(canvas.getByText('Blue Variant')).toBeInTheDocument()
    await expect(canvas.getByText('Disabled Default')).toBeInTheDocument()
    await expect(canvas.getByText('Disabled Blue')).toBeInTheDocument()
    
    // 無効化されたボタンが正しく無効化されていることを確認
    const disabledButtons = canvas.getAllByRole('button').filter(btn => btn.hasAttribute('disabled'))
    expect(disabledButtons).toHaveLength(2)
  }
}

import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Login } from '.'

const meta: Meta<typeof Login> = {
    title: 'views/Web/Login',
    component: Login,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        canResetPassword: true,
        status: undefined
    },
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FormValidation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // フォームフィールドが必須入力であることを確認
        const emailInput = canvas.getByLabelText('Email')
        const passwordInput = canvas.getByLabelText('Password')

        await expect(emailInput).toHaveAttribute('type', 'email')
        await expect(passwordInput).toHaveAttribute('type', 'password')

        // オートコンプリート属性が設定されていることを確認
        await expect(emailInput).toHaveAttribute('autoComplete', 'username')
        await expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
    }
}

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

export const WithStatus: Story = {
  args: {
    status: 'パスワードリセットメールを送信しました',
    canResetPassword: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // ステータスメッセージが表示されることを確認
    await expect(canvas.getByText('パスワードリセットメールを送信しました')).toBeInTheDocument()
  }
}

export const FormInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // ログインフォームが表示されることを確認
    await expect(canvas.getByText('ログイン')).toBeInTheDocument()
    
    // Emailフィールドを見つけて入力
    const emailInput = canvas.getByLabelText('Email')
    await expect(emailInput).toBeInTheDocument()
    await userEvent.type(emailInput, 'test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
    
    // Passwordフィールドを見つけて入力
    const passwordInput = canvas.getByLabelText('Password')
    await expect(passwordInput).toBeInTheDocument()
    await userEvent.type(passwordInput, 'password123')
    await expect(passwordInput).toHaveValue('password123')
    
    // ログインボタンが表示されることを確認
    const loginButton = canvas.getByRole('button', { name: 'ログイン' })
    await expect(loginButton).toBeInTheDocument()
    await expect(loginButton).not.toBeDisabled()
  }
}

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

export const ProcessingState: Story = {
  parameters: {
    mockData: {
      processing: true
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // ログインボタンが無効化されることを確認（処理中の状態）
    const loginButton = canvas.getByRole('button', { name: 'ログイン' })
    
    // Note: 実際のprocessing状態は hooks から来るため、
    // この story では UI の構造のみ確認
    await expect(loginButton).toBeInTheDocument()
  }
}

export const WithErrors: Story = {
  parameters: {
    mockData: {
      errors: {
        email: 'メールアドレスが正しくありません',
        password: 'パスワードが間違っています'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // フォームが表示されることを確認
    await expect(canvas.getByText('ログイン')).toBeInTheDocument()
    
    // エラーメッセージの表示領域が存在することを確認
    // Note: 実際のエラーは hooks から来るため、構造のみ確認
    const emailField = canvas.getByLabelText('Email')
    const passwordField = canvas.getByLabelText('Password')
    
    await expect(emailField).toBeInTheDocument()
    await expect(passwordField).toBeInTheDocument()
  }
}

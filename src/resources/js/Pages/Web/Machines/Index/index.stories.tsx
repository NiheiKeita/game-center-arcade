import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import MachinesIndex from './index'

const meta = {
    title: 'Pages/Web/Machines/Index',
    component: MachinesIndex,
    parameters: {
        layout: 'fullscreen',
        inertia: {
            props: {
                machines: {
                    data: [
                        {
                            id: 1,
                            name: 'Street Fighter II',
                            version: '1.0',
                            description: 'Classic fighting game',
                            category: { id: 1, name: 'Fighting' },
                            series: { id: 1, name: 'Street Fighter' },
                            creator: { id: 1, name: 'Capcom' },
                            images: [
                                {
                                    id: 1,
                                    image_url: '/images/sf2.jpg',
                                    full_image_url: '/images/sf2_full.jpg',
                                    caption: 'Street Fighter II cabinet'
                                }
                            ],
                            created_at: '2023-01-01',
                            updated_at: '2023-01-01'
                        },
                        {
                            id: 2,
                            name: 'Pac-Man',
                            version: '1.0',
                            description: 'Classic arcade game',
                            category: { id: 2, name: 'Puzzle' },
                            series: { id: 2, name: 'Pac-Man' },
                            creator: { id: 2, name: 'Namco' },
                            images: [],
                            created_at: '2023-01-02',
                            updated_at: '2023-01-02'
                        }
                    ],
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    total: 2,
                    links: [
                        { url: null, label: '&laquo; Previous', active: false },
                        { url: '/machines?page=1', label: '1', active: true },
                        { url: null, label: 'Next &raquo;', active: false }
                    ]
                },
                categories: [
                    { id: 1, name: 'Fighting' },
                    { id: 2, name: 'Puzzle' },
                    { id: 3, name: 'Shooting' }
                ],
                series: [
                    { id: 1, name: 'Street Fighter' },
                    { id: 2, name: 'Pac-Man' },
                    { id: 3, name: 'Gradius' }
                ]
            }
        }
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MachinesIndex>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFilters: Story = {
    parameters: {
        inertia: {
            props: {
                machines: {
                    data: [
                        {
                            id: 1,
                            name: 'Street Fighter II',
                            version: '1.0',
                            description: 'Classic fighting game',
                            category: { id: 1, name: 'Fighting' },
                            series: { id: 1, name: 'Street Fighter' },
                            creator: { id: 1, name: 'Capcom' },
                            images: [],
                            created_at: '2023-01-01',
                            updated_at: '2023-01-01'
                        }
                    ],
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    total: 1,
                    links: []
                },
                categories: [
                    { id: 1, name: 'Fighting' },
                    { id: 2, name: 'Puzzle' }
                ],
                series: [
                    { id: 1, name: 'Street Fighter' }
                ],
                selectedCategoryId: 1,
                selectedSeriesId: 1
            }
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // カテゴリーセレクトボックスが正しく選択されていることを確認
        const categorySelect = canvas.getByDisplayValue('Fighting')
        await expect(categorySelect).toBeInTheDocument()

        // シリーズセレクトボックスが正しく選択されていることを確認
        const seriesSelect = canvas.getByDisplayValue('Street Fighter')
        await expect(seriesSelect).toBeInTheDocument()

        // フィルタされた結果が表示されていることを確認
        await expect(canvas.getByText('Street Fighter II')).toBeInTheDocument()
    }
}

export const EmptyState: Story = {
    parameters: {
        inertia: {
            props: {
                machines: {
                    data: [],
                    current_page: 1,
                    last_page: 0,
                    per_page: 10,
                    total: 0,
                    links: []
                },
                categories: [
                    { id: 1, name: 'Fighting' },
                    { id: 2, name: 'Puzzle' }
                ],
                series: [
                    { id: 1, name: 'Street Fighter' }
                ]
            }
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // 空の状態のメッセージが表示されることを確認
        await expect(canvas.getByText('筐体が見つかりませんでした')).toBeInTheDocument()
        await expect(canvas.getByText('検索条件クリア')).toBeInTheDocument()
    }
}


export const MachineCardClick: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // 筐体カードが表示されることを確認
        const machineCard = canvas.getByText('Street Fighter II')
        await expect(machineCard).toBeInTheDocument()

        // カードがクリック可能であることを確認
        const cardLink = machineCard.closest('a')
        await expect(cardLink).toBeInTheDocument()
        if (cardLink) {
            await expect(cardLink).toHaveAttribute('href', '/machines/1')

            // ホバー効果のクラスが適用されていることを確認
            const transitionElement = cardLink.querySelector('.transition-transform')
            await expect(transitionElement).toBeInTheDocument()
        }
    }
}

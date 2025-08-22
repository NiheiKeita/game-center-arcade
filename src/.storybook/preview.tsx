import type { Preview } from "@storybook/react"
import React from "react"
import "../resources/css/app.css"
import { initialize, mswLoader } from 'msw-storybook-addon'
import { setInertiaProps } from './inertia-mock'

initialize()

// Inertia用のデコレーター
const withInertia = (Story: any, context: any) => {
    // storyのparametersからinertiaの設定を取得
    const inertiaProps = context.parameters?.inertia?.props || {}
    
    // InertiaプロパティをGlobalに設定
    React.useEffect(() => {
        setInertiaProps(inertiaProps)
    }, [inertiaProps])
    
    return <Story />
}

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    loaders: [mswLoader],
    decorators: [withInertia],
}

;(global as any).route = (name: string, params?: any, absolute?: boolean) => {
    return `/${name}`
}

export default preview

import type { StorybookConfig } from "@storybook/react-vite"
import { resolve } from "path"

const config: StorybookConfig = {
    stories: [
        "../resources/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    staticDirs: ["../public"],
    viteFinal: (config) => {
        // Inertiaモジュールのエイリアス設定
        config.resolve = config.resolve || {}
        config.resolve.alias = {
            ...config.resolve.alias,
            '@inertiajs/react': resolve(__dirname, './inertia-mock.tsx'),
        }
        
        // CI環境でのVite設定を調整
        if (process.env.CI) {
            config.server = {
                ...config.server,
                hmr: false,
            }
            // Laravel Vite pluginのCI環境チェックを無効化
            config.define = {
                ...config.define,
                'process.env.LARAVEL_BYPASS_ENV_CHECK': '"1"',
            }
        }
        return config
    },
}
export default config

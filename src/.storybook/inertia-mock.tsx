import React from 'react'

// グローバルなInertiaプロパティ
let currentInertiaProps: any = {}

export const setInertiaProps = (props: any) => {
    currentInertiaProps = props
}

export const usePage = () => ({
    component: '',
    props: currentInertiaProps,
    url: '/',
    version: '1',
})

export const Head = ({ children }: { children: React.ReactNode }) => <>{children}</>

export const Link = ({ children, href, method, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
)

export const router = {
    visit: (url: string) => console.log('Navigate to:', url),
    get: (url: string) => console.log('GET:', url),
    post: (url: string) => console.log('POST:', url),
    put: (url: string) => console.log('PUT:', url),
    patch: (url: string) => console.log('PATCH:', url),
    delete: (url: string) => console.log('DELETE:', url),
}

// useFormのモック
export const useForm = (initialData: any = {}) => {
    const [data, setData] = React.useState(initialData)
    const [errors, setErrors] = React.useState({})
    const [processing, setProcessing] = React.useState(false)
    const [recentlySuccessful, setRecentlySuccessful] = React.useState(false)

    return {
        data,
        setData: (key: string | object, value?: any) => {
            if (typeof key === 'string') {
                setData(prev => ({ ...prev, [key]: value }))
            } else {
                setData(key)
            }
        },
        errors,
        hasErrors: Object.keys(errors).length > 0,
        processing,
        progress: null,
        wasSuccessful: recentlySuccessful,
        recentlySuccessful,
        transform: (callback: (data: any) => any) => {
            // Transform function mock
        },
        defaults: (field?: string, value?: any) => {
            // Defaults function mock
        },
        reset: (...fields: string[]) => {
            if (fields.length === 0) {
                setData(initialData)
            } else {
                setData(prev => {
                    const newData = { ...prev }
                    fields.forEach(field => {
                        if (initialData[field] !== undefined) {
                            newData[field] = initialData[field]
                        }
                    })
                    return newData
                })
            }
        },
        clearErrors: (...fields: string[]) => {
            if (fields.length === 0) {
                setErrors({})
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev }
                    fields.forEach(field => delete newErrors[field])
                    return newErrors
                })
            }
        },
        setError: (field: string, message: string) => {
            setErrors(prev => ({ ...prev, [field]: message }))
        },
        post: (url: string, options?: any) => {
            setProcessing(true)
            console.log('Form POST to:', url, data)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        put: (url: string, options?: any) => {
            setProcessing(true)
            console.log('Form PUT to:', url, data)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        patch: (url: string, options?: any) => {
            setProcessing(true)
            console.log('Form PATCH to:', url, data)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        delete: (url: string, options?: any) => {
            setProcessing(true)
            console.log('Form DELETE to:', url)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        get: (url: string, options?: any) => {
            setProcessing(true)
            console.log('Form GET to:', url, data)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        submit: (method: string, url: string, options?: any) => {
            setProcessing(true)
            console.log('Form submit:', method, url, data)
            setTimeout(() => {
                setProcessing(false)
                setRecentlySuccessful(true)
                setTimeout(() => setRecentlySuccessful(false), 2000)
            }, 1000)
        },
        cancel: () => {
            setProcessing(false)
        },
    }
}

// createInertiaAppのモック
export const createInertiaApp = (config: any) => {
    console.log('createInertiaApp called with config:', config)
    // Storybook環境では実際のアプリ作成は不要
    return Promise.resolve()
}
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
}
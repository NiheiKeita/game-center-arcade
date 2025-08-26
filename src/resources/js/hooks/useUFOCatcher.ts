import { useState, useCallback, useRef } from 'react'

interface UseUFOCatcherOptions {
    onButtonCatch?: (buttonElement: HTMLElement) => void
    onEmojiCatch?: (emoji: string, element: HTMLElement) => void
    catchDelay?: number
    animationDuration?: number
}

export const useUFOCatcher = ({
    onButtonCatch,
    onEmojiCatch,
    catchDelay = 800,
    animationDuration = 1200
}: UseUFOCatcherOptions = {}) => {
    const [isCatching, setIsCatching] = useState(false)
    const [caughtElement, setCaughtElement] = useState<HTMLElement | null>(null)
    const catchingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const catchButton = useCallback((mouseX: number, mouseY: number) => {
        if (isCatching) return

        const elementsAtPoint = document.elementsFromPoint(mouseX, mouseY)
        
        // 絵文字要素を優先的にチェック
        const emojiElement = elementsAtPoint.find(
            (el) => el.getAttribute('data-emoji')
        ) as HTMLElement

        if (emojiElement) {
            const emoji = emojiElement.getAttribute('data-emoji')
            if (emoji) {
                setIsCatching(true)
                setCaughtElement(emojiElement)

                // 絵文字キャッチのアニメーション
                emojiElement.style.transition = `transform ${catchDelay}ms ease-out`
                emojiElement.style.transform = 'scale(0.8) translateY(-10px)'
                emojiElement.style.filter = 'brightness(1.5)'

                catchingTimeoutRef.current = setTimeout(() => {
                    setIsCatching(false)
                    onEmojiCatch?.(emoji, emojiElement)

                    // キャッチエフェクト
                    emojiElement.style.transform = 'scale(1.5) translateY(-20px)'
                    emojiElement.style.filter = 'brightness(2)'
                    
                    animationTimeoutRef.current = setTimeout(() => {
                        setCaughtElement(null)
                        emojiElement.style.transition = 'opacity 500ms ease-out, transform 500ms ease-out'
                        emojiElement.style.opacity = '0'
                        emojiElement.style.transform = 'scale(0) translateY(-50px)'
                        
                        // 要素を完全に削除
                        setTimeout(() => {
                            if (emojiElement.parentNode) {
                                emojiElement.parentNode.removeChild(emojiElement)
                            }
                        }, 500)
                    }, animationDuration * 0.3)
                }, catchDelay)
                
                return
            }
        }

        // 通常のボタン要素をチェック
        const buttonElement = elementsAtPoint.find(
            (el) => 
                el.tagName === 'BUTTON' || 
                el.tagName === 'A' ||
                el.getAttribute('role') === 'button' ||
                el.classList.contains('cursor-pointer')
        ) as HTMLElement

        if (buttonElement) {
            setIsCatching(true)
            setCaughtElement(buttonElement)

            buttonElement.style.transition = `transform ${catchDelay}ms ease-out`
            buttonElement.style.transform = 'scale(0.95) translateY(-5px)'
            buttonElement.style.filter = 'brightness(1.2)'

            catchingTimeoutRef.current = setTimeout(() => {
                setIsCatching(false)
                onButtonCatch?.(buttonElement)

                buttonElement.style.transform = 'scale(1.1) translateY(-10px)'
                buttonElement.style.filter = 'brightness(1.4)'
                
                animationTimeoutRef.current = setTimeout(() => {
                    setCaughtElement(null)
                    buttonElement.style.transition = 'transform 300ms ease-out, filter 300ms ease-out'
                    buttonElement.style.transform = ''
                    buttonElement.style.filter = ''
                }, animationDuration)
            }, catchDelay)
        }
    }, [isCatching, onButtonCatch, onEmojiCatch, catchDelay, animationDuration])

    const cleanup = useCallback(() => {
        if (catchingTimeoutRef.current) {
            clearTimeout(catchingTimeoutRef.current)
            catchingTimeoutRef.current = null
        }
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
            animationTimeoutRef.current = null
        }
        if (caughtElement) {
            caughtElement.style.transition = ''
            caughtElement.style.transform = ''
            caughtElement.style.filter = ''
        }
        setIsCatching(false)
        setCaughtElement(null)
    }, [caughtElement])

    return {
        isCatching,
        caughtElement,
        catchButton,
        cleanup
    }
}
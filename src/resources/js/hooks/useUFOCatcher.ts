import { useState, useCallback, useRef } from 'react'

interface UseUFOCatcherOptions {
    onButtonCatch?: (buttonElement: HTMLElement) => void
    catchDelay?: number
    animationDuration?: number
}

export const useUFOCatcher = ({
    onButtonCatch,
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
    }, [isCatching, onButtonCatch, catchDelay, animationDuration])

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
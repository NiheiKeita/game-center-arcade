import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLogin } from './hooks'
import { useForm } from '@inertiajs/react'

vi.mock('@inertiajs/react')

describe('useLogin', () => {
  const mockFormReturn = {
    data: {
      email: '',
      password: '',
      remember: false
    },
    setData: vi.fn(),
    post: vi.fn(),
    processing: false,
    errors: {},
    reset: vi.fn()
  }

  beforeEach(() => {
    vi.mocked(useForm).mockReturnValue(mockFormReturn as any)
    global.route = vi.fn().mockReturnValue('/login')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current.data).toEqual({
      email: '',
      password: '',
      remember: false
    })
    expect(result.current.processing).toBe(false)
    expect(result.current.errors).toEqual({})
  })

  it('should call useForm with correct initial data', () => {
    renderHook(() => useLogin())

    expect(useForm).toHaveBeenCalledWith({
      email: '',
      password: '',
      remember: false
    })
  })

  it('should return all form methods', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('setData')
    expect(result.current).toHaveProperty('post')
    expect(result.current).toHaveProperty('processing')
    expect(result.current).toHaveProperty('errors')
    expect(result.current).toHaveProperty('reset')
    expect(result.current).toHaveProperty('submit')
  })

  it('should handle form submission correctly', () => {
    const { result } = renderHook(() => useLogin())

    const mockEvent = {
      preventDefault: vi.fn()
    }

    act(() => {
      result.current.submit(mockEvent as any)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(global.route).toHaveBeenCalledWith('user.login')
    expect(mockFormReturn.post).toHaveBeenCalledWith('/login')
  })

  it('should reset password on component unmount', () => {
    const { unmount } = renderHook(() => useLogin())

    unmount()

    expect(mockFormReturn.reset).toHaveBeenCalledWith('password')
  })

  it('should call setData when updating form data', () => {
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setData('email', 'test@example.com')
    })

    expect(mockFormReturn.setData).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('should handle remember checkbox toggle', () => {
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setData('remember', true)
    })

    expect(mockFormReturn.setData).toHaveBeenCalledWith('remember', true)
  })
})
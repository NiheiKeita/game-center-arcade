import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useApplication } from './hooks'

describe('useApplication', () => {
  it('should return an empty object', () => {
    const { result } = renderHook(() => useApplication())

    expect(result.current).toEqual({})
  })

  it('should be callable without errors', () => {
    expect(() => {
      renderHook(() => useApplication())
    }).not.toThrow()
  })
})
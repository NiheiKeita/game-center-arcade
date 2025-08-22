import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAdminMachinesIndex } from './hooks'
import { usePage } from '@inertiajs/react'

vi.mock('@inertiajs/react')

describe('useAdminMachinesIndex', () => {
  const mockProps = {
    machines: [
      {
        id: 1,
        name: 'Test Machine',
        version: '1.0',
        description: 'Test Description',
        category: { id: 1, name: 'Test Category' },
        series: { id: 1, name: 'Test Series' },
        creator: { id: 1, name: 'Test Creator' },
        images: [],
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      }
    ],
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' }
    ],
    series: [
      { id: 1, name: 'Series 1' },
      { id: 2, name: 'Series 2' }
    ],
    selectedCategoryId: 1,
    selectedSeriesId: undefined
  }

  beforeEach(() => {
    vi.mocked(usePage).mockReturnValue({
      props: mockProps,
      component: 'Admin/Machines/Index',
      url: '/admin/machines',
      version: null
    } as any)

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    })

    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return correct props from usePage', () => {
    const result = useAdminMachinesIndex()

    expect(result.machines).toEqual(mockProps.machines)
    expect(result.categories).toEqual(mockProps.categories)
    expect(result.series).toEqual(mockProps.series)
    expect(result.selectedCategoryId).toBe(1)
    expect(result.selectedSeriesId).toBeUndefined()
  })

  it('should handle category change correctly', () => {
    const result = useAdminMachinesIndex()

    result.handleCategoryChange('2')

    expect(window.location.href).toBe('/admin/machines?category_id=2')
  })

  it('should handle category change with empty value', () => {
    const result = useAdminMachinesIndex()

    result.handleCategoryChange('')

    expect(window.location.href).toBe('/admin/machines')
  })

  it('should handle series change successfully', async () => {
    const mockSeriesData = { category_id: 2 }
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockSeriesData)
    } as Response)

    const result = useAdminMachinesIndex()

    await result.handleSeriesChange('2')

    expect(fetch).toHaveBeenCalledWith('/api/series/2')
    expect(window.location.href).toBe('/admin/machines?category_id=2&series_id=2')
  })

  it('should handle series change with empty value', async () => {
    const result = useAdminMachinesIndex()

    await result.handleSeriesChange('')

    expect(window.location.href).toBe('/admin/machines?category_id=1')
  })

  it('should handle series change API error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(fetch).mockRejectedValueOnce(new Error('API Error'))

    const result = useAdminMachinesIndex()

    await result.handleSeriesChange('2')

    expect(consoleSpy).toHaveBeenCalledWith('シリーズ情報の取得に失敗しました:', expect.any(Error))
    expect(window.location.href).toBe('/admin/machines?category_id=1&series_id=2')

    consoleSpy.mockRestore()
  })

  it('should handle series change without selected category', async () => {
    vi.mocked(usePage).mockReturnValue({
      props: { ...mockProps, selectedCategoryId: undefined },
      component: 'Admin/Machines/Index',
      url: '/admin/machines',
      version: null
    } as any)

    const result = useAdminMachinesIndex()

    await result.handleSeriesChange('')

    expect(window.location.href).toBe('/admin/machines')
  })
})
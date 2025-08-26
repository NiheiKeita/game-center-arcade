import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock Ziggy global
global.route = vi.fn()
global.Ziggy = {
  routes: {},
  location: 'http://localhost',
}

// Mock window.location for Inertia
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost',
    origin: 'http://localhost',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
})
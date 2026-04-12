import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useInView from './useInView'

function InViewHarness(props) {
  const { ref, inView } = useInView(props)

  return (
    <div>
      <div ref={ref} data-testid="target">target</div>
      <div data-testid="in-view">{String(inView)}</div>
    </div>
  )
}

describe('useInView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('sets inView to true when target intersects', () => {
    let callback

    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()

    class IntersectionObserverMock {
      constructor(cb) {
        callback = cb
      }

      observe = observe
      unobserve = unobserve
      disconnect = disconnect
    }

    global.IntersectionObserver = IntersectionObserverMock

    render(<InViewHarness once />)

    expect(screen.getByTestId('in-view')).toHaveTextContent('false')

    act(() => {
      callback([{ isIntersecting: true, target: screen.getByTestId('target') }])
    })

    expect(screen.getByTestId('in-view')).toHaveTextContent('true')
    expect(observe).toHaveBeenCalledTimes(1)
    expect(unobserve).toHaveBeenCalledTimes(1)
  })

  it('falls back to visible when IntersectionObserver is unavailable', () => {
    const originalObserver = global.IntersectionObserver
    delete global.IntersectionObserver

    render(<InViewHarness once />)
    expect(screen.getByTestId('in-view')).toHaveTextContent('true')

    if (originalObserver) {
      global.IntersectionObserver = originalObserver
    }
  })
})

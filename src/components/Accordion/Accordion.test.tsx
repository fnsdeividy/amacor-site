import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Accordion, AccordionItem } from './Accordion'

const mockItems: AccordionItem[] = [
  { id: '1', title: 'Item One', content: 'Content for item one' },
  { id: '2', title: 'Item Two', content: 'Content for item two' },
  { id: '3', title: 'Item Three', content: 'Content for item three' },
]

describe('Accordion', () => {
  it('renders all items with their titles', () => {
    render(<Accordion items={mockItems} />)

    expect(screen.getByText('Item One')).toBeInTheDocument()
    expect(screen.getByText('Item Two')).toBeInTheDocument()
    expect(screen.getByText('Item Three')).toBeInTheDocument()
  })

  it('all items are collapsed by default', () => {
    render(<Accordion items={mockItems} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('expands an item when clicked', () => {
    render(<Accordion items={mockItems} />)

    const firstButton = screen.getByText('Item One').closest('button')!
    fireEvent.click(firstButton)

    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Content for item one')).toBeVisible()
  })

  it('collapses an already-expanded item when clicked again', () => {
    render(<Accordion items={mockItems} />)

    const firstButton = screen.getByText('Item One').closest('button')!
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })

  describe('single-open mode (default)', () => {
    it('closes previously expanded item when another is opened', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      const secondButton = screen.getByText('Item Two').closest('button')!

      fireEvent.click(firstButton)
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')

      fireEvent.click(secondButton)
      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
      expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('allowMultiple mode', () => {
    it('allows multiple items to be expanded simultaneously', () => {
      render(<Accordion items={mockItems} allowMultiple />)

      const firstButton = screen.getByText('Item One').closest('button')!
      const secondButton = screen.getByText('Item Two').closest('button')!

      fireEvent.click(firstButton)
      fireEvent.click(secondButton)

      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
      expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('collapses individual items independently', () => {
      render(<Accordion items={mockItems} allowMultiple />)

      const firstButton = screen.getByText('Item One').closest('button')!
      const secondButton = screen.getByText('Item Two').closest('button')!

      fireEvent.click(firstButton)
      fireEvent.click(secondButton)
      fireEvent.click(firstButton)

      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
      expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('keyboard navigation', () => {
    it('toggles item with Enter key', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      fireEvent.keyDown(firstButton, { key: 'Enter' })

      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles item with Space key', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      fireEvent.keyDown(firstButton, { key: ' ' })

      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('does not toggle on other keys', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      fireEvent.keyDown(firstButton, { key: 'Tab' })

      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('accessibility', () => {
    it('has aria-expanded attribute on buttons', () => {
      render(<Accordion items={mockItems} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded')
      })
    })

    it('has aria-controls linking button to panel', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      const panelId = firstButton.getAttribute('aria-controls')

      expect(panelId).toBe('accordion-panel-1')
      expect(document.getElementById(panelId!)).toBeInTheDocument()
    })

    it('panels have role="region" and aria-labelledby', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      fireEvent.click(firstButton)

      const panel = document.getElementById('accordion-panel-1')!
      expect(panel).toHaveAttribute('role', 'region')
      expect(panel).toHaveAttribute('aria-labelledby', 'accordion-header-1')
    })

    it('buttons have focus ring styles for keyboard navigation', () => {
      render(<Accordion items={mockItems} />)

      const firstButton = screen.getByText('Item One').closest('button')!
      expect(firstButton.className).toContain('focus:ring-2')
    })
  })

  it('renders with empty items array', () => {
    const { container } = render(<Accordion items={[]} />)
    expect(container.querySelector('[class*="divide-y"]')).toBeInTheDocument()
  })

  it('renders ReactNode content correctly', () => {
    const items: AccordionItem[] = [
      {
        id: 'rich',
        title: 'Rich Content',
        content: <div data-testid="rich-content"><strong>Bold text</strong></div>,
      },
    ]

    render(<Accordion items={items} />)

    const button = screen.getByText('Rich Content').closest('button')!
    fireEvent.click(button)

    expect(screen.getByTestId('rich-content')).toBeInTheDocument()
  })
})

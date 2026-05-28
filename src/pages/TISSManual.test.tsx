import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TISSManual from './TISSManual'

describe('TISSManual', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the page heading "Manual TISS"', () => {
    render(<TISSManual />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Manual TISS')
  })

  it('renders a description about the TISS standard for health information exchange', () => {
    render(<TISSManual />)

    expect(screen.getByText(/TISS.*Troca de Informações na Saúde Suplementar/)).toBeInTheDocument()
    expect(screen.getByText(/intercâmbio de dados/)).toBeInTheDocument()
  })

  it('displays at least one downloadable document link with name and file format', () => {
    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    expect(downloadLinks.length).toBeGreaterThanOrEqual(1)

    // Each link should have a download attribute
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download')
    })

    // Check that document name and format are visible
    expect(screen.getByText(/Manual TISS 4\.0/)).toBeInTheDocument()
    expect(screen.getAllByText(/PDF/).length).toBeGreaterThanOrEqual(1)
  })

  it('download links have the download attribute for initiating file download', () => {
    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download')
      expect(link).toHaveAttribute('href')
    })
  })

  it('shows error message when download fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    fireEvent.click(downloadLinks[0])

    await waitFor(() => {
      expect(
        screen.getByText('Arquivo indisponível. Tente novamente mais tarde.')
      ).toBeInTheDocument()
    })
  })

  it('shows error message when server returns non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 404 })
    )

    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    fireEvent.click(downloadLinks[0])

    await waitFor(() => {
      expect(
        screen.getByText('Arquivo indisponível. Tente novamente mais tarde.')
      ).toBeInTheDocument()
    })
  })

  it('clears error when a new download is attempted', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))

    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    fireEvent.click(downloadLinks[0])

    await waitFor(() => {
      expect(
        screen.getByText('Arquivo indisponível. Tente novamente mais tarde.')
      ).toBeInTheDocument()
    })

    fireEvent.click(downloadLinks[0])

    await waitFor(() => {
      expect(
        screen.queryByText('Arquivo indisponível. Tente novamente mais tarde.')
      ).not.toBeInTheDocument()
    })
  })

  it('error message has role="alert" for accessibility', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    render(<TISSManual />)

    const downloadLinks = screen.getAllByRole('link')
    fireEvent.click(downloadLinks[0])

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Arquivo indisponível. Tente novamente mais tarde.')
    })
  })

  it('download links have accessible labels', () => {
    render(<TISSManual />)

    expect(
      screen.getByLabelText(/Baixar Manual TISS 4\.0 em formato PDF/)
    ).toBeInTheDocument()
  })
})

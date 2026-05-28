import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WhatsAppButton } from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('renders a link with the correct WhatsApp URL (phone only)', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/5511999999999');
  });

  it('renders a link with encoded message in the URL', () => {
    render(
      <WhatsAppButton phoneNumber="5511999999999" message="Olá, gostaria de mais informações" />
    );

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute(
      'href',
      `https://wa.me/5511999999999?text=${encodeURIComponent('Olá, gostaria de mais informações')}`
    );
  });

  it('opens in a new tab', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has an accessible aria-label', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByLabelText('Entrar em contato pelo WhatsApp');
    expect(link).toBeInTheDocument();
  });

  it('has fixed positioning classes for bottom-right placement', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link.className).toContain('fixed');
    expect(link.className).toContain('bottom-6');
    expect(link.className).toContain('right-6');
  });

  it('has minimum 56x56px size via Tailwind classes', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link.className).toContain('min-w-touch-lg');
    expect(link.className).toContain('min-h-touch-lg');
  });

  it('uses whatsapp green background color', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link.className).toContain('bg-whatsapp');
  });

  it('contains an SVG icon with aria-hidden', () => {
    render(<WhatsAppButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link', { name: /whatsapp/i });
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

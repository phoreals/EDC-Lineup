import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArtistCard } from '../ArtistCard';

describe('ArtistCard', () => {
  it('renders the artist name', () => {
    render(<ArtistCard name="Tiësto" isFav={false} onToggle={() => {}} />);
    expect(screen.getByText('Tiësto')).toBeInTheDocument();
  });

  it('shows hollow star when not favorited', () => {
    render(<ArtistCard name="Tiësto" isFav={false} onToggle={() => {}} />);
    expect(screen.getByText('☆')).toBeInTheDocument();
  });

  it('shows filled star when favorited', () => {
    render(<ArtistCard name="Tiësto" isFav={true} onToggle={() => {}} />);
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('calls onToggle with artist name on click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ArtistCard name="Zedd" isFav={false} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('Zedd');
  });

  it('calls onToggle on Enter key', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ArtistCard name="Zedd" isFav={false} onToggle={onToggle} />);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onToggle).toHaveBeenCalledWith('Zedd');
  });

  it('calls onToggle on Space key', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ArtistCard name="Zedd" isFav={false} onToggle={onToggle} />);
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(onToggle).toHaveBeenCalledWith('Zedd');
  });

  it('sets aria-pressed based on isFav', () => {
    const { rerender } = render(
      <ArtistCard name="Zedd" isFav={false} onToggle={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<ArtistCard name="Zedd" isFav={true} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('includes artist name in aria-label', () => {
    render(<ArtistCard name="Fisher" isFav={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Fisher',
    );
  });

  it('appends favorited to aria-label when favorited', () => {
    render(<ArtistCard name="Fisher" isFav={true} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Fisher — favorited',
    );
  });

  it('renders time when provided', () => {
    render(<ArtistCard name="Argy" time="5:30pm–6:30pm" isFav={false} onToggle={() => {}} />);
    expect(screen.getByText('5:30pm–6:30pm')).toBeInTheDocument();
  });

  it('does not render time when not provided', () => {
    render(<ArtistCard name="Argy" isFav={false} onToggle={() => {}} />);
    expect(screen.queryByText(/[ap]m/)).not.toBeInTheDocument();
  });

  it('includes time in aria-label when provided', () => {
    render(<ArtistCard name="Argy" time="5:30pm–6:30pm" isFav={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Argy 5:30pm–6:30pm',
    );
  });
});

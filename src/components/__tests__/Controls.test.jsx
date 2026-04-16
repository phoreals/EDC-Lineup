import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controls } from '../Controls';

// Mock useStickyHeight to avoid ResizeObserver issues in tests
vi.mock('../../hooks/useStickyHeight', () => ({
  useStickyHeight: () => ({ current: null }),
}));

const defaultProps = {
  activeDay: 'SCHEDULE',
  onDayChange: vi.fn(),
  query: '',
  onQueryChange: vi.fn(),
  activeStages: new Set(),
  onStageToggle: vi.fn(),
  favOnly: false,
  onFavToggle: vi.fn(),
  onClearFilters: vi.fn(),
  activeFilterDays: new Set(),
  onFilterDayToggle: vi.fn(),
  compactMode: false,
  onCompactToggle: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controls', () => {
  it('renders all tabs', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('List View')).toBeInTheDocument();
    expect(screen.getByText('By Stage')).toBeInTheDocument();
  });

  it('renders day filter pills', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('calls onDayChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Controls {...defaultProps} />);
    await user.click(screen.getByText('List View'));
    expect(defaultProps.onDayChange).toHaveBeenCalledWith('LIST');
  });

  it('renders the desktop search input', () => {
    render(<Controls {...defaultProps} />);
    const inputs = screen.getAllByPlaceholderText('Search artists...');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls onQueryChange on search input', async () => {
    const user = userEvent.setup();
    render(<Controls {...defaultProps} />);
    const input = screen.getAllByPlaceholderText('Search artists...')[0];
    await user.type(input, 'zedd');
    expect(defaultProps.onQueryChange).toHaveBeenCalled();
  });

  it('renders stage filter pills', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText('Kinetic Field')).toBeInTheDocument();
    expect(screen.getByText('Basspod')).toBeInTheDocument();
    expect(screen.getByText('Neon Garden')).toBeInTheDocument();
  });

  it('calls onStageToggle when a stage pill is clicked', async () => {
    const user = userEvent.setup();
    render(<Controls {...defaultProps} />);
    await user.click(screen.getByText('Basspod'));
    expect(defaultProps.onStageToggle).toHaveBeenCalledWith('Basspod');
  });

  it('renders the favorites toggle', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByText(/Favorited/)).toBeInTheDocument();
  });

  it('calls onFavToggle when favorites pill is clicked', async () => {
    const user = userEvent.setup();
    render(<Controls {...defaultProps} />);
    await user.click(screen.getByText(/Favorited/));
    expect(defaultProps.onFavToggle).toHaveBeenCalled();
  });

  it('calls onClearFilters when Clear is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Controls {...defaultProps} activeStages={new Set(['Basspod'])} />,
    );
    await user.click(screen.getByText('Clear'));
    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });
});

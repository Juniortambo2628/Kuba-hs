import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardGreetingBar } from '@/components/dashboard/workspace/DashboardGreetingBar';

jest.mock('@/lib/dashboard-ui', () => ({
  workspaceUi: {
    greeting: {
      title: 'text-2xl font-bold',
      subtitle: 'text-muted-foreground',
      stat: 'text-sm',
      statValue: 'font-bold',
    },
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

describe('DashboardGreetingBar', () => {
  it('renders greeting', () => {
    render(<DashboardGreetingBar greeting="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<DashboardGreetingBar greeting="Dashboard" subtitle="Overview" />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <DashboardGreetingBar greeting="Dashboard" actions={<button>Add Item</button>} />
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('renders stats when provided', () => {
    render(<DashboardGreetingBar greeting="Dashboard" stats={[{ label: 'Bookings', value: 12 }]} />);
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});

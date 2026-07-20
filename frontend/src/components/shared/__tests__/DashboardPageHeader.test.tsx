import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

jest.mock('@/lib/dashboard-ui', () => ({
  workspaceUi: {
    greeting: {
      title: 'text-2xl font-bold',
      subtitle: 'text-muted-foreground',
    },
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('DashboardPageHeader', () => {
  it('renders title', () => {
    render(<DashboardPageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<DashboardPageHeader title="Dashboard" subtitle="Overview" />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders children (action buttons)', () => {
    render(
      <DashboardPageHeader title="Dashboard">
        <button>Add Item</button>
      </DashboardPageHeader>
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardShell } from '@/components/layout/DashboardShell';

jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
}));

jest.mock('@/components/layout/KubaSidebar', () => ({
  KubaSidebar: () => <div data-testid="sidebar" />,
}));

jest.mock('@/components/layout/DashboardHeader', () => ({
  DashboardHeader: ({ isAdmin }: { isAdmin?: boolean }) => (
    <div data-testid="dashboard-header" data-admin={isAdmin} />
  ),
}));

jest.mock('lucide-react', () => ({
  Loader2: (props: any) => <span data-testid="spinner" {...props} />,
}));

jest.mock('@/lib/dashboard-ui', () => ({
  dashboardUi: {
    shell: {
      main: '',
      content: '',
      contentPadding: '',
      contentPaddingLg: '',
    },
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('DashboardShell', () => {
  it('shows loading spinner when isLoading=true', () => {
    render(<DashboardShell isLoading>Content</DashboardShell>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('shows custom loadingLabel when provided', () => {
    render(<DashboardShell isLoading loadingLabel="Fetching data...">Content</DashboardShell>);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('renders children when not loading', () => {
    render(<DashboardShell>Dashboard Content</DashboardShell>);
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('renders sidebar and header when not loading', () => {
    render(<DashboardShell>Content</DashboardShell>);
    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
  });
});

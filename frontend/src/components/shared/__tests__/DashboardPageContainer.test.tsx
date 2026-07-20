import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPageContainer } from '@/components/shared/DashboardPageContainer';

jest.mock('@/lib/dashboard-ui', () => ({
  dashboardPageContainerClass: (width: string) => `container-${width}`,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('DashboardPageContainer', () => {
  it('renders children', () => {
    render(<DashboardPageContainer>Page content</DashboardPageContainer>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('applies width class', () => {
    const { container } = render(
      <DashboardPageContainer width="wide">Content</DashboardPageContainer>
    );
    expect(container.firstChild).toHaveClass('container-wide');
  });
});

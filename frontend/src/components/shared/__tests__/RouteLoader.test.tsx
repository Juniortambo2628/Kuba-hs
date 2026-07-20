import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { RouteLoader } from '@/components/shared/RouteLoader';

let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

beforeEach(() => {
  jest.useFakeTimers();
  mockPathname = '/';
  mockSearchParams = new URLSearchParams();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('RouteLoader', () => {
  it('does not show loader on first mount', () => {
    render(<RouteLoader />);
    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();
  });

  it('shows loader when navigating from public to auth route', () => {
    const { rerender } = render(<RouteLoader />);
    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();

    mockPathname = '/dashboard';
    rerender(<RouteLoader />);

    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();
  });

  it('does NOT show loader when navigating within dashboard sub-pages', () => {
    mockPathname = '/dashboard';
    const { rerender } = render(<RouteLoader />);
    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();

    mockPathname = '/dashboard/bookings';
    rerender(<RouteLoader />);

    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();
  });

  it('shows loader when navigating from auth to public route', () => {
    mockPathname = '/dashboard';
    const { rerender } = render(<RouteLoader />);
    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();

    mockPathname = '/';
    rerender(<RouteLoader />);

    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();
  });

  it('hides loader after timeout', () => {
    mockPathname = '/dashboard';
    const { rerender } = render(<RouteLoader />);

    mockPathname = '/';
    rerender(<RouteLoader />);

    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1200);
    });

    expect(screen.queryByLabelText('Loading page')).not.toBeInTheDocument();
  });
});

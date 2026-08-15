import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Simple component to test the context
const TestComponent = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return <div>{user ? 'Authenticated' : 'Not Authenticated'}</div>;
};

describe('AuthContext', () => {
  it('provides authentication state to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Check initial state
    expect(screen.getByText(/Loading...|Not Authenticated/)).toBeInTheDocument();
  });
});

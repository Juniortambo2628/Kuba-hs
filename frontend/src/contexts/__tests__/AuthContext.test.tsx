import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Simple component to test the context
const TestComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
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

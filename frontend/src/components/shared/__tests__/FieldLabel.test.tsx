import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldLabel } from '@/components/shared/ui/FilterControls';

jest.mock('@/lib/ui-primitives', () => ({
  uiPrimitives: {
    label: {
      fieldBlock: 'label-field-block',
    },
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('FieldLabel', () => {
  it('renders children text', () => {
    render(<FieldLabel>Full Name</FieldLabel>);
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('is a label element', () => {
    render(<FieldLabel>Email Address</FieldLabel>);
    const label = screen.getByText('Email Address');
    expect(label.tagName).toBe('LABEL');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppConfirmDialog } from '@/components/shared/dialog/AppConfirmDialog';

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/lib/crud-dialog-ui', () => ({
  crudDialogUi: {
    content: '',
    layout: '',
    intro: '',
    introTitle: '',
    introDesc: '',
    main: '',
    formWrap: '',
    formCard: '',
    footer: '',
    cancelBtn: '',
    submitBtn: '',
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  title: 'Delete Item',
  description: 'Are you sure you want to delete this item?',
  onConfirm: jest.fn(),
};

describe('AppConfirmDialog', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders title and description', () => {
    render(<AppConfirmDialog {...defaultProps} />);
    expect(screen.getAllByText('Delete Item').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Are you sure you want to delete this item?').length).toBeGreaterThan(0);
  });

  it('calls onConfirm when confirm button clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(<AppConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange(false) when cancel clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<AppConfirmDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await user.click(screen.getByText('Cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows destructive styling when variant=destructive', () => {
    render(<AppConfirmDialog {...defaultProps} variant="destructive" />);
    const confirmBtn = screen.getByText('Confirm').closest('button');
    expect(confirmBtn?.className).toContain('bg-destructive');
  });

  it('shows loading state when isLoading=true', () => {
    render(<AppConfirmDialog {...defaultProps} isLoading />);
    const confirmBtn = screen.getByText('Confirm').closest('button');
    const cancelBtn = screen.getByText('Cancel').closest('button');
    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });
});

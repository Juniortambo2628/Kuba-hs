import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CrudFormDialog } from '@/components/shared/dialog/CrudFormDialog';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, form, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} form={form} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Loader2: (props: any) => <span data-testid="spinner" {...props} />,
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
  introTitle: 'Create Item',
  children: <div>Form content</div>,
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
};

describe('CrudFormDialog', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders when open', () => {
    render(<CrudFormDialog {...defaultProps} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CrudFormDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('shows introTitle and introDescription', () => {
    render(
      <CrudFormDialog {...defaultProps} introDescription="Fill in the details below" />
    );
    expect(screen.getAllByText('Create Item').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fill in the details below').length).toBeGreaterThan(0);
  });

  it('shows submit and cancel buttons', () => {
    render(<CrudFormDialog {...defaultProps} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<CrudFormDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await user.click(screen.getByText('Cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state when isSubmitting is true', () => {
    render(<CrudFormDialog {...defaultProps} isSubmitting />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<CrudFormDialog {...defaultProps} />);
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });
});

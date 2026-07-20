import { renderHook, act } from '@testing-library/react';
import { useCrudForm } from '@/hooks/useCrudForm';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(), put: jest.fn() },
  handleApiError: jest.fn(() => 'Error occurred'),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

type TestForm = { name: string; email: string };

const empty = (): TestForm => ({ name: '', email: '' });

function renderUseCrudForm(overrides: Partial<Parameters<typeof useCrudForm<TestForm>>[0]> = {}) {
  const defaults = {
    editingId: null as string | number | null,
    initial: undefined as Partial<TestForm> | undefined,
    preparePayload: undefined as ((form: TestForm) => Record<string, unknown>) | undefined,
    extraCreatePayload: undefined as Record<string, unknown> | undefined,
  };
  return renderHook(
    ({ editingId, initial, preparePayload, extraCreatePayload }) =>
      useCrudForm<TestForm>({
        empty,
        endpoint: '/api/items',
        editingId,
        initial,
        preparePayload,
        extraCreatePayload,
      }),
    {
      initialProps: { ...defaults, ...overrides },
    }
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (axiosInstance.post as jest.Mock).mockResolvedValue({ data: {} });
  (axiosInstance.put as jest.Mock).mockResolvedValue({ data: {} });
});

describe('useCrudForm', () => {
  it('initializes form with empty() values', () => {
    const { result } = renderUseCrudForm();
    expect(result.current.form).toEqual({ name: '', email: '' });
  });

  it('resets form when editingId changes', () => {
    const { result, rerender } = renderUseCrudForm({ editingId: null });

    act(() => {
      result.current.setForm({ name: 'dirty', email: 'dirty@test.com' });
    });
    expect(result.current.form).toEqual({ name: 'dirty', email: 'dirty@test.com' });

    rerender({ editingId: 42, initial: { name: 'Alice', email: 'alice@test.com' } });

    expect(result.current.form).toEqual({ name: 'Alice', email: 'alice@test.com' });
  });

  it('merges initial values with empty() on mount', () => {
    const { result } = renderUseCrudForm({
      initial: { name: 'Alice' },
    });
    expect(result.current.form).toEqual({ name: 'Alice', email: '' });
  });

  it('sends POST for create (no editingId) with correct payload', async () => {
    const { result } = renderUseCrudForm();

    act(() => {
      result.current.setForm({ name: 'Bob', email: 'bob@test.com' });
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(axiosInstance.post).toHaveBeenCalledWith('/api/items', {
      name: 'Bob',
      email: 'bob@test.com',
    });
    expect(toast.success).toHaveBeenCalledWith('Created successfully');
  });

  it('sends PUT for edit (with editingId) with correct payload', async () => {
    const { result } = renderUseCrudForm({
      editingId: 5,
    });

    act(() => {
      result.current.setForm({ name: 'Updated', email: 'updated@test.com' });
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(axiosInstance.put).toHaveBeenCalledWith('/api/items/5', {
      name: 'Updated',
      email: 'updated@test.com',
    });
    expect(toast.success).toHaveBeenCalledWith('Updated successfully');
  });

  it('calls preparePayload before sending', async () => {
    const preparePayload = jest.fn((form: TestForm) => ({
      full_name: form.name,
      contact: form.email,
    }));

    const { result } = renderUseCrudForm({
      preparePayload,
    });

    act(() => {
      result.current.setForm({ name: 'Bob', email: 'bob@test.com' });
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(preparePayload).toHaveBeenCalledWith({ name: 'Bob', email: 'bob@test.com' });
    expect(axiosInstance.post).toHaveBeenCalledWith('/api/items', {
      full_name: 'Bob',
      contact: 'bob@test.com',
    });
  });

  it('merges extraCreatePayload on create', async () => {
    const { result } = renderUseCrudForm({
      extraCreatePayload: { category_id: 10 },
    });

    act(() => {
      result.current.setForm({ name: 'Item', email: 'item@test.com' });
    });

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/items', {
      name: 'Item',
      email: 'item@test.com',
      category_id: 10,
    });
  });

  it('sets isSaving true during submission, false after', async () => {
    let resolvePost: (value: unknown) => void;
    (axiosInstance.post as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve;
      })
    );

    const { result } = renderUseCrudForm();

    expect(result.current.isSaving).toBe(false);

    const fakeEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    let submitPromise: Promise<void>;
    act(() => {
      submitPromise = result.current.handleSubmit(fakeEvent);
    });
    await act(async () => {
      // flush microtasks so isSaving becomes true
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      resolvePost!({ data: {} });
      await submitPromise!;
    });

    expect(result.current.isSaving).toBe(false);
  });
});

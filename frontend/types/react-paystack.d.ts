declare module 'react-paystack' {
  import type { FC, ReactNode } from 'react';

  export interface PaystackConfig {
    publicKey: string;
    email: string;
    amount: number;
    reference?: string;
    currency?: string;
    plan?: string;
    quantity?: number;
    channels?: string[];
    metadata?: Record<string, unknown>;
    callbackUrl?: string;
    [key: string]: unknown;
  }

  export interface PaystackResponse {
    message: string;
    reference: string;
    status: string;
    trans?: string;
    transaction_id?: string | number;
    [key: string]: unknown;
  }

  export interface PaystackInitializeOptions {
    config?: PaystackConfig;
    onSuccess?: (response: PaystackResponse) => void;
    onCancel?: (response: PaystackResponse) => void;
    onClose?: () => void;
  }

  export function usePaystackPayment(
    config: PaystackConfig
  ): (options?: PaystackInitializeOptions) => void;

  export interface PaystackButtonProps extends PaystackInitializeOptions {
    config: PaystackConfig;
    text?: string;
    className?: string;
    children?: ReactNode;
  }

  export const PaystackButton: FC<PaystackButtonProps>;
}

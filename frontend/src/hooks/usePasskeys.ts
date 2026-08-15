"use client";

import { useState, useCallback } from "react";
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser";
import axiosInstance from "@/lib/axios";
import { Passkey } from "@/types";

export function usePasskeys() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [isSupported] = useState(() => browserSupportsWebAuthn());

  const fetchPasskeys = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/auth/passkeys");
      setPasskeys(res.data?.passkeys ?? []);
    } catch {
      // silently fail
    }
  }, []);

  const registerPasskey = useCallback(async (name?: string) => {
    const optionsRes = await axiosInstance.post("/api/auth/passkey/register/options");
    const options = optionsRes.data;

    const registrationResponse = await startRegistration({ optionsJSON: options });

    const verifyRes = await axiosInstance.post("/api/auth/passkey/register/verify", {
      credential: registrationResponse,
      name: name || undefined,
    });

    return verifyRes.data;
  }, []);

  const authenticateWithPasskey = useCallback(async () => {
    const optionsRes = await axiosInstance.post("/api/auth/passkey/authenticate/options");
    const options = optionsRes.data;

    const authenticationResponse = await startAuthentication({ optionsJSON: options });

    const verifyRes = await axiosInstance.post("/api/auth/passkey/authenticate/verify", {
      credential: authenticationResponse,
    });

    return verifyRes.data;
  }, []);

  const deletePasskey = useCallback(async (id: string) => {
    await axiosInstance.delete(`/api/auth/passkey/${id}`);
    setPasskeys((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    passkeys,
    isSupported,
    fetchPasskeys,
    registerPasskey,
    authenticateWithPasskey,
    deletePasskey,
  };
}

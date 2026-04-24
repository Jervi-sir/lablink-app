import { getStoredToken } from '../async-storage/auth-async-storage';
import { ApiRoutes, buildRoute } from './api';
import api from './axios-instance';
import { registerAndSyncPushToken } from '../notifications/push-notifications';

// helpers
function getStatus(err: any): number | null {
  return err?.response?.status ?? null;
}

export type BootstrapResult =
  | { ok: true; token: string; user: any }
  | { ok: false; reason: 'NO_TOKEN' }
  | { ok: false; reason: 'INVALID_TOKEN' } // 401/403
  | { ok: false; reason: 'TEMPORARY'; status: number | null; message?: string }; // network/timeout/5xx

export async function bootstrapAuth(): Promise<BootstrapResult> {
  const token = await getStoredToken();
  if (!token) return { ok: false, reason: 'NO_TOKEN' };

  try {
    const res = await api.get(ApiRoutes.auth.me, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { user, profile, type } = res.data;
    setTimeout(() => {
      registerAndSyncPushToken();
    }, 5000);
    return { ok: true, token, user: { ...user, profile, type } };
  } catch (err: any) {
    const status = getStatus(err);

    // only treat auth failures as "invalid token"
    if (status === 401 || status === 403) {
      return { ok: false, reason: 'INVALID_TOKEN' };
    }

    // everything else: keep token, let user retry
    return {
      ok: false,
      reason: 'TEMPORARY',
      status,
      message: err?.message,
    };
  }
}

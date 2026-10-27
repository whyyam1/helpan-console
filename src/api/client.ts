/**
 * Helpan Console API client.
 *
 * Wraps the Helpan AI rail's Console-facing endpoints. Authenticates with
 * the Identiti customer JWT (the consuming app supplies it); the rail's
 * H-8a dual-auth accepts a customer JWT on `/v1/authorities/*`.
 *
 * Pure with respect to React Native — `fetch` is the only platform
 * dependency and is injectable, so this module is unit-tested under plain
 * Node with a stub fetch.
 *
 * Every method unwraps the rail's `{ ok, data, meta }` envelope and throws
 * `ConsoleApiError` (carrying the rail's stable error `code`) on failure.
 */

import type {
  Authority,
  ConsoleAction,
  ErrorEnvelope,
  IssueAuthorityRequest,
  OauthScope,
  PageData,
  SuccessEnvelope,
} from '../types.js';

export class ConsoleApiError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  constructor(code: string, message: string, httpStatus: number) {
    super(message);
    this.name = 'ConsoleApiError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export interface ConsoleApiConfig {
  /** Rail base URL, e.g. `https://helpanai-production.up.railway.app` (no trailing slash). */
  readonly baseUrl: string;
  /** Identiti customer JWT. */
  readonly customerToken: string;
  /** The consuming app's id, sent as `X-App-Id`. */
  readonly appId: string;
  /** Injectable for tests; defaults to global `fetch`. */
  readonly fetch?: typeof fetch;
  /** Injectable idempotency-key generator; defaults to `crypto.randomUUID`. */
  readonly generateIdempotencyKey?: () => string;
}

export interface ListAuthoritiesQuery {
  status?: 'active' | 'expired' | 'revoked';
  agentId?: string;
  cursor?: string;
  limit?: number;
}

export interface ListActionsQuery {
  status?: 'pending' | 'completed' | 'failed';
  agentId?: string;
  targetRail?: 'kipkiren_pay' | 'identiti' | 'todoku';
  cursor?: string;
  limit?: number;
}

function defaultIdempotencyKey(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  // Fallback for runtimes without crypto.randomUUID — sufficient for an
  // idempotency key (uniqueness, not cryptographic strength, is the need).
  return `idk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

function queryString(params: Record<string, string | number | undefined>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

export class ConsoleApiClient {
  private readonly baseUrl: string;
  private readonly customerToken: string;
  private readonly appId: string;
  private readonly fetchImpl: typeof fetch;
  private readonly idk: () => string;

  constructor(config: ConsoleApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.customerToken = config.customerToken;
    this.appId = config.appId;
    this.fetchImpl = config.fetch ?? fetch;
    this.idk = config.generateIdempotencyKey ?? defaultIdempotencyKey;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    options: { body?: unknown; idempotent?: boolean } = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      authorization: `Bearer ${this.customerToken}`,
      'x-app-id': this.appId,
    };
    let body: string | undefined;
    if (options.body !== undefined) {
      headers['content-type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    if (options.idempotent) {
      headers['x-idempotency-key'] = this.idk();
    }

    let res: Response;
    try {
      res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...(body !== undefined ? { body } : {}),
      });
    } catch (err) {
      throw new ConsoleApiError(
        'NETWORK_UNREACHABLE',
        `Could not reach the Helpan rail: ${(err as Error).message}`,
        0
      );
    }

    if (res.status === 204) return undefined as T;

    let payload: SuccessEnvelope<T> | ErrorEnvelope;
    try {
      payload = (await res.json()) as SuccessEnvelope<T> | ErrorEnvelope;
    } catch {
      throw new ConsoleApiError(
        'BAD_RESPONSE',
        `Rail returned a non-JSON response (HTTP ${res.status})`,
        res.status
      );
    }

    if (res.ok && payload.ok) return payload.data;
    if (!payload.ok) {
      throw new ConsoleApiError(payload.error.code, payload.error.message, res.status);
    }
    throw new ConsoleApiError('BAD_RESPONSE', `Unexpected response (HTTP ${res.status})`, res.status);
  }

  /** GET /v1/authorities — the authenticated customer's authorities. */
  listAuthorities(query: ListAuthoritiesQuery = {}): Promise<PageData<Authority>> {
    const qs = queryString({
      status: query.status,
      agent_id: query.agentId,
      cursor: query.cursor,
      limit: query.limit,
    });
    return this.request<PageData<Authority>>('GET', `/v1/authorities${qs}`);
  }

  /** GET /v1/authorities/:id */
  getAuthority(id: string): Promise<Authority> {
    return this.request<Authority>('GET', `/v1/authorities/${encodeURIComponent(id)}`);
  }

  /** POST /v1/authorities/:id/revoke — one-tap revocation (spec §4.1). */
  revokeAuthority(id: string): Promise<Authority> {
    return this.request<Authority>(
      'POST',
      `/v1/authorities/${encodeURIComponent(id)}/revoke`,
      { body: {}, idempotent: true }
    );
  }

  /** POST /v1/authorities — grant a new authority (spec §4.3 grant flow). */
  grantAuthority(req: IssueAuthorityRequest): Promise<Authority> {
    return this.request<Authority>('POST', '/v1/authorities', {
      body: req,
      idempotent: true,
    });
  }

  /** GET /v1/actions — the Activity tab feed (rail endpoint lands at H-4). */
  listActions(query: ListActionsQuery = {}): Promise<PageData<ConsoleAction>> {
    const qs = queryString({
      status: query.status,
      agent_id: query.agentId,
      target_rail: query.targetRail,
      cursor: query.cursor,
      limit: query.limit,
    });
    return this.request<PageData<ConsoleAction>>('GET', `/v1/actions${qs}`);
  }

  /** GET /v1/oauth/scopes — scope catalogue, for human-readable scope display. */
  listScopes(rail?: string): Promise<OauthScope[]> {
    const qs = queryString({ rail });
    return this.request<PageData<OauthScope>>('GET', `/v1/oauth/scopes${qs}`).then(
      (page) => page.items
    );
  }
}

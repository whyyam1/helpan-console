"use strict";

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

export class ConsoleApiError extends Error {
  constructor(code, message, httpStatus) {
    super(message);
    this.name = 'ConsoleApiError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}
function defaultIdempotencyKey() {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  // Fallback for runtimes without crypto.randomUUID — sufficient for an
  // idempotency key (uniqueness, not cryptographic strength, is the need).
  return `idk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}
function queryString(params) {
  const parts = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}
export class ConsoleApiClient {
  constructor(config) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.customerToken = config.customerToken;
    this.appId = config.appId;
    this.fetchImpl = config.fetch ?? fetch;
    this.idk = config.generateIdempotencyKey ?? defaultIdempotencyKey;
  }
  async request(method, path, options = {}) {
    const headers = {
      authorization: `Bearer ${this.customerToken}`,
      'x-app-id': this.appId
    };
    let body;
    if (options.body !== undefined) {
      headers['content-type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    if (options.idempotent) {
      headers['x-idempotency-key'] = this.idk();
    }
    let res;
    try {
      res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...(body !== undefined ? {
          body
        } : {})
      });
    } catch (err) {
      throw new ConsoleApiError('NETWORK_UNREACHABLE', `Could not reach the Helpan rail: ${err.message}`, 0);
    }
    if (res.status === 204) return undefined;
    let payload;
    try {
      payload = await res.json();
    } catch {
      throw new ConsoleApiError('BAD_RESPONSE', `Rail returned a non-JSON response (HTTP ${res.status})`, res.status);
    }
    if (res.ok && payload.ok) return payload.data;
    if (!payload.ok) {
      throw new ConsoleApiError(payload.error.code, payload.error.message, res.status);
    }
    throw new ConsoleApiError('BAD_RESPONSE', `Unexpected response (HTTP ${res.status})`, res.status);
  }

  /** GET /v1/authorities — the authenticated customer's authorities. */
  listAuthorities(query = {}) {
    const qs = queryString({
      status: query.status,
      agent_id: query.agentId,
      cursor: query.cursor,
      limit: query.limit
    });
    return this.request('GET', `/v1/authorities${qs}`);
  }

  /** GET /v1/authorities/:id */
  getAuthority(id) {
    return this.request('GET', `/v1/authorities/${encodeURIComponent(id)}`);
  }

  /** POST /v1/authorities/:id/revoke — one-tap revocation (spec §4.1). */
  revokeAuthority(id) {
    return this.request('POST', `/v1/authorities/${encodeURIComponent(id)}/revoke`, {
      body: {},
      idempotent: true
    });
  }

  /** POST /v1/authorities — grant a new authority (spec §4.3 grant flow). */
  grantAuthority(req) {
    return this.request('POST', '/v1/authorities', {
      body: req,
      idempotent: true
    });
  }

  /** GET /v1/actions — the Activity tab feed (rail endpoint lands at H-4). */
  listActions(query = {}) {
    const qs = queryString({
      status: query.status,
      agent_id: query.agentId,
      target_rail: query.targetRail,
      cursor: query.cursor,
      limit: query.limit
    });
    return this.request('GET', `/v1/actions${qs}`);
  }

  /** GET /v1/oauth/scopes — scope catalogue, for human-readable scope display. */
  listScopes(rail) {
    const qs = queryString({
      rail
    });
    return this.request('GET', `/v1/oauth/scopes${qs}`).then(page => page.items);
  }
}
//# sourceMappingURL=client.js.map
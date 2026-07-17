import { describe, it, expect } from 'vitest';
import { ConsoleApiClient, ConsoleApiError } from './client.js';
import type { Authority, SuccessEnvelope, ErrorEnvelope, PageData } from '../types.js';

const META = { request_id: '01TEST', timestamp: '2026-05-18T00:00:00Z', schema_version: '1.0' } as const;

interface CapturedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

/** A stub fetch that records the request and returns a chosen response. */
function stubFetch(
  responder: (req: CapturedRequest) => { status: number; json: unknown }
): { fetch: typeof fetch; calls: CapturedRequest[] } {
  const calls: CapturedRequest[] = [];
  const fn = (async (url: string, init?: RequestInit) => {
    const headers = (init?.headers ?? {}) as Record<string, string>;
    const captured: CapturedRequest = {
      url: String(url),
      method: init?.method ?? 'GET',
      headers,
      ...(typeof init?.body === 'string' ? { body: init.body } : {}),
    };
    calls.push(captured);
    const { status, json } = responder(captured);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => json,
    } as Response;
  }) as unknown as typeof fetch;
  return { fetch: fn, calls };
}

const AUTHORITY: Authority = {
  id: 'daa_01TESTAUTHORITY0000000000A',
  account_uuid: 'acc_00000000-0000-0000-0000-000000000001',
  agent_id: 'agt_01TESTAGENT0000000000000A',
  scopes: [{ scope_id: 'helpan.read.briefings' }],
  status: 'active',
  expires_at: '2026-05-19T00:00:00Z',
  created_at: '2026-05-18T00:00:00Z',
};

function ok<T>(data: T): SuccessEnvelope<T> {
  return { ok: true, data, meta: META };
}
function err(code: string): ErrorEnvelope {
  return { ok: false, error: { code, message: code }, meta: META };
}

describe('ConsoleApiClient', () => {
  it('listAuthorities sends Bearer + X-App-Id and unwraps the envelope', async () => {
    const { fetch, calls } = stubFetch(() => ({
      status: 200,
      json: ok<PageData<Authority>>({ items: [AUTHORITY], next_cursor: null }),
    }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke/',
      customerToken: 'cust-jwt',
      appId: 'lunchdrop',
      fetch,
    });
    const page = await client.listAuthorities({ status: 'active', limit: 50 });
    expect(page.items).toHaveLength(1);
    expect(calls[0]?.url).toBe('https://api.helpan.co.ke/v1/authorities?status=active&limit=50');
    expect(calls[0]?.headers['authorization']).toBe('Bearer cust-jwt');
    expect(calls[0]?.headers['x-app-id']).toBe('lunchdrop');
  });

  it('getAuthority encodes the id into the path', async () => {
    const { fetch, calls } = stubFetch(() => ({ status: 200, json: ok(AUTHORITY) }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch,
    });
    const a = await client.getAuthority(AUTHORITY.id);
    expect(a.id).toBe(AUTHORITY.id);
    expect(calls[0]?.url).toBe(`https://api.helpan.co.ke/v1/authorities/${AUTHORITY.id}`);
  });

  it('revokeAuthority POSTs with an idempotency key', async () => {
    const { fetch, calls } = stubFetch(() => ({
      status: 200,
      json: ok({ ...AUTHORITY, status: 'revoked' }),
    }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch,
      generateIdempotencyKey: () => 'fixed-key',
    });
    const a = await client.revokeAuthority(AUTHORITY.id);
    expect(a.status).toBe('revoked');
    expect(calls[0]?.method).toBe('POST');
    expect(calls[0]?.headers['x-idempotency-key']).toBe('fixed-key');
  });

  it('grantAuthority POSTs the issue request body', async () => {
    const { fetch, calls } = stubFetch(() => ({ status: 200, json: ok(AUTHORITY) }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch,
    });
    await client.grantAuthority({
      account_uuid: AUTHORITY.account_uuid,
      agent_id: AUTHORITY.agent_id,
      scopes: [{ scope_id: 'helpan.read.briefings' }],
      ttl_seconds: 3600,
    });
    expect(JSON.parse(calls[0]!.body!).ttl_seconds).toBe(3600);
  });

  it('listScopes unwraps the items array', async () => {
    const { fetch } = stubFetch(() => ({
      status: 200,
      json: ok({ items: [{ id: 'helpan.read.briefings' }] }),
    }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch,
    });
    const scopes = await client.listScopes('helpan');
    expect(scopes).toHaveLength(1);
  });

  it('throws ConsoleApiError carrying the rail error code on a 4xx', async () => {
    const { fetch } = stubFetch(() => ({ status: 404, json: err('AUTHORITY_NOT_FOUND') }));
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch,
    });
    await expect(client.getAuthority('daa_x')).rejects.toMatchObject({
      code: 'AUTHORITY_NOT_FOUND',
      httpStatus: 404,
    });
  });

  it('maps a network failure to NETWORK_UNREACHABLE', async () => {
    const failing = (async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    const client = new ConsoleApiClient({
      baseUrl: 'https://api.helpan.co.ke',
      customerToken: 't',
      appId: 'a',
      fetch: failing,
    });
    await expect(client.listAuthorities()).rejects.toBeInstanceOf(ConsoleApiError);
    await expect(client.listAuthorities()).rejects.toMatchObject({
      code: 'NETWORK_UNREACHABLE',
      httpStatus: 0,
    });
  });
});

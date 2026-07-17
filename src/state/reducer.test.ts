import { describe, it, expect } from 'vitest';
import {
  consoleReducer,
  initialConsoleState,
  selectActive,
  selectHistory,
  isRevoking,
  type ConsoleState,
} from './reducer.js';
import type { Authority } from '../types.js';

function authority(id: string, status: Authority['status']): Authority {
  return {
    id,
    account_uuid: 'acc_00000000-0000-0000-0000-000000000001',
    agent_id: 'agt_01TESTAGENT0000000000000A',
    scopes: [{ scope_id: 'helpan.read.briefings' }],
    status,
    expires_at: '2026-05-19T00:00:00Z',
    created_at: '2026-05-18T00:00:00Z',
  };
}

describe('consoleReducer — authorities', () => {
  it('loading → loaded replaces the list', () => {
    let s: ConsoleState = consoleReducer(initialConsoleState, { type: 'authorities/loading' });
    expect(s.authorities.status).toBe('loading');
    s = consoleReducer(s, {
      type: 'authorities/loaded',
      items: [authority('daa_a', 'active')],
      nextCursor: 'cur1',
      append: false,
    });
    expect(s.authorities.status).toBe('ready');
    expect(s.authorities.items).toHaveLength(1);
    expect(s.authorities.nextCursor).toBe('cur1');
  });

  it('loaded with append concatenates (pagination)', () => {
    let s = consoleReducer(initialConsoleState, {
      type: 'authorities/loaded',
      items: [authority('daa_a', 'active')],
      nextCursor: 'cur1',
      append: false,
    });
    s = consoleReducer(s, {
      type: 'authorities/loaded',
      items: [authority('daa_b', 'active')],
      nextCursor: null,
      append: true,
    });
    expect(s.authorities.items.map((a) => a.id)).toEqual(['daa_a', 'daa_b']);
    expect(s.authorities.nextCursor).toBeNull();
  });

  it('error carries the message', () => {
    const s = consoleReducer(initialConsoleState, {
      type: 'authorities/error',
      error: 'NETWORK_UNREACHABLE',
    });
    expect(s.authorities.status).toBe('error');
    expect(s.authorities.error).toBe('NETWORK_UNREACHABLE');
  });
});

describe('consoleReducer — revoke lifecycle', () => {
  const seeded = consoleReducer(initialConsoleState, {
    type: 'authorities/loaded',
    items: [authority('daa_a', 'active'), authority('daa_b', 'active')],
    nextCursor: null,
    append: false,
  });

  it('revoke/started marks the authority in-flight; revoke/failed clears it', () => {
    let s = consoleReducer(seeded, { type: 'revoke/started', authorityId: 'daa_a' });
    expect(isRevoking(s, 'daa_a')).toBe(true);
    s = consoleReducer(s, { type: 'revoke/failed', authorityId: 'daa_a' });
    expect(isRevoking(s, 'daa_a')).toBe(false);
  });

  it('revoke/started is idempotent', () => {
    let s = consoleReducer(seeded, { type: 'revoke/started', authorityId: 'daa_a' });
    s = consoleReducer(s, { type: 'revoke/started', authorityId: 'daa_a' });
    expect(s.revoking).toEqual(['daa_a']);
  });

  it('revoke/succeeded clears in-flight and moves the authority to revoked', () => {
    let s = consoleReducer(seeded, { type: 'revoke/started', authorityId: 'daa_a' });
    s = consoleReducer(s, {
      type: 'revoke/succeeded',
      authority: authority('daa_a', 'revoked'),
    });
    expect(isRevoking(s, 'daa_a')).toBe(false);
    expect(selectActive(s).map((a) => a.id)).toEqual(['daa_b']);
    expect(selectHistory(s).map((a) => a.id)).toEqual(['daa_a']);
  });
});

describe('consoleReducer — misc', () => {
  it('scopes/loaded builds a keyed catalogue', () => {
    const s = consoleReducer(initialConsoleState, {
      type: 'scopes/loaded',
      scopes: [
        {
          id: 'helpan.read.briefings',
          name: 'Read briefings',
          description: 'x',
          rail: 'helpan',
          category: 'read_aggregate',
          default_grantable: true,
          elevation_friction: 'low',
          per_scope_max_ttl_seconds: 86400,
          status: 'active',
        },
      ],
    });
    expect(s.scopes.get('helpan.read.briefings')?.name).toBe('Read briefings');
  });

  it('offline/set toggles the offline flag', () => {
    const s = consoleReducer(initialConsoleState, { type: 'offline/set', offline: true });
    expect(s.offline).toBe(true);
  });

  it('authority/upserted replaces an existing authority in place', () => {
    let s = consoleReducer(initialConsoleState, {
      type: 'authorities/loaded',
      items: [authority('daa_a', 'active')],
      nextCursor: null,
      append: false,
    });
    s = consoleReducer(s, {
      type: 'authority/upserted',
      authority: authority('daa_a', 'revoked'),
    });
    expect(s.authorities.items).toHaveLength(1);
    expect(s.authorities.items[0]?.status).toBe('revoked');
  });
});

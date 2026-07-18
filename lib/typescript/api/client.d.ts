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
import type { Authority, ConsoleAction, IssueAuthorityRequest, OauthScope, PageData } from '../types.js';
export declare class ConsoleApiError extends Error {
    readonly code: string;
    readonly httpStatus: number;
    constructor(code: string, message: string, httpStatus: number);
}
export interface ConsoleApiConfig {
    /** Rail base URL, e.g. `https://api.helpan.co.ke` (no trailing slash). */
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
export declare class ConsoleApiClient {
    private readonly baseUrl;
    private readonly customerToken;
    private readonly appId;
    private readonly fetchImpl;
    private readonly idk;
    constructor(config: ConsoleApiConfig);
    private request;
    /** GET /v1/authorities — the authenticated customer's authorities. */
    listAuthorities(query?: ListAuthoritiesQuery): Promise<PageData<Authority>>;
    /** GET /v1/authorities/:id */
    getAuthority(id: string): Promise<Authority>;
    /** POST /v1/authorities/:id/revoke — one-tap revocation (spec §4.1). */
    revokeAuthority(id: string): Promise<Authority>;
    /** POST /v1/authorities — grant a new authority (spec §4.3 grant flow). */
    grantAuthority(req: IssueAuthorityRequest): Promise<Authority>;
    /** GET /v1/actions — the Activity tab feed (rail endpoint lands at H-4). */
    listActions(query?: ListActionsQuery): Promise<PageData<ConsoleAction>>;
    /** GET /v1/oauth/scopes — scope catalogue, for human-readable scope display. */
    listScopes(rail?: string): Promise<OauthScope[]>;
}
//# sourceMappingURL=client.d.ts.map
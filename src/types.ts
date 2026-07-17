/**
 * Wire types for the Helpan Console.
 *
 * Mirror of the Helpan AI rail OpenAPI v1.0 (`helpan-ai-openapi-v1.yaml`)
 * — the Authorities, Actions, and OAuth tags — plus the standard response
 * envelope. Kept hand-authored (not generated) so the contract is
 * reviewable at the edit site; reconcile against the OpenAPI when the rail
 * revises it (notably `ConsoleAction` once H-4 finalises the Actions tag).
 */

// ---- response envelope -----------------------------------------------------

export interface ResponseMeta {
  request_id: string;
  timestamp: string;
  schema_version: '1.0';
}

export interface SuccessEnvelope<T> {
  ok: true;
  data: T;
  meta: ResponseMeta;
}

export interface ErrorBody {
  code: string;
  message: string;
  field?: string | null;
  detail?: Record<string, unknown>;
}

export interface ErrorEnvelope {
  ok: false;
  error: ErrorBody;
  meta: ResponseMeta;
}

// ---- authorities -----------------------------------------------------------

export type AuthorityStatus = 'active' | 'expired' | 'revoked';
export type AuthorityPeriod = 'single_use' | 'daily' | 'weekly' | 'monthly';

export interface AuthorityScope {
  scope_id: string;
  amount_limit_minor?: number;
  per_period_limit_minor?: number;
  period?: AuthorityPeriod;
  category_whitelist?: string[];
  recipient_whitelist?: string[];
}

export interface Authority {
  id: string;
  account_uuid: string;
  agent_id: string;
  scopes: AuthorityScope[];
  status: AuthorityStatus;
  /** Returned only on issuance — never on list/detail reads. */
  token?: string;
  expires_at: string;
  revoked_at?: string | null;
  revocation_reason?: string | null;
  created_at: string;
}

export interface IssueAuthorityRequest {
  account_uuid: string;
  agent_id: string;
  scopes: AuthorityScope[];
  ttl_seconds: number;
  step_up_token?: string;
}

// ---- actions (Activity tab) ------------------------------------------------

export type ActionStatus = 'pending' | 'completed' | 'failed';
export type TargetRail = 'kipkiren_pay' | 'identiti' | 'todoku';

/**
 * The Console's view of an agent action. Tracks the rail `actions` table
 * (ERD §1.6) — the redacted-payload columns are intentionally omitted; the
 * Console renders the human summary, not raw payloads.
 */
export interface ConsoleAction {
  id: string;
  agent_id: string;
  delegated_authority_jti?: string | null;
  target_rail: TargetRail;
  target_operation: string;
  status: ActionStatus;
  error_code?: string | null;
  created_at: string;
  completed_at?: string | null;
}

// ---- oauth scopes ----------------------------------------------------------

export type ScopeCategory =
  | 'read_aggregate'
  | 'read_behavioural'
  | 'write_money'
  | 'write_comms'
  | 'write_identity'
  | 'admin';

export type ElevationFriction = 'low' | 'medium' | 'high';

export interface OauthScope {
  id: string;
  name: string;
  description: string;
  rail: string;
  category: ScopeCategory;
  default_grantable: boolean;
  elevation_friction: ElevationFriction;
  per_scope_amount_ceiling_minor?: number | null;
  per_scope_period_ceiling_minor?: number | null;
  per_scope_max_ttl_seconds: number;
  status: 'active' | 'deprecated' | 'retired';
}

/** A `read_behavioural` scope triggers the Console's friction screen (spec §4.2). */
export function isBehaviouralScope(scope: Pick<OauthScope, 'category'>): boolean {
  return scope.category === 'read_behavioural';
}

// ---- list responses --------------------------------------------------------

export interface PageData<T> {
  items: T[];
  next_cursor?: string | null;
}

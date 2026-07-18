/**
 * Grant flow screen (spec §4 — friction + confirm).
 *
 * Three phases, owned by this screen as local state:
 *
 *   1. friction — shown ONLY when the proposed scope set contains any
 *      `read_behavioural` scope (Console spec §4.2; rail tags this via
 *      `oauth_scopes.category='read_behavioural'`). Renders
 *      `BehaviouralFrictionScreen`; user taps Continue → phase 2.
 *
 *   2. confirm — the standard grant flow. Renders the proposed scopes via
 *      `ScopeList`, shows the agent name + TTL summary, and a Confirm
 *      button. Tapping Confirm calls `onConfirm(req)` and transitions to
 *      `submitting`.
 *
 *   3. submitting — disables the Confirm button + shows the inflight
 *      hint. The parent is expected to resolve back to the previous
 *      screen on success (or hand back an error that the screen surfaces
 *      via the `error` prop).
 *
 * Step-up is owned by the parent: when the proposed scope set requires
 * step-up (rail tags this via `default_grantable=false`), the parent is
 * expected to interleave the Identiti step-up flow BEFORE calling
 * `onConfirm`. The Console doesn't drive step-up directly to keep its
 * surface area small.
 */
import React from 'react';
import type { AuthorityScope, IssueAuthorityRequest, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface GrantFlowProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    /** Account uuid the grant is for (must equal the customer JWT's `sub`). */
    readonly accountUuid: string;
    readonly agentId: string;
    readonly agentDisplayName: string;
    readonly proposedScopes: readonly AuthorityScope[];
    readonly ttlSeconds: number;
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
    /**
     * Optional step-up token (Identiti) — passed through verbatim to
     * `onConfirm`. The parent obtains this before rendering GrantFlow on a
     * high-stakes scope.
     */
    readonly stepUpToken?: string;
    readonly submitting?: boolean;
    readonly error?: string | null;
    readonly onConfirm: (req: IssueAuthorityRequest) => void;
    readonly onCancel: () => void;
}
export declare function GrantFlow(props: GrantFlowProps): React.JSX.Element;
//# sourceMappingURL=GrantFlow.d.ts.map
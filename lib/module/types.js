"use strict";

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

// ---- authorities -----------------------------------------------------------

// ---- actions (Activity tab) ------------------------------------------------

/**
 * The Console's view of an agent action. Tracks the rail `actions` table
 * (ERD §1.6) — the redacted-payload columns are intentionally omitted; the
 * Console renders the human summary, not raw payloads.
 */

// ---- oauth scopes ----------------------------------------------------------

/** A `read_behavioural` scope triggers the Console's friction screen (spec §4.2). */
export function isBehaviouralScope(scope) {
  return scope.category === 'read_behavioural';
}

// ---- list responses --------------------------------------------------------
//# sourceMappingURL=types.js.map
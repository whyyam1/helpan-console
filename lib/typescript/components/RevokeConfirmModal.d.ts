/**
 * Revoke confirmation modal (spec §4.1).
 *
 * Bottom-sheet style on mobile, centered on tablet/web. ONE confirm screen
 * — the spec is explicit: "No multi-step 'are you sure' sequences.
 * Revocation is a positive user act and friction is wrong here." The
 * modal shows:
 *
 *   1. Agent name (so the user knows what they're revoking)
 *   2. What revocation does (i18n: revoke.body)
 *   3. The in-flight clause (i18n: revoke.inflight)
 *   4. [Cancel] [Confirm Revoke]
 *
 * The confirm button uses `colors.danger` semantically — even under a
 * rebranded theme, revoke is always the destructive colour (spec §8:
 * "the Console's semantic UI is preserved").
 *
 * Inflight state: when `isRevoking=true`, the confirm button is disabled
 * and labelled with the spinner glyph. The caller drives this from
 * `isRevoking(state, authorityId)` on the reducer.
 */
import React from 'react';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface RevokeConfirmModalProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly visible: boolean;
    readonly agentName: string;
    readonly isRevoking: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}
export declare function RevokeConfirmModal(props: RevokeConfirmModalProps): React.JSX.Element;
//# sourceMappingURL=RevokeConfirmModal.d.ts.map
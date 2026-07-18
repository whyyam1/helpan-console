/**
 * Behavioural-data friction screen (spec §4.2).
 *
 * Shown BEFORE the grant flow when the requested scope set includes ANY
 * `read_behavioural` category scope (e.g. `chapaa.read.behavioural`). The
 * user must explicitly press Continue to proceed to the standard grant
 * flow — which then ALSO requires step-up (spec §4.3). Two gates total.
 *
 * Intentionally not skippable. The Continue button is the only progressive
 * affordance; Cancel pops the modal stack. This is the regulator-friendly
 * proof that the user crossed a deliberate gate for sensitive data.
 *
 * The body copy lists the kinds of behavioural detail (savings cadence,
 * withdrawal patterns, goal completions) — comes from `i18n: friction.body`.
 */
import React from 'react';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface BehaviouralFrictionScreenProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly onContinue: () => void;
    readonly onCancel: () => void;
}
export declare function BehaviouralFrictionScreen(props: BehaviouralFrictionScreenProps): React.JSX.Element;
//# sourceMappingURL=BehaviouralFrictionScreen.d.ts.map
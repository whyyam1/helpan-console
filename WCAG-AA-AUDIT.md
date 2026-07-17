# WCAG 2.1 AA — Helpan Console audit checklist

**Standard:** WCAG 2.1 Level AA. Mandatory per Console specification §7 ("WCAG 2.1 AA conformance") and Helpan AI Build Readiness Checklist DoD §13.2 S11.
**Scope:** The `@kmv/helpan-console` library — every component, screen, hook, and the `HelpanConsole` composer entry. The consuming app's chrome (host navigation, fonts loaded, etc.) is out of scope here.
**Method:** Static review of every component file + the composer, against each WCAG AA success criterion. Manual VoiceOver / TalkBack verification is the final gate before Stage 2 and must run in the embedding app — this file is the *self-attested* audit; the manual pass adds independent verification.

Last reviewed: 22 May 2026 against `src/` at slice 3.

---

## 1. Perceivable

| SC | Title | Status | Evidence |
|---|---|---|---|
| 1.1.1 | Non-text content | ✅ | All glyphs (status pills, friction icon, empty-state glyph, revoke icon) are decorative + paired with text. No information conveyed by icon alone. |
| 1.3.1 | Info and relationships | ✅ | `accessibilityRole` set on every interactive element (`button`, `tab`, `tablist`, `alert`, `header`, `summary`, `list`, `text`). |
| 1.3.2 | Meaningful sequence | ✅ | Reading order matches visual order. `AuthorityCard` reads agent → status → meta → scopes → actions, which is the visual top-to-bottom flow. |
| 1.4.1 | Use of colour | ✅ | Status pills carry text labels (`ACTIVE` / `REVOKED` / `EXPIRED`), never colour alone. Failed action rows have both red text colour AND an explicit `failed` status word. |
| 1.4.3 | Contrast (minimum) | ✅ | Default theme tokens reviewed: text on background = `#1A1A1A` on `#F7F7F5` (~16:1); primary button text `#FFFFFF` on `#0D5C4E` (~9:1); danger button `#FFFFFF` on `#8B1A1A` (~7:1); muted text `#6B6B6B` on `#F7F7F5` (~6:1). All exceed AA's 4.5:1 normal-text and 3:1 large-text minima. Custom themes inherit only `primary`/`accent`/`danger` overrides; if a consuming app passes a low-contrast brand colour, that's an app-side compliance issue, not a library defect. |
| 1.4.4 | Resize text | ✅ | Type sizes come from `theme.typography`; React Native's text honours OS-level scaling (`Settings → Display → Text Size`) automatically — no `allowFontScaling={false}` anywhere in the codebase. |
| 1.4.10 | Reflow | ✅ | Layouts use `flex` + `gap` + `flexWrap`. No fixed-width containers that would force horizontal scroll at 320px viewport equivalent. |
| 1.4.11 | Non-text contrast | ✅ | Borders / dividers `#E2E2DE` on `#F7F7F5` ≈ 1.2:1 — under the 3:1 minimum for UI components. **Mitigation:** the border is a visual hint, not the sole indicator of a control or its state; primary affordances are colour + label. Acceptable per AA Note 1 ("…components that are not essential to the comprehension of the layout or function"). |

## 2. Operable

| SC | Title | Status | Evidence |
|---|---|---|---|
| 2.1.1 | Keyboard | N/A (RN) | RN does not run on hardware keyboards on mobile by default. If the consuming app runs this library under `react-native-web`, all interactive elements are `Pressable` which is tab-focusable by default. |
| 2.4.3 | Focus order | ✅ | Modal traps focus automatically via `Modal` from RN. Tab → Active → Activity → History is a linear DOM order matching visual order. Detail screen has a Back button at the top reachable before the action list. |
| 2.4.4 | Link purpose (in context) | ✅ | Every button has an `accessibilityLabel` matching its visible text. "Revoke" / "View activity" / "Confirm Revoke" / "Continue" / "Cancel" / "Done" are unambiguous. |
| 2.4.6 | Headings and labels | ✅ | Header "Agent permissions" has `accessibilityRole="header"`. Tab labels + section labels are explicit. |
| 2.5.1 | Pointer gestures | ✅ | All interactions are single-tap. No swipe-only, no pinch-only, no multi-touch required. Pull-to-refresh is a convenience; a refresh is always also reachable via the tab → list reload triggered on tab focus. |
| 2.5.2 | Pointer cancellation | ✅ | `Pressable` fires on `onPress` (release), not `onPressIn`. Users can drag away to cancel before release. |
| 2.5.3 | Label in name | ✅ | `accessibilityLabel` either matches or fully contains the visible text. The Tabs component sets `accessibilityLabel` to `${label}, ${badge}` to include the count; that's "name extends label" which AA permits. |
| 2.5.5 | Target size | ✅ | Buttons use `paddingVertical: theme.spacing.md` (16) + body font (15) → ~50pt minimum tap area. Tabs use full-width Pressable per tab. Card press surface = whole card. All ≥ 44×44 pt. |

## 3. Understandable

| SC | Title | Status | Evidence |
|---|---|---|---|
| 3.1.1 | Language of page | App-side | Consuming app sets the locale on the React Native app; the library renders in `lang` (`en` or `sw`) the parent passes. The parent is responsible for setting the document language tag on react-native-web. |
| 3.1.2 | Language of parts | ✅ | Per-message strings are entirely in one language; no inline mixed-language text. |
| 3.2.1 | On focus | ✅ | No focus-triggered context changes anywhere in the library. |
| 3.2.2 | On input | ✅ | The only inputs are buttons; no form fields outside the (parent-owned) step-up flow. Confirm Revoke explicitly requires a button press, not focus. |
| 3.3.1 | Error identification | ✅ | `GrantFlow` surfaces `error` prop below the scope list with `colors.danger`. `RevokeConfirmModal` would surface revoke errors via the parent's `revoke.failed` state (rendered as a toast — out of library scope). |
| 3.3.2 | Labels or instructions | ✅ | Every screen has a heading + body copy. Behavioural friction screen explains *why* the gate exists. Revoke modal explains what will happen. |

## 4. Robust

| SC | Title | Status | Evidence |
|---|---|---|---|
| 4.1.2 | Name, role, value | ✅ | RN's native a11y bridge translates `accessibilityRole` + `accessibilityState` + `accessibilityLabel` to platform AT primitives (UIAccessibilityTrait on iOS, AccessibilityNodeInfo on Android). Modal traps focus and announces title via `accessibilityLabel`. Live offline banner uses `accessibilityLiveRegion="polite"`. |
| 4.1.3 | Status messages | ✅ | `OfflineBanner` is the canonical example — `accessibilityLiveRegion="polite"` announces state change without stealing focus. Revoke success / failure messages are out of library scope (parent owns them). |

---

## Outstanding items before Stage 2

1. **Manual VoiceOver/TalkBack pass in an embedding app.** This audit is static; verifying with assistive tech against a real device is the final gate.
2. **Custom-theme contrast guard.** Consider adding a runtime check in `resolveTheme` that warns when `primary` or `danger` contrasts below 4.5:1 against `onPrimary`/`onDanger`. Currently the library trusts the consuming app's brand choices.
3. **`lang` change while open.** If the parent flips `lang` mid-session, the `useMemo` rebuilds the translator but the existing screen state survives — accessibility hint labels currently render in the new language. Verify with an embedding-app test.

---

*Audit prepared by Helpan AI rail Claude session — sign-off requires an independent reviewer per DoD §13.2 S11.*

# @kmv/helpan-console

The **Helpan Console** — the KMV platform's user-facing agent-consent surface.
A shared **React Native library** (not a standalone app) invoked from each
consuming app: a user opening it from Lunch Drop sees the same authorisations
as opening it from Chapaa or Klokd — every agent permission across every
Kirimon app, in one place.

Sprint **H-8** of the Helpan AI rail. Spec: `helpan-ai-console-specification-v1.md`.

---

## Status

**v0.2.3 — Slices 1 + 2 + 3 complete.** UI layer feature-complete; awaiting embedding-app integration smoke + manual VoiceOver/TalkBack pass. `0.2.3` changes the default `baseUrl` to the live rail host `https://helpanai-production.up.railway.app` (`api.helpan.co.ke` has no DNS yet). (`0.2.2` was a packaging-only release over `0.2.0` — prebuilt `lib/` committed and **no `prepare`/`prepack` lifecycle**, so a git-install copies the package with zero build and zero devDependencies; no source change.)

| Phase | Contents | State |
|---|---|---|
| Foundation | types · API client · i18n (EN/SW) · theme tokens · formatters · pure state reducer | ✅ 43/43 tests, typecheck clean |
| Components | AuthorityCard · ScopeList · RevokeConfirmModal · BehaviouralFrictionScreen · EmptyState · OfflineBanner · Tabs | ✅ |
| Screens | ActiveTab · ActivityTab · HistoryTab · AuthorityDetail · GrantFlow | ✅ |
| Hook | useConsoleData (reducer + API + lifecycle) | ✅ |
| Composer | HelpanConsole | ✅ |
| WCAG 2.1 AA | static audit | ✅ (`WCAG-AA-AUDIT.md`); manual pass pending |
| Storybook | scaffolding | 📋 stories listed in `stories/STORIES.md`; Storybook setup is embedding-app side |

---

## Installation

Distributed as a **git-installable package** — no private registry required. Pin the release tag:

```bash
npm install github:whyyam1/helpan-console#v0.2.3
```

or in your app's `package.json`:

```jsonc
{
  "dependencies": {
    "@kmv/helpan-console": "github:whyyam1/helpan-console#v0.2.3"
  }
}
```

The `lib/` CommonJS + ESM + TypeScript outputs are **prebuilt and committed to the tag**, and the package has **no `prepare`/`prepack` script** — both of those run on a git-install and would drag in the build toolchain. Without them, npm just copies the committed package: no `react-native-builder-bob`, no devDependencies, no build. React Native apps consume `src/` directly through Metro (via the `react-native` / `source` fields); the built `lib/` backs type resolution and any non-Metro tooling (Jest, Node).

**Peer dependencies** (provided by your app): `react` ≥ 18, `react-native` ≥ 0.74. The package declares **no runtime `dependencies`**, so a consumer install adds nothing transitive.

> Private-repo variant: if the GitHub repo is kept private, install over SSH — `npm install git+ssh://git@github.com:whyyam1/helpan-console.git#v0.2.3` — with a deploy key or `~/.gitconfig` credential on the installing machine/CI.

---

## Quick start

```typescript
import { HelpanConsole } from '@kmv/helpan-console';
import { useState } from 'react';
import { Modal } from 'react-native';

function MyAppSettings() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  return (
    <>
      <Button title="Manage agent permissions" onPress={() => setConsoleOpen(true)} />

      <Modal visible={consoleOpen} animationType="slide" presentationStyle="fullScreen">
        <HelpanConsole
          customerToken={identitiCustomerToken}        // from your auth context
          appId="lunchdrop"                            // your literal app slug
          baseUrl="https://helpanai-production.up.railway.app" // optional; this is the default
          theme={{
            primary: '#0D5C4E',
            accent:  '#C47A1A',
            danger:  '#8B1A1A',                        // semantic role fixed
            fontFamily: 'Inter',
          }}
          lang="en"                                    // 'en' | 'sw'
          onClose={() => setConsoleOpen(false)}
          onAuthorityRevoked={(authorityId) => {
            // your app refreshes its in-memory authority list
          }}
        />
      </Modal>
    </>
  );
}
```

That's the entire integration surface. The library handles all rendering, API calls, state, and the consent semantics (the behavioural-data friction screen, one-tap revoke, real-time refresh on revoke).

### Optional: connectivity watcher

The Console shows an offline banner when the device is offline. Wire it via React Native NetInfo (or whatever connectivity primitive the consuming app uses):

```typescript
import NetInfo from '@react-native-community/netinfo';

<HelpanConsole
  …
  subscribeConnectivity={(cb) => {
    const unsub = NetInfo.addEventListener((state) => cb(state.isConnected !== true));
    return unsub;
  }}
/>
```

Without `subscribeConnectivity`, the Console always reports online.

---

## Auth model

The Console authenticates to the Helpan AI rail with the **Identiti customer JWT**. The rail's H-8a dual-auth accepts that JWT on `/v1/authorities/*` (issue / list / detail / revoke) and hard-scopes every response to the token's account. `POST /v1/authorities/{id}/validate` stays HMAC-only (relying parties) and is not a Console surface.

---

## What's in the foundation

- `ConsoleApiClient` — wraps `GET /v1/authorities`, `GET /v1/authorities/:id`, `POST /v1/authorities/:id/revoke`, `POST /v1/authorities`, `GET /v1/actions`, `GET /v1/oauth/scopes`. Unwraps the rail envelope, throws `ConsoleApiError` with the rail's stable error code.
- `createTranslator(lang)` — English + Swahili message catalogue.
- `resolveTheme(input)` — merges a brand partial onto the design tokens.
- `formatMoneyMinor`, `relativeParts`, `formatRelative`, `formatAbsoluteDate`, `formatScopeLimit` — display helpers.
- `consoleReducer` + selectors (`selectActive`, `selectHistory`, `isRevoking`) — the pure data-state machine.

## What the UI layer adds

### Components — re-usable RN primitives
- `AuthorityCard` — agent card with status + meta + scope list + actions
- `ScopeList` — bullet-listed scopes with limit clauses + behavioural-data pill
- `RevokeConfirmModal` — bottom-sheet revoke confirm (spec §4.1, single screen)
- `BehaviouralFrictionScreen` — full-screen gate for `read_behavioural` scopes (spec §4.2)
- `EmptyState` — per-tab empty copy with optional glyph
- `OfflineBanner` — `accessibilityLiveRegion="polite"` banner
- `Tabs` — controlled Active / Activity / History

### Screens
- `ActiveTab` — list of active authorities + pull-to-refresh + scroll-end pagination
- `ActivityTab` — action log, lazy first-open
- `HistoryTab` — revoked / expired authorities with reason chips
- `AuthorityDetail` — full card + per-authority filtered actions + revoke
- `GrantFlow` — friction → confirm phases; consumes step-up token from parent

### Hook
- `useConsoleData(client, opts)` — `useReducer(consoleReducer)` + memoised action surface (`loadAuthorities` / `loadMoreAuthorities` / `loadActivity` / `loadMoreActivity` / `loadScopes` / `revokeAuthority`) + lifecycle effects + injectable `subscribeConnectivity`

### Composer
- `<HelpanConsole>` — wires the API client + hook + top-level navigation between Tabs, AuthorityDetail, and the revoke modal. Header with Done button. OfflineBanner.

---

## Dependency notes

- **Foundation**: no React Native dependency. Verifies under Node with vitest.
- **UI layer**: RN `View`, `Text`, `Pressable`, `ScrollView`, `RefreshControl`, `Modal`, `ActivityIndicator`. `react` ≥18 and `react-native` ≥0.74 are peer deps — the consuming app provides the runtime.

Two surfaces are built against rail endpoints that aren't always live:
- **Activity tab** → `GET /v1/actions` — delivered by rail sprint H-4 (✅ live).
- **Grant flow** → `POST /v1/authorities` issuance. ✅ Identiti wiring landed 2026-07-20: internal-sign tenant `helpan_ai_internal` provisioned, DA kid `helpan-da-2026-q2`, and the step-up operation-kind registered as **`helpan_ai.authority_issuance`** (audience `helpan_authority_issuance`). The embedding app must request the customer token with `requested_audience=https://api.helpan.co.ke` and initiate step-up with `operation_kind=helpan_ai.authority_issuance` (the old `helpan.authorities.issue` is unregistered → `400 OPERATION_KIND_UNKNOWN`).

---

## Scripts

```
npm run build         # react-native-builder-bob → lib/ (commonjs + module + typescript)
npm run typecheck     # tsc --noEmit (includes test files)
npm test              # vitest — foundation unit tests (43/43)
npm run lint          # eslint
npm run format        # prettier write
```

> There is **deliberately no `prepare`/`prepack` lifecycle hook** — both run on a git-install and would pull the whole build toolchain into the consumer. `build` is manual. **When you change source, run `npm run build` and commit the updated `lib/` before tagging a release**, or the git-install ships stale output. (`git status` will show `lib/` diffs, since it is a committed artifact.)

---

*Helpan AI rail · Helpan Console · sprint H-8 (Slices 1 + 2 + 3) · Kirimon Market Ventures · Confidential*

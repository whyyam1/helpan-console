# Storybook stories — Helpan Console

This file documents the visual states each component must render correctly. When an embedding app initialises Storybook for React Native (e.g. via `@storybook/react-native@^7`), every entry below becomes a story file under `stories/`. Each `*.stories.tsx` shadows the component name (`AuthorityCard.stories.tsx` etc.).

The library does **not** bundle Storybook itself — Storybook for React Native needs Metro bundler + an Expo app shell, which is a deployment-time decision the embedding app owns. This file is the authoritative list of states the WCAG audit + design QA gate against.

---

## Components

### `AuthorityCard.stories.tsx`

| Story | Props highlights |
|---|---|
| `Active` | `status=active`, two scopes, valid expiry, last-used yesterday |
| `ActiveWithBehavioural` | one scope is `chapaa.read.behavioural` → renders the amber pill |
| `Expired` | `status=expired` — hideActions visible; status pill grey |
| `Revoked` | `status=revoked`, `revocation_reason='user_initiated'` |
| `NoLastUsed` | `lastUsedAt=null` → renders "never" |
| `FarFutureExpiry` | expires_at in 6 months → renders absolute date instead of relative |
| `WithoutActions` | `hideActions={true}` → no Revoke/View activity buttons |

### `ScopeList.stories.tsx`

| Story | Props highlights |
|---|---|
| `MoneyScopes` | three scopes with amount_limit_minor + period |
| `ReadOnly` | one read scope with no limit clause |
| `Behavioural` | `chapaa.read.behavioural` → amber pill |
| `WithoutCatalogue` | catalogue map omitted → falls back to raw scope_id |

### `RevokeConfirmModal.stories.tsx`

| Story | Props highlights |
|---|---|
| `Idle` | `visible=true`, `isRevoking=false` |
| `InFlight` | `visible=true`, `isRevoking=true` → spinner on confirm button |
| `Hidden` | `visible=false` → renders nothing (regression guard) |

### `BehaviouralFrictionScreen.stories.tsx`

| Story | Props highlights |
|---|---|
| `Default` | English |
| `Swahili` | translator for `lang='sw'` |

### `EmptyState.stories.tsx`

| Story | Props highlights |
|---|---|
| `ActiveEmpty` | "haven't given any agents permission yet" |
| `ActivityEmpty` | "agents acting on your behalf will show up here" |
| `HistoryEmpty` | "revoked or expired permissions will be listed here" |
| `WithoutGlyph` | `glyph` omitted → no ring |

### `OfflineBanner.stories.tsx`

| Story | Props highlights |
|---|---|
| `Visible` | `visible=true` |
| `Hidden` | `visible=false` → renders null |

### `Tabs.stories.tsx`

| Story | Props highlights |
|---|---|
| `ActiveSelected` | `value='active'`, active has badge=3 |
| `ActivitySelected` | `value='activity'`, no badges |
| `WithBadge` | `value='active'`, badge=99 → multi-digit |
| `Swahili` | tab labels in Swahili |

---

## Screens

### `ActiveTab.stories.tsx`

| Story | Props highlights |
|---|---|
| `Loaded` | 3 active authorities |
| `Empty` | empty list → EmptyState |
| `Refreshing` | refreshing=true → RefreshControl spinner |
| `LoadMoreAvailable` | hasMore=true → scroll-end fires onLoadMore |

### `ActivityTab.stories.tsx`

| Story | Props highlights |
|---|---|
| `IdleFirstOpen` | status=idle → onFirstOpen fires once on mount |
| `Loaded` | 5 actions: completed + failed (with error_code) + pending |
| `Empty` | status=ready, actions=[] → EmptyState |

### `HistoryTab.stories.tsx`

| Story | Props highlights |
|---|---|
| `ExpiredOnly` | one expired, no revocation_reason → "Expired" |
| `MixedReasons` | user_initiated / operator_initiated / account_suspended / kyc_downgraded |

### `AuthorityDetail.stories.tsx`

| Story | Props highlights |
|---|---|
| `ActiveWithActions` | 10 filtered actions |
| `ActiveNoActions` | filtered list empty → "Agents acting on your behalf will show up here." |
| `RevokedAuthority` | status=revoked → hideActions on the card |
| `IsRevoking` | the parent's RevokeConfirmModal would be visible; this story just renders the screen |

### `GrantFlow.stories.tsx`

| Story | Props highlights |
|---|---|
| `NoFriction` | no behavioural scopes → starts in confirm phase |
| `FrictionThenConfirm` | one behavioural scope → starts in friction phase; tap Continue → confirm |
| `Submitting` | submitting=true → ActivityIndicator on Confirm |
| `WithError` | error="ISSUANCE_FAILED — step-up expired" |
| `Swahili` | Swahili copy |

---

## Top-level composer

### `HelpanConsole.stories.tsx`

| Story | Props highlights |
|---|---|
| `Default` | Mocked `ConsoleApiClient` returns 3 active + 5 actions + scope catalogue |
| `OfflineMode` | `subscribeConnectivity` returns offline=true immediately → OfflineBanner |
| `EmptyState` | API returns empty lists → empty copy on each tab |
| `WithBrandedTheme` | theme={ primary: '#1a3c5c', accent: '#c47a1a' } — Klokd brand colours |
| `Swahili` | lang='sw' throughout |

---

## Setup pattern (for the embedding app to copy)

```typescript
// stories/AuthorityCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { AuthorityCard, defaultTheme, createTranslator } from '@kmv/helpan-console';

const meta: Meta<typeof AuthorityCard> = {
  title: 'Components/AuthorityCard',
  component: AuthorityCard,
  args: {
    theme: defaultTheme,
    t: createTranslator('en'),
    lang: 'en',
  },
};

export default meta;
type Story = StoryObj<typeof AuthorityCard>;

export const Active: Story = {
  args: {
    authority: {
      id: 'daa_01ACTIVEEXAMPLE0000000000',
      account_uuid: 'acc_00000000-0000-0000-0000-000000000001',
      agent_id: 'helpan-klokd-v1',
      scopes: [
        { scope_id: 'klokd.write.shift_pay', amount_limit_minor: 200000, per_period_limit_minor: 5000000, period: 'monthly' },
      ],
      status: 'active',
      expires_at: new Date(Date.now() + 5 * 24 * 3600_000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
    },
    onRevoke: () => console.log('revoke'),
    onViewActivity: () => console.log('view activity'),
  },
};
```

---

*Story plan v1 · 22 May 2026. Update as components or states change.*

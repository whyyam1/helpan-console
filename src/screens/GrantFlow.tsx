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

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type {
  AuthorityScope,
  IssueAuthorityRequest,
  OauthScope,
} from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import { BehaviouralFrictionScreen } from '../components/BehaviouralFrictionScreen.js';
import { ScopeList } from '../components/ScopeList.js';
import { isBehaviouralScopeId } from '../format/scopes.js';

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

type Phase = 'friction' | 'confirm';

export function GrantFlow(props: GrantFlowProps): React.JSX.Element {
  const {
    theme,
    t,
    accountUuid,
    agentId,
    agentDisplayName,
    proposedScopes,
    ttlSeconds,
    catalogue,
    stepUpToken,
    submitting,
    error,
    onConfirm,
    onCancel,
  } = props;
  const styles = makeStyles(theme);

  const hasBehavioural = useMemo(
    () =>
      proposedScopes.some((s) => isBehaviouralScopeId(s.scope_id, catalogue)),
    [proposedScopes, catalogue]
  );

  const [phase, setPhase] = useState<Phase>(
    hasBehavioural ? 'friction' : 'confirm'
  );

  if (phase === 'friction') {
    return (
      <BehaviouralFrictionScreen
        theme={theme}
        t={t}
        onContinue={() => setPhase('confirm')}
        onCancel={onCancel}
      />
    );
  }

  const submit = (): void => {
    const req: IssueAuthorityRequest = {
      account_uuid: accountUuid,
      agent_id: agentId,
      scopes: proposedScopes.map((s) => ({ ...s })),
      ttl_seconds: ttlSeconds,
      ...(stepUpToken ? { step_up_token: stepUpToken } : {}),
    };
    onConfirm(req);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('grant.title')}</Text>
        <Text style={styles.agent}>{agentDisplayName}</Text>
        <ScopeList
          theme={theme}
          t={t}
          scopes={proposedScopes}
          {...(catalogue ? { catalogue } : {})}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={onCancel}
          disabled={submitting}
          style={({ pressed }) => [
            styles.btn,
            styles.btnCancel,
            pressed && styles.btnPressed,
            submitting && styles.btnDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
        >
          <Text style={styles.btnCancelText}>{t('common.cancel')}</Text>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={submitting}
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            pressed && styles.btnPressed,
            submitting && styles.btnDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('grant.confirm')}
        >
          {submitting ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.btnPrimaryText}>{t('grant.confirm')}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.surface },
    scroll: { padding: theme.spacing.lg },
    title: {
      fontSize: theme.typography.heading,
      fontWeight: '700' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    agent: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      fontFamily: theme.typography.fontFamily,
    },
    error: {
      marginTop: theme.spacing.md,
      color: theme.colors.danger,
      fontSize: theme.typography.body,
      fontFamily: theme.typography.fontFamily,
    },
    footer: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    btn: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    btnPressed: { opacity: 0.85 },
    btnDisabled: { opacity: 0.6 },
    btnCancel: { backgroundColor: theme.colors.background },
    btnPrimary: { backgroundColor: theme.colors.primary },
    btnCancelText: {
      fontSize: theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    btnPrimaryText: {
      fontSize: theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.onPrimary,
      fontFamily: theme.typography.fontFamily,
    },
  });
}

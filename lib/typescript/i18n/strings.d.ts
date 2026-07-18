/**
 * Helpan Console message catalogue — English + Swahili (spec §7: "English +
 * Swahili at v1.0"). `en` is the key authority; every `sw` entry mirrors an
 * `en` key. `{param}` placeholders are interpolated by the translator.
 */
export type Lang = 'en' | 'sw';
export declare const EN: {
    readonly 'tab.active': "Active";
    readonly 'tab.activity': "Activity";
    readonly 'tab.history': "History";
    readonly 'card.grantedOn': "Granted";
    readonly 'card.expires': "Expires";
    readonly 'card.lastUsed': "Last used";
    readonly 'card.never': "never";
    readonly 'card.expired': "expired";
    readonly 'action.revoke': "Revoke";
    readonly 'action.viewActivity': "View activity";
    readonly 'common.cancel': "Cancel";
    readonly 'common.retry': "Retry";
    readonly 'common.done': "Done";
    readonly 'scope.limit': "Up to {amount} {period}";
    readonly 'scope.pill.behavioural': "Behavioural data";
    readonly 'period.single_use': "per use";
    readonly 'period.daily': "per day";
    readonly 'period.weekly': "per week";
    readonly 'period.monthly': "per month";
    readonly 'revoke.title': "Revoke this permission?";
    readonly 'revoke.body': "This agent will no longer be able to take actions on your behalf within these scopes.";
    readonly 'revoke.inflight': "Actions already in flight will continue; new actions will be blocked.";
    readonly 'revoke.confirm': "Confirm Revoke";
    readonly 'revoke.failed': "Couldn't revoke — check your connection and try again.";
    readonly 'friction.title': "This is a behavioural data permission";
    readonly 'friction.body': "This permission lets the agent see behavioural detail — when you save, how often, and how much. This is your most sensitive data.";
    readonly 'friction.continue': "Continue";
    readonly 'grant.title': "Grant permission";
    readonly 'grant.confirm': "Confirm";
    readonly 'grant.stepUpRequired': "Confirm it is you to grant this permission.";
    readonly 'empty.active': "You haven't given any agents permission yet. When you do, they'll appear here.";
    readonly 'empty.activity': "Agents acting on your behalf will show up here.";
    readonly 'empty.history': "Revoked or expired permissions will be listed here.";
    readonly 'offline.banner': "Showing your last-cached state. Some actions are unavailable offline.";
    readonly 'status.pending': "Pending";
    readonly 'status.completed': "Completed";
    readonly 'status.failed': "Failed";
    readonly 'history.endedOn': "Ended";
    readonly 'reason.user_initiated': "You revoked this";
    readonly 'reason.operator_initiated': "Revoked by Kirimon support";
    readonly 'reason.account_suspended': "Revoked because your account was suspended";
    readonly 'reason.kyc_downgraded': "Revoked after a change to your verification level";
    readonly 'reason.security_incident': "Revoked during a security review";
    readonly 'reason.expired': "Expired";
    readonly 'reason.other': "Ended";
    readonly 'error.generic': "Something went wrong. Pull to retry.";
    readonly 'header.title': "Agent permissions";
    readonly 'time.now': "just now";
    readonly 'time.past.minute': "{n} minute ago";
    readonly 'time.past.minutes': "{n} minutes ago";
    readonly 'time.past.hour': "{n} hour ago";
    readonly 'time.past.hours': "{n} hours ago";
    readonly 'time.past.day': "{n} day ago";
    readonly 'time.past.days': "{n} days ago";
    readonly 'time.future.minute': "in {n} minute";
    readonly 'time.future.minutes': "in {n} minutes";
    readonly 'time.future.hour': "in {n} hour";
    readonly 'time.future.hours': "in {n} hours";
    readonly 'time.future.day': "in {n} day";
    readonly 'time.future.days': "in {n} days";
};
export type MessageKey = keyof typeof EN;
export declare const SW: Record<MessageKey, string>;
export declare const STRINGS: Record<Lang, Record<MessageKey, string>>;
//# sourceMappingURL=strings.d.ts.map
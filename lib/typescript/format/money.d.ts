/**
 * KES money formatting. The rail speaks KES **minor units** (fils, 1/100 of
 * a shilling) as integers — never floats (Reboot Pack §9.2). The Console
 * renders them for humans: `formatMoneyMinor(250000)` → `"KES 2,500"`.
 */
/**
 * Format KES minor units as a display string. Whole amounts drop the
 * decimals (`"KES 2,500"`); fractional amounts keep two (`"KES 2,500.50"`).
 */
export declare function formatMoneyMinor(minor: number): string;
//# sourceMappingURL=money.d.ts.map
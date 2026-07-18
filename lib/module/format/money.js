"use strict";

/**
 * KES money formatting. The rail speaks KES **minor units** (fils, 1/100 of
 * a shilling) as integers — never floats (Reboot Pack §9.2). The Console
 * renders them for humans: `formatMoneyMinor(250000)` → `"KES 2,500"`.
 */

/** Group an integer's digits with thousands separators: 50000 → "50,000". */
function groupThousands(intPart) {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format KES minor units as a display string. Whole amounts drop the
 * decimals (`"KES 2,500"`); fractional amounts keep two (`"KES 2,500.50"`).
 */
export function formatMoneyMinor(minor) {
  const negative = minor < 0;
  const abs = Math.abs(Math.trunc(minor));
  const major = Math.floor(abs / 100);
  const fils = abs % 100;
  const grouped = groupThousands(String(major));
  const body = fils === 0 ? grouped : `${grouped}.${String(fils).padStart(2, '0')}`;
  return `${negative ? '-' : ''}KES ${body}`;
}
//# sourceMappingURL=money.js.map
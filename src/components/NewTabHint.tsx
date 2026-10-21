/**
 * Warns assistive-technology users that a link opens a new tab (RGAA 13.2).
 *
 * Rendered inside the link and visually hidden: sighted users already read the
 * ↗ icon, while screen-reader users get the warning in their own language.
 * The leading space keeps the announcement natural: "LinkedIn (opens in new
 * tab)" rather than "LinkedIn(opens in new tab)".
 */
export function NewTabHint({ label }: { label: string }) {
  return <span className="visually-hidden"> ({label})</span>
}

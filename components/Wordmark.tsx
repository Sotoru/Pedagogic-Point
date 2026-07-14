// Brand wordmark: Great Vibes for each capital "P", Montez for the rest
// (design.md). The string is fixed, so the alternation is hardcoded.
// Size comes from `className` (e.g. "wordmark-lg", "wordmark-sm md:wordmark-lg").
const GV = { fontFamily: "var(--font-great-vibes), cursive" } as const;
const MZ = { fontFamily: "var(--font-montez), cursive" } as const;

export function Wordmark({ className = "wordmark-lg" }: { className?: string }) {
  return (
    <span className={`select-none whitespace-nowrap text-primary ${className}`}>
      <span style={GV}>P</span>
      <span style={MZ}>edagogic</span>
      <span style={GV}>P</span>
      <span style={MZ}>oint</span>
    </span>
  );
}

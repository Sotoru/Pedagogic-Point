import { ClockIcon } from "./icons";

// Meta / reading time: 13px clock icon + small muted text (design.md).
export function ReadingTime({ minutes, suffix = "min" }: { minutes: number; suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] leading-none text-muted">
      <ClockIcon />
      {minutes} {suffix}
    </span>
  );
}

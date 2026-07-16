import { ClockIcon } from "./icons";
import { css } from "@/styled-system/css";

// Meta / reading time: 13px clock icon + small muted text (design.md).
export function ReadingTime({ minutes, suffix = "min" }: { minutes: number; suffix?: string }) {
  return (
    <span
      className={css({
        display: "inline-flex",
        alignItems: "center",
        gap: "1.5",
        fontSize: "13px",
        lineHeight: "1",
        color: "muted",
      })}
    >
      <ClockIcon />
      {minutes} {suffix}
    </span>
  );
}

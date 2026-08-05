import preview from "../.storybook/preview";
import { ReadingTime } from "@/components/ReadingTime";

const meta = preview.meta({
  title: "Components/ReadingTime",
  component: ReadingTime,
});

// The card's form.
export const Breve = meta.story({
  args: { minutes: 3 },
});

// The hero's form, which spells the suffix out.
export const Lunga = meta.story({
  args: { minutes: 5, suffix: "min di lettura" },
});

// letturaTime() floors, so a very short article legitimately reads "0 min".
export const Zero = meta.story({
  args: { minutes: 0 },
});

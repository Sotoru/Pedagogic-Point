# A dedicated categorical red (`rights`), separate from the error red

The home-page mockup tags the "tutela diritti umani" category in red, but
`design.md` reserved red exclusively for the `error` feedback token and capped
categorical accents at four (`secondary`, `pedagogy`, `theory`, `practice`).
Rather than reuse `error` as decoration (which would make a category
indistinguishable from a validation failure and break the design system's own
rule), we added a fifth categorical token `rights: #e03131` — a brighter,
distinct red — and kept `error: #ba1a1a` for feedback only. Categories map onto
these five accent tokens; `error` is never a category color.

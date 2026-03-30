## ADDED Requirements

### Requirement: Editor shell adapts to viewport width
The `EditorShell` main content column SHALL use responsive max-width breakpoints so the writing area expands on wider screens without producing excessively long lines on ultrawide displays.

The column SHALL use the following max-width steps:
- Default (< md): `max-w-2xl` (42 rem)
- md (≥ 768 px): `max-w-3xl` (48 rem)
- lg (≥ 1024 px): `max-w-4xl` (56 rem)
- xl (≥ 1280 px): `max-w-5xl` (64 rem)

Horizontal padding SHALL scale with viewport: `px-4` on mobile, `px-6` on sm, `px-10` on lg+.

#### Scenario: Wide monitor expands column
- **WHEN** the viewport width is ≥ 1280 px
- **THEN** the main editing column SHALL have a max-width of 64 rem (`max-w-5xl`)

#### Scenario: Mobile keeps narrow column
- **WHEN** the viewport width is < 768 px
- **THEN** the main editing column SHALL have a max-width of 42 rem (`max-w-2xl`)

#### Scenario: Horizontal padding scales with breakpoint
- **WHEN** the viewport width is ≥ 1024 px
- **THEN** the horizontal padding of the content column SHALL be `2.5 rem` (px-10)

## Teach Landing Page - Design Specification

### Color Palette
- `#FFFCF6` Ivory (surface background)
- `#F6B11C` Orange (primary accent & CTA)
- `#E18A00` Dark orange (CTA hover)
- `#CDEEC4` Mint (secondary accent)
- `#FEDCB3` Peach (tinted CTA block)
- `#FEEBCB` Sand (feature blocks)
- `#F6F6F8` Cloud (neutral panels)
- `#1C1A1E` Charcoal (headlines)
- `#2E2A33` Graphite (body strong)
- `#5C5862` Stone (paragraph text)
- `#8E8996` Muted (metadata)
- `#E5E1E9` Line (dividers)

### Typography
- Display font: **Poppins** 600 weight
  - Hero: 64px / 1.04 line-height
  - Section headings: 48px / 1.1
  - Card titles: 24-28px / 1.25
- Body font: **Inter** 400-500 weight
  - Body copy: 16px (1.6 line-height)
  - Hero paragraph: 18px
  - Eyebrow labels: 12px uppercase, 0.2em tracking

### Layout & Grid
- Max content width: 1200px container centered with 24px gutter (Tailwind `container`)
- Hero uses 2-column layout (text + 520px media block)
- Section spacing: 64-96px vertical rhythm
- Cards use 32px inner padding, `rounded-[2.5rem]` radii, large drop shadows
- CTA & pill elements rely on `rounded-pill` token for consistent curvature

### UI Components
- **Navbar**: sticky, logo lockup left, nav links center, CTA button right
- **Hero**: headline stack, primary CTA, stats row, organic image with overlay cards plus decorative star/scribble
- **Feature cards**: tinted backgrounds with square images, large radius, short descriptive text
- **Slider cards**: horizontal cards with avatars, metadata, and "Join class" link
- **About collage**: 2 x 2 grid of rounded photos plus bullet list
- **Value cards**: icon plus copy on mint/sand backgrounds
- **Newsletter CTA**: large peach blob with inline email form and circular send button
- **Footer**: brand column plus enumerated nav list lines

### Assets & Iconography
- Stock imagery served via Unsplash URLs (replace with licensed local assets for production)
- Avatars should be rounded rectangles (16px radius) to mirror mockup
- Decorative icons (arrow, scribbles) can be inline SVG or replaced with simple vector placeholders

### Behavior
- Buttons: subtle shadow and color shift on hover
- Links/pills: underline or color change on hover
- Forms: inline email input with submit icon; validation can be added when wiring backend

### Fidelity Tips
1. Export photographic assets at least 1.5x display size for crisp rendering with `next/image`.
2. Use Tailwind custom tokens (`rounded-blob`, `shadow-display`) across sections to maintain consistent visuals.
3. Inspect spacing via browser dev tools and tweak `gap` utilities to keep the 12-column rhythm.
4. If adding animation, respect `prefers-reduced-motion` and keep easing subtle to match the premium feel.
5. Keep typography sharp by loading Poppins/Inter with the weights defined above; avoid fallback fonts for hero headings.


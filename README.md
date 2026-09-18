# Cyber Portfolio

An interactive cybersecurity portfolio built as one continuous system —
a physically-draggable hanging profile card that hands off into a
scroll-driven Linux-terminal-styled document, backed by a persistent,
performance-adaptive 3D backdrop.

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · GSAP +
ScrollTrigger · Framer Motion · React Three Fiber + drei · Lucide icons.

New to this codebase? **`PROJECT_GUIDE.md`** is the plain-language,
step-by-step version of everything below — start there if you just
want to edit content. This file is the deeper architecture reference.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build locally
```

Requires Node 18.18+ (Next.js 14's minimum). Already installed and
build-verified in this environment — `npm run build` compiles clean,
type-checks clean, and statically prerenders the page.

## Make it yours

Every piece of real content lives under `data/` as plain typed
objects — nothing is hardcoded into components. Edit these and the
whole site updates:

| File | Controls |
|---|---|
| `data/profile.ts` | Hero card, `whoami` boot line, About paragraphs, profile photo + CV paths |
| `data/education.ts` | Education section (array — add a second entry freely) |
| `data/experience.ts` | Experience section (array — `current: true` shows a "current" badge) |
| `data/certifications.ts` | Certifications list (`status: "completed" \| "exploring"`) |
| `data/projects.ts` | Projects grid (`featured: true` spans two columns) |
| `data/skills.ts` | Skills, grouped by domain |
| `data/social.ts` | Contact links |

A few fields were deliberately left as placeholders rather than
guessed:

- **Contact email / LinkedIn** (`data/social.ts`) — recognizable
  placeholder values; swap them for the real ones.
- **VulnBrief / PhishGuard** (`data/projects.ts`) — only the project
  names were on hand, so their descriptions say so explicitly instead
  of inventing feature lists. Fill them in and they render like any
  other project.
- **Profile photo / certificate & project screenshots** — every image
  field is optional (see `public/README.md`). The hanging card's photo
  area is the card's main visual content now (a 4:5 frame under the
  `root@handle` line); until `profile.photoUrl` is set it shows a
  monogram and a reminder of the expected path instead of looking broken.
- **CV PDF** (`data/profile.ts` → `cvUrl`, default `/Muhammad-Hussain-CV.pdf`)
  — the small "apt install" terminal between About and Education
  (`components/terminal/CvTerminal.tsx`) checks the file actually
  resolves (a `HEAD` request) before claiming success; until a real PDF
  is dropped at that path it shows an honest "package not found"
  result instead of a broken download.

One editorial choice worth knowing about: an in-progress, unresolved
vulnerability disclosure (a broken-access-control finding on a
government site, still awaiting remediation) was intentionally left
out of the Projects data. Once it's been responsibly disclosed and
fixed, it's a legitimate portfolio piece — described generically
(scope, methodology, impact), without naming the target or any
exploit path.

## Design system

The brief asked for a terminal-inspired dark palette — the deliberate
choice here is a **desaturated "phosphor" green**, not neon-on-black:
a near-black with a faint green undertone (`--c-void`) rather than
flat `#000`/`#111`, a muted signal green (`--c-signal: #5fd98a`, not
`#00ff00`) as the primary accent, and cyan used narrowly as a
secondary voice, not a co-equal color. All tokens live in
`app/globals.css` (`:root`) and are wired into Tailwind via
`tailwind.config.ts`.

Layout follows one rule per content type instead of one card template
repeated six times: Certifications render as a scannable manifest/log
list, Projects as an uneven bento grid (two projects are genuinely
more substantial and are sized accordingly), Skills as grouped chip
clusters. The `ls` / `cat` / `grep`-style command labels are grounded
in the actual subject matter — each one is a command a security
engineer would plausibly run for that section, not decorative chrome.

Fonts are self-hosted via `@fontsource` (Inter + JetBrains Mono),
imported at the top of `app/globals.css`, rather than
`next/font/google` — this avoids any build- or run-time network
dependency on Google's font CDN. If you'd rather use
`next/font/google` (equally valid — Next.js self-hosts the files at
build time either way, given network access), swap the `@import`s in
`globals.css` for the usual `next/font/google` setup in
`app/layout.tsx`.

## Architecture notes

### Animation ownership

Two systems move things on screen, and they never touch the same
property on the same element:

- **`hooks/useCardPhysics.ts`** owns the hanging card's own transform
  (drag position, release momentum, overshoot, settling, and a
  continuous idle sway when nobody's touching it) — always, for the
  card's entire lifetime. It's driven entirely by refs and
  `requestAnimationFrame`; it never calls a React state setter inside
  its per-frame loop. The idle sway (`computeIdleSway` in
  `lib/physics.ts`) sums three non-harmonic sine waves into one
  "wind" angle that drives horizontal sway, a much smaller vertical
  lift, and rotation together — like an actual hanging object, not
  three unrelated animations layered on top of each other. Grabbing
  the card mid-sway folds whatever offset is currently showing into
  the persistent position first, so there's no snap back to a stale
  baseline the instant you grab it.
- **GSAP ScrollTrigger** owns scroll-linked timelines: the hero card's
  "recede" effect as you scroll past it (opacity/scale/translateY on
  an *outer wrapper* around the card — a different element from the
  one the physics hook writes to), each section's entrance, and the
  boot-sequence type-on reveal.

Because the physics hook and GSAP are wired to two different DOM
nodes (an inner element vs. its outer wrapper) rather than coordinated
through a shared flag, there's no property left to race over — see
`components/hero/Hero.tsx` for exactly how the two are nested.

The one exception is `CardString` (`components/hero/CardString.tsx`),
which draws the string between the anchor letter and the card. It
never writes a transform at all — it only *reads* both elements' real
`getBoundingClientRect()` every frame — so it stays correct no matter
which system is currently moving the card. The anchor is the "O" at
index 5 of PORTFOLIO (`components/hero/Hero.tsx` splits the wordmark
into per-letter spans and refs just that one — screen readers still
hear "PORTFOLIO" as a word via `aria-label`, not letter-by-letter) —
the closest occurrence to the wordmark's true horizontal center in the
monospace font, so the card rests visually centered beneath it. Point
the ref at a different index (there's also an "O" at 1 and 8) for a
different hang point.

The curve itself also carries a small tension cue: near the card's
resting distance it sags like slack cable (a vertical tangent at both
ends); dragged farther out, the control points blend toward the
direct anchor-to-card line and the stroke thins slightly, reading as a
string pulled taut rather than an infinitely stretchy line. The
"resting distance" baseline is measured on first paint and recaptured
on window resize — never hard-coded — so this holds up across screen
sizes.

The card's own rotation is two independent, deliberately
different-sized effects on two different axes: the existing Z-axis
spin (unchanged), and a new, much smaller Y-axis tilt
(`tiltYFromVelocity` in `lib/physics.ts`, capped at 7°) driven by
horizontal velocity during drag/release, plus a fraction of a degree
of the same tilt from idle sway. `perspective(900px)` was added to the
transform string so the Y-rotation actually reads as depth rather than
a flat horizontal squash.

### Why the physics hook never re-renders

`useCardPhysics` keeps position, velocity, and phase in refs and
writes `el.style.transform` directly inside a single
`requestAnimationFrame` loop. The spring/damping math itself lives in
`lib/physics.ts` as small pure functions, independent of React. The
release feel (spring strength / damping) was tuned by simulating the
trajectory numerically before committing to values — the first pass
overshot by 43% of the drag distance on release, which read as too
bouncy; the shipped constants overshoot about 16% once and settle
within roughly a second. The reduced-motion variant was verified to
be non-oscillating (monotonic decay, no sign change) rather than just
"faster."

The same ref-driven pattern shows up in `lib/sceneStore.ts`:
continuous scroll progress (`scrollProgress.value`) is a plain mutable
object read directly inside the R3F `useFrame` loop, never routed
through `useState` — only the *discrete* "which section is active"
value (changes a handful of times per session) goes through
`useSyncExternalStore`.

### Persistent 3D scene + adaptive performance

`components/three/SceneCanvas.tsx` mounts a single `<Canvas>` once
(code-split via `next/dynamic({ ssr: false })` in `app/page.tsx`,
since WebGL can't render during SSR and three.js is the heaviest
chunk in the app — this alone cut First Load JS from ~392KB to
~183KB). It's never destroyed and recreated as sections scroll by —
`SceneContent.tsx`'s particle field, low-poly nodes, and grid just
read updated tier config and the shared scroll store.

`hooks/usePerformanceTier.ts` picks a tier (`high` / `medium` / `low`)
from device heuristics (cores, memory, viewport, pointer type,
reduced-motion) on mount, then samples real frame times for ~1.5s and
steps the tier *down* once if the device can't keep up — never back
up mid-session, to avoid visible flicker between quality levels. If
WebGL isn't available at all, `Fallback2D.tsx` (CSS gradients, a
masked grid, a dozen drifting dots, all well under any "huge particle
count" concern since they're real DOM nodes) renders instead — the
site never depends on WebGL to be usable.

`SceneContent.tsx`'s grid is a plain `THREE.GridHelper`, whose
constructor takes separate colors for its center lines vs. the rest of
the grid — they were previously different, which (seen through the
camera, on a canvas that sits fixed behind the entire page) read as a
single bright vertical line down the middle of the whole site, not
just the hero. Both colors are now the same, so the center lines blend
into the rest of the sparse grid instead of standing out.

### CV download terminal

`components/terminal/CvTerminal.tsx`, sitting between About and
Education, is deliberately *not* a section: no `SectionShell`, no rail
index, no entry in `SiteNav`'s dots, and it's absent from the
`sections` array `useSectionProgress` tracks — none of that machinery
knows it exists. It reuses the same `TerminalWindow` chrome as the
boot sequence for visual consistency, and is otherwise a self-contained
`useState` state machine (`idle → installing → done | not-found`) —
appropriately, since a handful of discrete, user-triggered text reveals
over ~1.3s is a fundamentally different animation problem from the
card's continuous 60fps loop, not something that needs refs and
`requestAnimationFrame`. The `sudo apt install` sequence is a pure
visual metaphor: nothing is ever executed anywhere. On completion it
sends a `HEAD` request for `profile.cvUrl` and only celebrates success
if that resolves — otherwise it shows an honest "package not found"
result — so it can never claim to have downloaded a CV that isn't
actually there.

### Accessibility

- The hanging card is a real `<button>`: draggable with pointer
  events, and Enter/Space triggers the same "continue" action as a
  click — dragging was never the only way to proceed.
- A skip-to-content link is the first focusable element on the page.
- `prefers-reduced-motion` is checked in JS everywhere motion is
  decided (card physics switch to a fast, non-oscillating spring; GSAP
  scroll effects and the boot-sequence type-on are skipped entirely)
  *and* backstopped by a global rule in `globals.css` that zeroes
  animation/transition durations, so nothing is reduced-motion-safe
  only because one component remembered to check.
- Every interactive element gets a visible focus state — a themed
  default via `:where(a, button):focus-visible` in `globals.css`, or
  its own explicit ring where one is set.
- Touch dragging is scoped to the card itself (`touch-action: none`
  only on that element), so it never hijacks page scrolling.

## Project structure

```
app/                    layout, page composition, global styles
components/
  hero/                  PORTFOLIO wordmark, hanging card, string, physics wiring
  terminal/              reusable terminal chrome, the boot sequence, and the CV-download terminal
  sections/              About / Education / Experience / Certifications / Projects / Skills / Contact
  three/                 persistent R3F scene + CSS fallback
  nav/                   scroll progress bar + section dots
  ui/                    shared primitives (Container, Chip, headings)
hooks/                   card physics, performance tier, reduced motion, scroll progress
lib/                     physics math, performance heuristics, gsap setup, scene store, utils
data/                    all editable content
types/                   shared TypeScript types for the data layer
```

## Deploying

This is a standard Next.js app — [Vercel](https://vercel.com) is the
zero-config option (`vercel deploy` or connect the repo), or
`npm run build && npm run start` on any Node host.

## Honest scope notes

This implements the full architecture the brief asked for — real
pointer-driven spring physics, GSAP/physics ownership separation, a
persistent adaptive-tier R3F scene with a CSS fallback, and a
data-driven terminal-styled document — rather than approximating it
with CSS-only animation. A couple of things were kept deliberately
simple rather than gold-plated, and are easy to extend from here:

- The performance tiers use a heuristic plus a one-time FPS sample,
  not a continuous benchmarking system.
- The 3D scene is a particle field, a grid, and a handful of low-poly
  nodes — intentionally restrained rather than a dense environment, in
  keeping with "content readability first."
- There's no test suite. `lib/physics.ts` is pure functions with no
  React or DOM dependency specifically so it's easy to add one
  (Vitest + a few numeric assertions on `stepSpring`/`applySoftLimit`
  would cover the core feel).

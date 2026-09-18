# Project Guide

A plain-language guide to this project — what it is, how it's put
together, and exactly which file to open for every common change.
If you didn't build this yourself, start here.

(For deeper technical/architecture notes — why things are built the
way they are — see `README.md`. This guide is the "how do I change
X" version.)

---

## 1. Project overview

**What this is.** A personal cybersecurity portfolio website. Instead
of a normal page with a photo and some text, the homepage opens on a
big **PORTFOLIO** heading with your profile card physically hanging
from it on a string, which you can grab and drag around. Scrolling
down moves you into a Linux-terminal-styled document with your About,
Education, Experience, Certifications, Projects, Skills, and Contact
information.

**Main technologies.**
- **Next.js** + **React** + **TypeScript** — the framework the whole
  site is built with.
- **Tailwind CSS** — how everything is styled (utility classes like
  `text-signal` or `p-6` instead of separate CSS files).
- **GSAP** (with its ScrollTrigger plugin) — handles animations that
  are tied to scrolling, like sections fading in as you reach them.
- **Framer Motion** — a small, extra touch on the Projects cards (a
  gentle lift when you hover one).
- **React Three Fiber** (built on **Three.js**) — draws the 3D
  particle/grid background you see behind everything.

**How the hanging card works.** When you touch or click the card and
move your mouse/finger, the card follows it. When you let go, the card
doesn't just snap back — it swings a little past its resting point and
settles, like a real object on a string would. When you're *not*
touching it, it also drifts very slightly on its own, as if a gentle
breeze were nudging it. All of this position/rotation math lives in
`hooks/useCardPhysics.ts` and `lib/physics.ts` — see section 2 of this
guide ("Folder structure") if you're curious, but you never need to
touch these files just to update content.

**How the 3D background works.** `components/three/` draws a subtle
field of particles and a soft grid using React Three Fiber. It
automatically turns itself down (fewer particles, simpler effects) on
slower devices, and falls back to a plain CSS background if the
visitor's browser doesn't support 3D graphics (WebGL) at all. You
don't need to touch this to edit content either.

**How the content system works.** This is the important part for you:
**every piece of text on the site — your name, your bio, your degree,
your jobs, your certificates, your projects, your skills, your contact
links — lives in a small set of files inside the `data/` folder.** The
actual page components just read from those files and display
whatever's there. That means you almost never need to edit a component
file to change what the site says — you edit a `data/*.ts` file
instead. The rest of this guide is mostly a tour of those files.

---

## 2. Folder structure

```
app/                layout, the page itself, global CSS
components/
  hero/              the PORTFOLIO heading, the hanging card, the string
  terminal/          the terminal-style "chrome" and the boot sequence
  sections/          About / Education / Experience / Certifications /
                     Projects / Skills / Contact
  three/             the 3D background + its CSS fallback
  nav/               the scroll progress bar + section dots on the right
  ui/                small shared building blocks (headings, tags, etc.)
data/                <-- all your real content lives here
hooks/               the card-physics logic, performance detection
lib/                 math helpers, small utilities
types/               TypeScript definitions describing each data file's shape
public/              images (your photo, certificate scans, screenshots)
```

**When do you need to open each folder?**

| Folder | When to touch it |
|---|---|
| `data/` | Almost always — this is where your actual content lives. |
| `public/` | When adding an image (photo, certificate, screenshot). |
| `components/sections/` | Only if you want to change *how* a section looks, not what it says. |
| `components/hero/`, `hooks/`, `lib/` | Only for the hanging-card physics or the string. Content doesn't live here. |
| `components/three/`, `components/nav/`, `components/ui/`, `components/terminal/` | Rarely — these are shared visual/structural pieces, not content. |
| `types/` | Only if you're adding a brand-new field to one of the data files (e.g. a new property on a project). |
| `app/` | Rarely — page title, global colors/fonts, and the order sections appear in. |

---

## 3. How to change the About section

**File:** `data/profile.ts`

This file controls three things at once: the hanging card's header
line, the small "whoami" line that appears right after the hero, and
the paragraphs in the About section.

Open it and edit the fields directly:

```ts
export const profile: Profile = {
  name: "Muhammad",
  handle: "mhussainx94",
  title: "Cybersecurity & Penetration Testing",
  location: "Islamabad, Pakistan",
  summary: "BS Computer Science @ NUTECH — building toward offensive security",
  photoUrl: undefined, // see section 9 below
  bio: [
    "First paragraph of your About section.",
    "Second paragraph.",
    "You can add as many paragraphs as you like — just add more strings to this array.",
  ],
};
```

To change your bio text, edit the strings inside `bio: [...]`. To add
a new paragraph, add a new line with a comma. No other file needs to
change.

---

## 4. How to change the Education section

**File:** `data/education.ts`

This is a list (an array), even though there's only one entry right
now — that's on purpose, so you can add another degree later without
restructuring anything.

**To edit the existing entry**, change any of its fields:

```ts
{
  id: "nutech-bscs",
  institution: "National University of Technology (NUTECH)",
  degree: "BS",
  field: "Computer Science",
  location: "Islamabad, Pakistan",
  startDate: "2024-09",   // "YYYY-MM" format
  endDate: "2028",
  studentId: "F2460502",
  coursework: ["Network Security", "Operating Systems", "..."],
  notes: ["Any extra detail you want listed underneath."],
}
```

**To add a second entry** (another degree, a diploma, etc.), copy that
whole block, give it a new unique `id`, and add it as a new item in
the array — separated by a comma:

```ts
export const education: EducationEntry[] = [
  { id: "nutech-bscs", /* ...existing entry... */ },
  {
    id: "my-new-entry",
    institution: "...",
    degree: "...",
    field: "...",
    location: "...",
    startDate: "...",
    endDate: "...",
    coursework: [],
  },
];
```

---

## 5. How to change the Experience section

**File:** `data/experience.ts`

Same idea as Education — it's an array you add to. Each entry looks
like this:

```ts
{
  id: "unique-id-for-this-role",
  role: "Job title / role name",
  organization: "Company or organization name",
  location: "City, Country",
  startDate: "2026-01",     // "YYYY-MM" if you know the month, or just "2026"
  endDate: "2026-06",       // ignored if current is true
  current: false,           // set true if this is your current role
  description: "A sentence or two about what you did.",
  technologies: ["Tool or skill", "Another one"],
}
```

**To add a new role**, add a new object like the one above as another
item in the `experience` array (comma-separated, same as Education).
Setting `current: true` shows a "current" badge and displays "Present"
instead of an end date — you don't need to update `endDate` when a
role is ongoing.

---

## 6. How to change the Projects section

**File:** `data/projects.ts`

Each project is an object in the `projects` array:

```ts
{
  id: "unique-project-id",
  title: "Project Name",
  description: "A sentence or two describing what it does and why it matters.",
  category: "application-security", // or "offensive-security", "recon-automation", "tooling"
  featured: true,        // optional — makes the card span two columns in the grid
  technologies: ["Python", "Flask"],
  githubUrl: "https://github.com/you/repo",  // optional — omit if there's no public repo yet
  liveUrl: "https://your-demo-url.com",       // optional
  status: "shipped",     // or "in-progress", "add-details"
}
```

- **Adding a new project:** copy an existing entry, change the `id`
  and every field, and add it to the array.
- **Screenshots:** add an `imageUrl: "/your-screenshot.png"` field and
  place the matching file in `public/` (see section 9 — the process is
  the same as adding your profile photo). This field isn't wired into
  the current card design, but it's already in the data type if you
  want to extend `components/sections/Projects.tsx` to display it.
- **`featured`:** set this to `true` on your one or two strongest
  projects — they'll render larger in the grid. Leave it off (or set
  to `false`) for everything else.
- **Links:** only add `githubUrl` / `liveUrl` if the link is real —
  the card simply hides that button when the field is left out, rather
  than showing a broken link.

---

## 7. How to change Certifications

**File:** `data/certifications.ts`

```ts
{
  id: "unique-cert-id",
  name: "Certification Name",
  issuer: "Issuing Organization",
  status: "completed",     // or "exploring" (for something you're still working toward)
  date: "2026",            // optional
  credentialUrl: "https://...",  // optional — shows a "verify" link if present
  note: "Optional short note, shown for 'exploring' items.",
}
```

- **Adding a certificate:** add a new object to the array, same
  pattern as everywhere else.
- **Changing status:** completed certifications render in the main
  list with a checkmark; anything with `status: "exploring"` renders
  separately underneath as "currently exploring" with a dashed border.
  Just change the `status` field when you finish one — it moves itself
  to the right list automatically.

---

## 8. How to change Skills

**File:** `data/skills.ts`

Skills are grouped by category rather than listed as a flat list (and
deliberately not shown as percentage bars):

```ts
{
  id: "unique-group-id",
  command: "ls new-category/",   // the little terminal-style label
  label: "Category Name",
  skills: ["Tool A", "Tool B", "Tool C"],
}
```

- **Adding or removing a skill:** find the right group in the
  `skillGroups` array and add/remove strings inside its `skills: [...]`
  list.
- **Adding a whole new category:** add a new object like the one above
  to the array.

---

## 9. How to add your profile image

1. **Where to place it:** put the image file directly in the `public/`
   folder — for example `public/avatar.jpg`.
2. **Recommended format:** `.jpg` or `.png`. A **portrait-orientation**
   photo works best — the card's image area is taller than it is wide
   (a 4:5 ratio), and the image will be cropped to fill that shape.
3. **Recommended size:** anything roughly square-to-portrait and under
   about 500KB is plenty — for example 800×1000px. Next.js optimizes
   and resizes it automatically; you don't need to hand-crop it to an
   exact pixel size.
4. **How to point the site at it:** open `data/profile.ts` and set:
   ```ts
   photoUrl: "/avatar.jpg",
   ```
   (Note the leading `/` — it refers to the `public/` folder, so
   `public/avatar.jpg` becomes `/avatar.jpg`.)
5. **If the image doesn't show up:**
   - Double-check the filename matches exactly, including
     capitalization (`avatar.jpg` vs `Avatar.JPG` are different files
     on most systems).
   - Make sure the file is directly inside `public/`, not in a
     subfolder — unless you also update the path to match, e.g.
     `public/images/avatar.jpg` → `photoUrl: "/images/avatar.jpg"`.
   - Restart `npm run dev` after adding the file — new files in
     `public/` are sometimes not picked up until the dev server
     restarts.
   - Until `photoUrl` is set, the card automatically shows a fallback
     — a circular monogram with your first initial — so nothing ever
     looks broken in the meantime.

---

## 10. How to add your CV

Between About and Education there's a small terminal that looks like
`sudo apt install mhussainx94-cv` — clicking (or Enter/Space-ing) it
plays a short fake install animation and then downloads your CV as a
PDF. Nothing is actually executed anywhere; it's a themed download
button.

1. **Where to place it:** put the PDF directly in `public/` — for
   example `public/Muhammad-Hussain-CV.pdf`.
2. **How to point the site at it:** open `data/profile.ts` and set:
   ```ts
   cvUrl: "/Muhammad-Hussain-CV.pdf",
   ```
   This is already set to that exact path by default — if your file
   uses that name, you don't need to change anything, just add the
   file.
3. **If the download doesn't work:** the terminal checks the file
   actually exists before claiming success. If it doesn't find
   anything at `cvUrl`, it shows `package not found` instead of a
   broken download — that's the sign the PDF either isn't there yet or
   the filename doesn't match `cvUrl` exactly (capitalization included).
4. **To rename the fake package** (the `mhussainx94-cv` part), that
   comes from `profile.handle` in `data/profile.ts` — it updates
   everywhere automatically, including this terminal.

---

## 11. How to run the project

```bash
npm install       # first time only — installs all dependencies
npm run dev        # starts the local development server
```

Then open **http://localhost:3000** in your browser. The page updates
automatically whenever you save a file.

For a production build (what you'd actually deploy):

```bash
npm run build      # builds an optimized production version
npm run start       # serves that build locally, same as production
```

---

## 12. Important files

| File | Purpose |
|---|---|
| `data/profile.ts` | Name, title, bio, hero card header, profile photo + CV paths |
| `data/education.ts` | Education entries |
| `data/experience.ts` | Work/internship experience entries |
| `data/certifications.ts` | Certifications list |
| `data/projects.ts` | Project cards |
| `data/skills.ts` | Skills, grouped by category |
| `data/social.ts` | Contact links (email, GitHub, LinkedIn) |
| `hooks/useCardPhysics.ts` | All hanging-card physics — drag, momentum, idle sway, 3D tilt |
| `lib/physics.ts` | The underlying spring/idle-sway/tilt math |
| `components/hero/CardString.tsx` | Draws the string connecting the "O" to the card, with tension |
| `components/hero/Hero.tsx` | The PORTFOLIO heading + hero layout + which letter the string anchors to |
| `components/hero/HangingCard.tsx` | The card's visual content (header + photo) |
| `components/terminal/CvTerminal.tsx` | The CV-download terminal between About and Education |
| `app/page.tsx` | The order sections (and the CV terminal) appear in on the page |
| `app/globals.css` | Colors, fonts, the card's glow, global styles |

If you only remember one thing from this guide: **content changes
almost always happen in `data/`, never in `components/`.**

# public/

Static assets referenced by the data layer go here. Nothing in this
folder is required for the site to run — every image field in `data/`
is optional and the UI degrades gracefully when it's absent.

- `avatar.jpg` (or `.png`) — your photo for the hanging card. Add the
  file here, then set `photoUrl: "/avatar.jpg"` in `data/profile.ts`.
  Until then, the card shows a monogram instead.
- Certificate images — add a file per certificate, then set that
  certification's `imageUrl` in `data/certifications.ts`.
- Project screenshots — add a file per project, then set that
  project's `imageUrl` in `data/projects.ts`.

Keep source images reasonably sized (under ~500KB, ideally already
cropped close to their display size) — `next/image` will still
optimize and lazy-load them, but it can't undo a multi-megabyte
original.

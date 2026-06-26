# betterhomes — git teaching demo site

A small static **betterhomes** real-estate website used as a hands-on sandbox for
learning **git**, **branches**, **GitHub pull requests**, and — most importantly —
**how merge conflicts happen and how to resolve them**.

The site itself is intentionally simple. The interesting part is the repository's
branch topology: it is wired so that some pull requests merge cleanly while others
collide on the exact same lines, giving you a safe place to practise conflict
resolution without touching anything real.

## Why this repo exists

- To give colleagues a **realistic but throwaway** project to experiment in.
- To show the difference between a branch that **merges clean** and one that
  **conflicts** — and *why*.
- To make the key lesson tangible: **editing the same file is fine; editing the
  same lines is what causes a conflict.**

## How to run it

There is **no build step and no dependencies**. It is plain HTML, CSS, and
JavaScript.

```bash
# clone the repo, then just open the home page in a browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

That's it — double-clicking `index.html` in a file explorer works too.

## Project structure

```text
bhomes-website/
├── index.html          # home page (hero section lives here)
├── properties.html     # property listings page
├── about.html          # about betterhomes
├── contact.html        # contact form page
├── css/
│   └── styles.css       # all site styling (brand colours in :root)
├── js/
│   ├── main.js          # shared site behaviour
│   ├── properties.js    # renders the listings page
│   └── contact.js       # contact form handling
├── data/
│   └── properties.js    # sample property data
└── docs/                # the git / branching / conflict guides (start here)
```

## Branches in this repo

The repo is set up with a `main` (live) branch, a `develop` integration branch,
and a set of feature branches that each branch off the same base commit. Some have
already been merged into `develop`; others are left as **open pull requests** so you
can practise reviewing and merging them.

| Branch | Purpose | Status |
| --- | --- | --- |
| `main` | Production / live site. | Stable |
| `develop` | Integration branch where reviewed features land before `main`. | Stable |
| `claude/sweet-mccarthy-ns45os` | Branch this build was authored on (PR → `main`). The source of the base site. | Base |
| `feature/marketing-hero` | Rewrites the hero `<h1>` + tagline in `index.html` to marketing copy. | Merged into `develop` |
| `feature/seo-hero` | Rewrites the **same** hero `<h1>` + tagline to SEO copy. | Open PR — **conflicts** with `develop` |
| `feature/rebrand-crimson` | Changes `--brand-primary` / `--brand-primary-dark` / `--brand-accent` in `css/styles.css` `:root`. | Merged into `develop` |
| `feature/rebrand-navy` | Changes the **same** `:root` colour variables to navy. | Open PR — **conflicts** with `develop` |
| `feature/whatsapp-button` | **Appends** a floating WhatsApp button (new CSS at end of `styles.css` + markup) — touches `styles.css` too, but on **different lines**. | Open PR — **merges clean** |

### The key teaching point

`feature/rebrand-navy` conflicts because it edits the **same lines** already changed
on `develop` (by `feature/rebrand-crimson`). `feature/whatsapp-button` touches the
**same file** (`css/styles.css`) but **different lines**, so git auto-merges it with
no conflict.

> **Same file ≠ conflict. Same lines = conflict.**

### Reproduce the conflicts locally

Two conflicts are designed to be reproduced on a fresh checkout of `develop`:

**A) Hero text conflict** (`index.html`):

```bash
git switch develop          # already has feature/marketing-hero
git merge feature/seo-hero  # both branches rewrote the same <h1> + tagline
```

**B) Brand colour conflict** (`css/styles.css` `:root`):

```bash
git switch develop             # already has feature/rebrand-crimson
git merge feature/rebrand-navy # both branches changed the same colour variables
```

In each case git will stop and mark the conflicting region with
`<<<<<<<`, `=======`, and `>>>>>>>` so you can choose how to resolve it.

## Start here

New to the repo? Work through these guides in order:

1. [docs/GIT-GUIDE.md](docs/GIT-GUIDE.md) — git fundamentals: clone, commit, push, pull.
2. [docs/BRANCHING-STRATEGY.md](docs/BRANCHING-STRATEGY.md) — how `main`, `develop`, and feature branches fit together.
3. [docs/CONFLICT-WALKTHROUGH.md](docs/CONFLICT-WALKTHROUGH.md) — a step-by-step walkthrough of resolving the two conflicts above.

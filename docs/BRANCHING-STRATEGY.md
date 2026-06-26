# Branching Strategy

How branching works on a big project, modelled on the **betterhomes** website repo (`ashlincheeran/bhomes-website`). This is a static site we use to teach git and GitHub, so the examples below are real branches you can check out and merge yourself.

---

## 1. Why big teams branch instead of committing to `main`

On a small toy project one person can commit straight to `main` and nothing breaks. On a real project with many contributors, committing directly to `main` falls apart fast:

- **`main` must always be deployable.** It is the live betterhomes site. A half-finished commit on `main` means a broken production site.
- **Work happens in parallel.** Several people change the hero copy, the brand colours, and add a WhatsApp button at the same time. If everyone pushes to one branch, their unfinished work collides constantly.
- **Changes need review before they ship.** A branch + pull request gives teammates a place to read the diff, comment, and approve *before* the code reaches production.
- **Isolation makes mistakes cheap.** A bad idea on a feature branch is just deleted. A bad idea committed to `main` has to be reverted in production history.
- **History stays readable.** Each branch maps to one unit of work, so `git log` on `main` reads as a list of reviewed, completed features rather than a stream of work-in-progress saves.

The rule of thumb: **`main` is a record of what has shipped, not a scratchpad for work in progress.** All real work happens on branches.

---

## 2. The model used here — a simplified git-flow

This repo uses three kinds of branch: one production branch, one integration branch, and many short-lived feature branches. This is a trimmed-down version of "git-flow."

```
feature/*  ──►  develop  ──►  main
(work)          (integrate)   (production)
```

| Branch | Role | Lifetime | Who merges in | Deployed? |
| --- | --- | --- | --- | --- |
| `main` | Production / the live betterhomes site. Always deployable. | Permanent | Only `develop`, after review | Yes — this is live |
| `develop` | Integration branch. Reviewed features land here first and are tested together before a release. | Permanent | Feature branches, via PR + review | No (staging at most) |
| `feature/*` | Short-lived branches for one unit of work (one feature, one fix). | Temporary — deleted after merge | N/A (you commit here) | No |

A fourth branch exists in this teaching repo for historical reasons:

- `claude/sweet-mccarthy-ns45os` — the branch the base site was authored on (its PR targets `main`). Treat it as **the source of the base site**: every `feature/*` branch below was cut from that base-site commit.

How a change flows through the system:

1. You branch a `feature/*` off `develop`.
2. You do the work, open a PR back into `develop`, and a teammate reviews it.
3. Once several features have integrated cleanly on `develop` and been tested together, `develop` is merged into `main` for a release.

So `main` only ever receives reviewed, integrated, tested work — never a raw feature branch.

---

## 3. The lifecycle of a feature

Every feature follows the same path: **branch → commit → push → PR → review → merge → delete.** Here are the exact commands for this repo, using the WhatsApp button feature as the example.

**1. Start from an up-to-date `develop` and branch off it**

```bash
git switch develop
git pull origin develop
git switch -c feature/whatsapp-button develop
```

`git switch -c feature/whatsapp-button develop` creates the new branch *from* `develop` and checks it out in one step.

**2. Do the work and commit**

```bash
# edit css/styles.css and the markup...
git add css/styles.css index.html
git commit -m "Add floating WhatsApp contact button"
```

**3. Push the branch to GitHub**

```bash
git push -u origin feature/whatsapp-button
```

The `-u` sets the upstream so later pushes are just `git push`.

**4. Open a pull request into `develop`**

```bash
gh pr create --base develop --head feature/whatsapp-button \
  --title "Add floating WhatsApp button" \
  --body "Adds a floating WhatsApp CTA. New CSS appended to styles.css; no existing rules touched."
```

(Or open the PR from the GitHub web UI — same thing.)

**5. Review**

A teammate reads the diff, leaves comments, and approves. You push follow-up commits to the same branch to address feedback; the PR updates automatically.

**6. Merge into `develop`**

```bash
gh pr merge feature/whatsapp-button --squash --delete-branch
```

**7. Delete the branch** (the merge command above already did this remotely; clean up locally too)

```bash
git switch develop
git pull origin develop
git branch -d feature/whatsapp-button
```

The feature branch has served its purpose and is gone. Later, when a release is cut, `develop` is merged into `main`:

```bash
git switch main
git pull origin main
git merge --no-ff develop
git push origin main
```

---

## 4. The five feature branches in this repo

Each branch below was cut from the same base-site commit. The interesting part is what happens when you try to integrate them into `develop` — some merge clean, some conflict, and *why* is the whole lesson.

Two branches have **already merged into `develop`**: `feature/marketing-hero` and `feature/rebrand-crimson`. The other three have **open PRs**. Whether each open PR merges clean depends on whether it touches lines that the already-merged branches changed.

| # | Branch | What it changes | File(s) | Status | Result vs `develop` |
| --- | --- | --- | --- | --- | --- |
| 1 | `feature/marketing-hero` | Rewrites the hero `<h1>` + tagline to marketing copy | `index.html` | Merged into `develop` | — (it's already in) |
| 2 | `feature/seo-hero` | Rewrites the **same** hero `<h1>` + tagline to SEO copy | `index.html` | Open PR | **Conflicts** |
| 3 | `feature/rebrand-crimson` | Changes `--brand-primary` / `--brand-primary-dark` / `--brand-accent` in `:root` | `css/styles.css` | Merged into `develop` | — (it's already in) |
| 4 | `feature/rebrand-navy` | Changes the **same** `:root` colour variables to navy | `css/styles.css` | Open PR | **Conflicts** |
| 5 | `feature/whatsapp-button` | **Appends** a floating WhatsApp button (new CSS at end of file + markup) | `css/styles.css` + markup | Open PR | **Merges clean** |

### Why #2 (`feature/seo-hero`) conflicts

`feature/marketing-hero` already rewrote the hero `<h1>` and tagline on `develop`. `feature/seo-hero` rewrites **the exact same lines** to different text. Git cannot know which wording you want, so it stops and asks you. Reproduce it:

```bash
git switch develop
git merge feature/seo-hero
```

The conflicted region in `index.html`:

```html
<<<<<<< HEAD
      <h1>Your dream Dubai address starts here</h1>
      <p>Move faster with betterhomes — exclusive listings, sharp negotiation and zero hassle from viewing to handover.</p>
=======
      <h1>Property for sale &amp; rent in Dubai | betterhomes</h1>
      <p>Search apartments, villas and townhouses across Dubai with betterhomes, the UAE's trusted real estate agency since 1986.</p>
>>>>>>> feature/seo-hero
```

`HEAD` is what is on `develop` now (the marketing copy); below the `=======` is what `feature/seo-hero` wants (the SEO copy). You resolve it by editing the file to keep the wording you actually want, deleting the `<<<<<<<`, `=======`, and `>>>>>>>` markers, then:

```bash
git add index.html
git commit
```

### Why #4 (`feature/rebrand-navy`) conflicts

Same story, different file. `feature/rebrand-crimson` already changed the three `:root` colour variables on `develop`. `feature/rebrand-navy` changes **the same three lines** to navy values. Reproduce it:

```bash
git switch develop
git merge feature/rebrand-navy
```

The conflicted region in `css/styles.css`:

```css
<<<<<<< HEAD
  --brand-primary: #c8102e;        /* refreshed crimson */
  --brand-primary-dark: #8f0a20;
  --brand-accent: #f0a500;
=======
  --brand-primary: #0a2540;        /* navy rebrand */
  --brand-primary-dark: #061829;
  --brand-accent: #f5b800;
>>>>>>> feature/rebrand-navy
```

Resolve the same way: pick the colours you want, remove the markers, `git add css/styles.css` and `git commit`.

### Why #5 (`feature/whatsapp-button`) merges clean

This is the key contrast. `feature/whatsapp-button` touches `css/styles.css` too — **the same file** as the crimson rebrand already on `develop`. But it does not edit the `:root` block; it **appends** brand-new CSS at the **end** of the file plus some new markup. Because no line it changes overlaps a line `develop` changed, git merges the two sets of edits automatically with no conflict.

> **The lesson: same *file* is not a conflict. Same *lines* is a conflict.**
> `feature/whatsapp-button` and `feature/rebrand-crimson` both edit `styles.css` and coexist happily. `feature/rebrand-navy` and `feature/rebrand-crimson` edit the *same lines* of `styles.css`, so they collide. Git conflicts at the line level, not the file level.

---

## 5. Naming conventions and tips

**Naming**

- Prefix by intent: `feature/`, `fix/`, `chore/`, `docs/`. This repo uses `feature/*` for all five examples.
- Describe the change, not the person or the ticket alone: `feature/whatsapp-button`, `feature/seo-hero` — readable at a glance in `git branch` and in the PR list.
- Use lowercase and hyphens, no spaces.

**Keeping merges painless**

- **Keep PRs small and single-purpose.** One branch = one change. `feature/whatsapp-button` adds a button and nothing else, which is exactly why it is easy to review and merge.
- **Pull `develop` often.** Before you start *and* periodically while you work, run `git switch develop && git pull` then merge `develop` into your feature branch (`git merge develop`). The longer your branch drifts from `develop`, the more likely you hit the kind of conflict `feature/seo-hero` and `feature/rebrand-navy` show.
- **Expect conflicts when two branches touch the same lines — and resolve them on the feature branch, not on `develop`.** Merge `develop` into your branch, fix the markers there, then open/refresh the PR so `develop` itself stays clean.
- **Write a descriptive PR body.** Say what changed and which files, so reviewers know whether to expect overlap (e.g. "appends new CSS, touches no existing rules").
- **Delete feature branches after merge.** They are short-lived by design; leaving them around clutters the branch list.
- **Never commit straight to `main`.** Work flows `feature/*` → `develop` → `main`, always through review.

---

## Appendix — branch diagram

Feature branches come off `develop`, merge back into `develop`, and `develop` is periodically merged into `main`. Branches 1 and 3 have already merged; 2, 4, and 5 are open PRs (2 and 4 conflict, 5 is clean).

```
                                                              (release)
 main      ●─────────────────────────────────────────────────────●──►
            \                                                     /
             \                                          merge develop
              \                                                 /
 develop       ●──────●────────────●──────────────────────────●──►
                \      ▲            ▲                          ▲
                 \     │ merge      │ merge                    │
                  \    │ (clean)    │ (clean)                  │  open PRs:
                   \   │            │                          │
  base site ●───────┐ │            │                          │
  (claude/...)      │ │            │                          │
                    │ │            │                          │
   feature/marketing-hero ●────────┘ (1: index.html hero, MERGED)
                    │ │
   feature/rebrand-crimson ●───────────────────┘ (3: styles.css :root, MERGED)
                    │
   feature/seo-hero ●·········· PR ··········► develop  (2: SAME hero lines  → CONFLICT)
                    │
   feature/rebrand-navy ●······ PR ··········► develop  (4: SAME :root lines → CONFLICT)
                    │
   feature/whatsapp-button ●··· PR ··········► develop  (5: appends CSS, diff lines → CLEAN)
```

Legend: `●` a commit/branch point · `─►` merged history · `·····► PR` an open pull request not yet merged.

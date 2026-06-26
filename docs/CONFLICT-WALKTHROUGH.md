# Merge Conflict Walkthrough

A hands-on, step-by-step guide to **seeing** and **resolving** a git merge conflict, using two real conflicts that have been engineered into this `betterhomes` website repo.

By the end you will be able to:

- Explain when git can auto-merge and when it cannot.
- Reproduce a real conflict on your own machine.
- Read the `<<<<<<<` / `=======` / `>>>>>>>` markers git inserts.
- Resolve a conflict three different ways (keep ours, keep theirs, hand-blend).
- Do the same thing in the GitHub web UI.
- Use the rescue commands when a merge goes sideways.
- Avoid most painful conflicts in the first place.

---

## The branches in play

| Branch | What it does | Status |
| --- | --- | --- |
| `main` | Production / live site. | — |
| `develop` | Integration branch; reviewed features land here before `main`. | — |
| `feature/marketing-hero` | Rewrites the hero `<h1>` + tagline in `index.html` to **marketing** copy. | MERGED into `develop` |
| `feature/seo-hero` | Rewrites the **same** hero `<h1>` + tagline to **SEO** copy. | OPEN PR — **conflicts** |
| `feature/rebrand-crimson` | Changes `--brand-primary` / `--brand-primary-dark` / `--brand-accent` in `css/styles.css` `:root`. | MERGED into `develop` |
| `feature/rebrand-navy` | Changes the **same** `:root` colour variables to navy. | OPEN PR — **conflicts** |
| `feature/whatsapp-button` | **Appends** a floating WhatsApp button (new CSS at the end of `styles.css` + markup) — touches `styles.css` too, but **different lines**. | OPEN PR — **merges clean** |

---

## 1. What a merge conflict actually is

When you merge one branch into another, git replays the changes from both sides on top of their **common ancestor** (the commit they last agreed on). For every chunk of every file it asks one question:

> Did **both** sides change the **same lines** in **different ways**?

- **No** → git applies both sets of changes automatically. This is the normal, boring, happy case.
- **Yes** → git cannot know which version you want, so it **stops**, leaves both versions in the file surrounded by markers, and asks **you** to decide. That is a merge conflict.

### Same file does NOT mean conflict

A common misconception is that touching the same file causes a conflict. It does not. The unit of conflict is the **line region**, not the file.

Look at two of the open PRs against `develop`, both of which touch `css/styles.css`:

```text
develop already contains feature/rebrand-crimson, which changed these lines in :root:
    --brand-primary, --brand-primary-dark, --brand-accent
```

- **`feature/whatsapp-button`** also edits `css/styles.css`, but it **appends** brand-new CSS at the **end of the file** and never touches the `:root` block. Different lines → git merges it **cleanly**, no human needed.

- **`feature/rebrand-navy`** edits the **exact same `:root` lines** that `rebrand-crimson` already changed on `develop`. Same lines, two different answers (crimson vs navy) → **conflict**.

> **Key takeaway:** Same file ≠ conflict. **Same lines changed two ways = conflict.**

The rest of this guide walks through the two conflicts you can reproduce locally (Conflict A in `index.html`, Conflict B in `css/styles.css`), then shows the same fix in the GitHub UI.

---

## 2. Conflict A — hero text in `index.html`

`develop` already has the **marketing** hero copy (from `feature/marketing-hero`). The open `feature/seo-hero` branch rewrites the **same** `<h1>` and tagline with **SEO** copy. Merging them collides.

### Reproduce it locally

```bash
git switch develop
git pull
git merge feature/seo-hero
```

git stops with a message like:

```text
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

### The exact markers git inserts

Open `index.html` and find the hero. git has rewritten that region to show **both** versions, fenced by markers:

```html
<<<<<<< HEAD
      <h1>Your dream Dubai address starts here</h1>
      <p>Move faster with betterhomes — exclusive listings, sharp negotiation and zero hassle from viewing to handover.</p>
=======
      <h1>Property for sale &amp; rent in Dubai | betterhomes</h1>
      <p>Search apartments, villas and townhouses across Dubai with betterhomes, the UAE's trusted real estate agency since 1986.</p>
>>>>>>> feature/seo-hero
```

### How to read the markers

- `<<<<<<< HEAD` — start of **your current branch's** version. You are on `develop`, so **HEAD = what is already on develop = the marketing-hero copy**. This side is often called **"ours."**
- `=======` — the divider between the two versions.
- `>>>>>>> feature/seo-hero` — end of the **incoming branch's** version. This is the **SEO copy** coming from `feature/seo-hero`. This side is often called **"theirs."**

Everything between `<<<<<<<` and `=======` is **ours**; everything between `=======` and `>>>>>>>` is **theirs**. The markers themselves are not valid HTML — they only exist to be deleted as you resolve.

### Three ways to resolve

**Option 1 — Keep ours (the marketing copy already on develop).** Delete the divider, theirs, and all three markers:

```html
      <h1>Your dream Dubai address starts here</h1>
      <p>Move faster with betterhomes — exclusive listings, sharp negotiation and zero hassle from viewing to handover.</p>
```

**Option 2 — Keep theirs (the SEO copy from `feature/seo-hero`).** Delete ours, the divider, and all three markers:

```html
      <h1>Property for sale &amp; rent in Dubai | betterhomes</h1>
      <p>Search apartments, villas and townhouses across Dubai with betterhomes, the UAE's trusted real estate agency since 1986.</p>
```

**Option 3 — Hand-blend (write a new line that takes the best of both).** Often the right call. For example, keep the punchy marketing headline but fold in the SEO keywords:

```html
      <h1>Property for sale &amp; rent in Dubai — your dream address starts here | betterhomes</h1>
      <p>Search apartments, villas and townhouses across Dubai with betterhomes — exclusive listings, sharp negotiation and zero hassle from viewing to handover. The UAE's trusted real estate agency since 1986.</p>
```

Whichever you pick, **all six marker lines must be gone** (`<<<<<<<`, `=======`, `>>>>>>>` plus the content you rejected). If any marker survives, you've shipped broken HTML.

### Finish the merge

```bash
git add index.html
git commit
```

git pre-fills a merge commit message (`Merge branch 'feature/seo-hero' into develop`). Save and close the editor and the merge is complete. (Running `git commit` with no `-m` is fine here — accept the default message.)

---

## 3. Conflict B — brand colour in `css/styles.css` `:root`

`develop` already has `feature/rebrand-crimson`, which set the brand colour variables to crimson. The open `feature/rebrand-navy` branch sets the **same** variables to navy. Same lines, two answers → conflict.

### Reproduce it locally

```bash
git switch develop
git pull
git merge feature/rebrand-navy
```

```text
Auto-merging css/styles.css
CONFLICT (content): Merge conflict in css/styles.css
Automatic merge failed; fix conflicts and then commit the result.
```

### The exact markers git inserts

Open `css/styles.css`, find the `:root` block:

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

### How to read the markers

- `HEAD` side (ours) = the **crimson** values already on `develop`.
- `feature/rebrand-navy` side (theirs) = the **navy** values from the incoming PR.

### Three ways to resolve

**Option 1 — Keep ours (crimson stays):**

```css
  --brand-primary: #c8102e;        /* refreshed crimson */
  --brand-primary-dark: #8f0a20;
  --brand-accent: #f0a500;
```

**Option 2 — Keep theirs (navy wins):**

```css
  --brand-primary: #0a2540;        /* navy rebrand */
  --brand-primary-dark: #061829;
  --brand-accent: #f5b800;
```

**Option 3 — Hand-blend (mix the two palettes deliberately).** For example, navy primary but keep the warmer crimson-era accent:

```css
  --brand-primary: #0a2540;        /* navy rebrand */
  --brand-primary-dark: #061829;
  --brand-accent: #f0a500;         /* kept the warmer accent */
```

Again: every marker line and the rejected content must be deleted.

### Finish the merge

```bash
git add css/styles.css
git commit
```

> **Note:** `feature/whatsapp-button` would merge into this same `develop` with **no conflict at all** — it only appends CSS at the end of `styles.css` and never touches `:root`. You'd just run `git merge feature/whatsapp-button` and git would complete the merge by itself.

---

## 4. Resolving the same conflict in the GitHub UI

You don't always need a terminal. For simple text conflicts, GitHub's web editor is enough.

1. **Open the PR.** Go to the open pull request (e.g. `feature/seo-hero → develop`).

2. **Spot the banner.** Near the bottom of the PR's **Conversation** tab, in the merge box, GitHub shows:

   > **This branch has conflicts that must be resolved**

   The green "Merge pull request" button is disabled while this banner is showing.

3. **Click "Resolve conflicts."** The button sits next to the banner. It opens GitHub's **web conflict editor**, listing each conflicted file.

4. **Edit out the markers.** For each file, the editor shows the same markers you'd see locally:

   ```html
   <<<<<<< develop
         <h1>Your dream Dubai address starts here</h1>
         ...
   =======
         <h1>Property for sale &amp; rent in Dubai | betterhomes</h1>
         ...
   >>>>>>> feature/seo-hero
   ```

   Delete the version you don't want (or hand-blend), and **delete all three marker lines** (`<<<<<<<`, `=======`, `>>>>>>>`). The editor won't let you continue while markers remain.

   > In the GitHub UI the HEAD side is labelled with the **base branch name** (`<<<<<<< develop`) rather than the literal word `HEAD`, but it means the same thing — that's "ours."

5. **Mark as resolved.** Once a file is clean, click **"Mark as resolved"** (top-right of that file). Repeat for every conflicted file until all are marked.

6. **Commit the merge.** Click **"Commit merge."** GitHub creates a merge commit on the PR branch that reconciles it with the base. The conflict banner disappears, the merge button re-enables, and you can merge the PR normally.

---

## 5. Handy commands cheatsheet

```bash
# I'm mid-merge and want to bail out completely — undo the merge,
# put the working tree back exactly as it was before I ran git merge.
git merge --abort

# What's going on right now? Lists "Unmerged paths" — the files
# still containing conflict markers that you need to fix.
git status

# Show me exactly what conflicts. During a conflict, this highlights
# the conflicting hunks from both sides.
git diff

# Shortcut resolutions without hand-editing (use deliberately):
git checkout --ours   index.html   # keep HEAD / current-branch version
git checkout --theirs index.html   # keep the incoming branch version
# (then: git add index.html)

# Set up a visual 3-way merge tool (vimdiff, meld, vscode, etc.),
# then launch it on the conflicted files:
git config --global merge.tool vscode
git mergetool

# Better conflict markers: zdiff3 adds a shared "base" section so you
# can see the common ancestor and exactly what each side changed.
git config --global merge.conflictstyle zdiff3
```

With `merge.conflictstyle zdiff3`, Conflict A would show a third section between the two sides — the original pre-change text both branches started from — making it far easier to see what each branch actually did:

```text
<<<<<<< HEAD
      (the marketing copy)
||||||| common ancestor
      (the original base hero copy)
=======
      (the SEO copy)
>>>>>>> feature/seo-hero
```

---

## 6. How to avoid painful conflicts

Conflicts are normal and harmless when small. They become painful when they're large, stale, and surprising. To keep them small:

- **Pull often.** Run `git switch develop && git pull` and rebase/merge your feature branch on top of the latest `develop` regularly. The longer your branch drifts, the bigger the eventual collision. The crimson-vs-navy conflict only got engineered because navy was started before crimson landed and never re-synced.

- **Keep PRs small and focused.** A PR that touches one section of one file rarely collides. A sprawling PR that rewrites the hero, the colours, and the layout collides with everything.

- **Communicate who owns which files / regions.** If you know a teammate is rewriting the hero copy this week, don't also rewrite it on a parallel branch — that's exactly how `marketing-hero` and `seo-hero` ended up fighting over the same `<h1>`. Agree up front who owns `:root`, who owns the hero, etc.

- **Merge or rebase incoming changes into your branch early**, before opening the PR — you'll resolve conflicts in your own time instead of blocking the merge.

- **Prefer additive changes where reasonable.** `feature/whatsapp-button` merges clean precisely because it **adds** code at the end of the file rather than rewriting existing lines. When you can append instead of edit-in-place, conflicts mostly disappear.

- **Land big shared-file changes first**, then rebase the smaller branches on top, so only one branch ever "owns" the contested lines at a time.

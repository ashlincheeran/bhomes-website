# Git & GitHub: A Beginner's Guide

A friendly, hands-on introduction to git and GitHub, using **this repo** — the
betterhomes website — as the running example. No prior experience assumed. Every
command below is copy-pasteable.

> Throughout, we'll refer to real branches in this repo: `main`, `develop`,
> `feature/marketing-hero`, `feature/seo-hero`, `feature/rebrand-crimson`,
> `feature/rebrand-navy`, and `feature/whatsapp-button`.

---

## 1. git vs GitHub (local vs remote)

These two get mixed up constantly, so let's be clear:

- **git** is a program that runs **on your computer**. It tracks the history of
  your files. It works completely offline. You could use git forever without an
  internet connection.
- **GitHub** is a **website** (a server on the internet) that *hosts* copies of
  git repositories so people can share them, review each other's work, and
  collaborate. GitLab and Bitbucket are alternatives that do the same job.

A useful mental picture:

```
   YOUR LAPTOP                          GITHUB.COM
   ───────────                          ──────────
   git (the tool)        push  ───►     ashlincheeran/bhomes-website
   your local repo       ◄─── pull      (the "remote" copy)
```

git is the engine. GitHub is one place you can park a copy of what the engine
produced. You do the work locally with git, then **push** it up to GitHub so
teammates can see it.

---

## 2. The core mental model

git moves your changes through **four areas**. Understanding these four boxes is
90% of "getting" git.

```
  Working Directory  →  Staging Area  →  Commit (in history)  →  Remote (GitHub)
  (files you edit)      (git add)        (git commit)            (git push)
```

1. **Working directory** — the actual files on disk that you open and edit
   (e.g. `index.html`, `css/styles.css`). This is your messy desk.
2. **Staging area** (also called the *index*) — a holding area where you place
   the specific changes you want to include in your next commit. You "stage"
   changes with `git add`. Think of it as putting items into a box before you
   seal it.
3. **Commit** — a permanent, named snapshot of the staged changes, saved into
   the project **history**. Each commit has a unique ID (a hash like `a1b2c3d`),
   an author, a date, and a message. History is a chain of these snapshots.
4. **Remote** — the copy on GitHub. You sync your local commits up to it with
   `git push`, and bring others' commits down with `git pull`.

The big idea: editing a file does **not** save it to git history. You must
`add` it (stage it), then `commit` it (snapshot it). Until you commit, git isn't
really tracking your change as part of the project's story.

---

## 3. Everyday commands

These are the commands you'll run dozens of times a day.

### Clone — get a copy of a repo onto your machine

```bash
git clone https://github.com/ashlincheeran/bhomes-website.git
cd bhomes-website
```

This downloads the entire project **and its full history**, and automatically
sets up a remote named `origin` pointing back at GitHub.

### Status — "what's going on right now?"

```bash
git status
```

Your most-used command. It tells you which branch you're on, which files you've
changed, and which changes are staged vs unstaged. Run it constantly.

### Add — stage changes for the next commit

```bash
# Stage one file
git add index.html

# Stage everything you've changed
git add .
```

### Commit — snapshot the staged changes into history

```bash
git commit -m "Update hero heading on the homepage"
```

Write the message in the present tense, describing *what the change does*. A
good message is a gift to future-you.

### Log — view the history

```bash
# Full history, newest first
git log

# Compact one-line-per-commit view (much easier to read)
git log --oneline

# Show the branch/merge structure as a graph
git log --oneline --graph --all
```

### Diff — see exactly what changed

```bash
# Changes you've made but NOT yet staged
git diff

# Changes you've staged (what will go into the next commit)
git diff --staged

# Compare two branches — e.g. what does seo-hero change vs develop?
git diff develop feature/seo-hero
```

A typical loop looks like this:

```bash
git status              # what changed?
git diff                # show me the actual edits
git add index.html      # stage the file I'm happy with
git commit -m "Rewrite homepage hero copy"
```

---

## 4. Remotes: origin, fetch, pull, push

A **remote** is a named bookmark pointing at a copy of the repo somewhere else
(usually on GitHub). When you `clone`, git creates one called **`origin`** for
you automatically.

```bash
# List your remotes and their URLs
git remote -v
# origin  https://github.com/ashlincheeran/bhomes-website.git (fetch)
# origin  https://github.com/ashlincheeran/bhomes-website.git (push)
```

Three commands move commits between you and the remote:

### fetch — download remote changes, but don't touch your files

```bash
git fetch origin
```

Safe and non-disruptive. It updates git's knowledge of what's on GitHub (your
"remote-tracking branches") without changing your working directory.

### pull — fetch **and** merge into your current branch

```bash
git pull
```

`git pull` is essentially `git fetch` followed by `git merge`. Use it to bring
your local branch up to date with the remote — e.g. to grab teammates' newly
merged work on `develop`.

### push — upload your commits to the remote

```bash
git push
```

The **first** time you push a brand-new branch, git doesn't yet know where to
send it. Use the `-u` flag (short for `--set-upstream`) to link your local
branch to a remote branch of the same name:

```bash
# First push of a new branch
git push -u origin feature/whatsapp-button
```

The `-u` part means "remember this connection." After that, plain `git push`
and `git pull` will just work for that branch — git knows the upstream.

---

## 5. Branches

### What a branch actually is

A branch is **a movable pointer to a commit** — nothing more. It's astonishingly
lightweight (just a tiny file containing one commit ID). When you make a new
commit on a branch, the pointer simply slides forward to the new commit.

```
              feature/seo-hero
                     │
   A ── B ── C ──────D
             │
           develop
```

Here `develop` points at commit `C`, and `feature/seo-hero` points at `D`. Same
history up to `C`, then they diverge.

### Creating and switching branches

```bash
# Create a new branch AND switch to it (modern, recommended)
git switch -c feature/whatsapp-button

# Switch to an existing branch
git switch develop

# The older syntax you'll still see everywhere does the same thing:
git checkout -b feature/whatsapp-button   # create + switch
git checkout develop                       # switch

# Just create a branch without switching to it
git branch feature/whatsapp-button

# List all branches (* marks the one you're on)
git branch
```

> `git switch` is the newer, clearer command for changing branches.
> `git checkout` is the older command that does branch-switching *and* a bunch
> of other things, which is why it can be confusing. Either works.

### Why teams use branches

Branches let people work in parallel without stepping on each other. In this
repo, every feature lives on its own branch off the base site:

- `feature/marketing-hero` — rewrites the homepage hero to marketing copy.
- `feature/seo-hero` — rewrites the *same* hero to SEO-friendly copy.
- `feature/rebrand-crimson` — changes the brand colours in `css/styles.css`.
- `feature/rebrand-navy` — changes those *same* colours to navy.
- `feature/whatsapp-button` — adds a floating WhatsApp button.

Each developer commits freely on their own branch. Nothing reaches the live site
(`main`) until it's been reviewed and merged. The `develop` branch is the shared
**integration** branch where reviewed features land *before* `main`.

---

## 6. The GitHub side: forks, pull requests, review, merging

### Forking vs cloning

- **Clone**: copy a repo to *your computer*. You do this to any repo you want to
  work on.
- **Fork**: make your own copy of someone else's repo *on GitHub*, under your
  account. You fork when you don't have write access to the original (common in
  open source): you fork it, clone *your fork*, push to *your fork*, then open a
  pull request back to the original.

For a team repo you already have access to (like this one), you usually skip
forking: you just clone, branch, and push directly.

### Pull requests (PRs)

A **pull request** is a GitHub feature that says: *"I have some commits on this
branch — please review them and consider merging them into that branch."* It's
the heart of team collaboration.

Every PR has two branches:

- **base** — the branch you want your changes to *go into* (the destination).
- **compare** / **head** — the branch that *holds your changes* (the source).

For example, opening a PR for the WhatsApp button:

```
  base: develop   ◄──   compare/head: feature/whatsapp-button
  (merge INTO this)       (these are my changes)
```

You'd create that PR from the command line with the GitHub CLI like so:

```bash
# Push your branch first
git push -u origin feature/whatsapp-button

# Open a PR: --base is the destination, --head is your branch
gh pr create --base develop --head feature/whatsapp-button \
  --title "Add floating WhatsApp button" \
  --body "Adds a floating WhatsApp contact button to every page."
```

### Code review

Once a PR is open, teammates read the diff, leave comments, request changes, or
approve. You respond by pushing **more commits to the same branch** — the PR
updates automatically. This back-and-forth is *code review*, and it's how teams
catch bugs and share knowledge before code goes live.

### Merging a PR

When the PR is approved, someone merges it. That takes all the commits from the
head branch and combines them into the base branch:

```bash
gh pr merge feature/whatsapp-button --merge
```

In this repo, `feature/marketing-hero` and `feature/rebrand-crimson` have
already been reviewed and **merged into `develop`**. The other feature branches
have **open PRs** still waiting.

### When merges conflict (a preview)

Two of the open PRs in this repo **conflict** with `develop`, and one merges
cleanly — and the difference teaches the single most important merge lesson:

- `feature/whatsapp-button` touches `css/styles.css`, the **same file** that the
  already-merged rebrand changed — but it edits **different lines** (it appends
  new CSS at the end). git merges it automatically. **No conflict.**
- `feature/rebrand-navy` edits the **same lines** in `css/styles.css` that
  `feature/rebrand-crimson` (already on `develop`) changed. git can't decide
  which colour wins, so it stops and asks you. **Conflict.**
- `feature/seo-hero` rewrites the **same hero lines** in `index.html` that
  `feature/marketing-hero` (already on `develop`) rewrote. **Conflict.**

> **The rule:** same *file* is fine. Same *lines* changed two different ways is a
> conflict. Resolving conflicts is covered step-by-step in
> `CONFLICT-WALKTHROUGH.md`.

---

## 7. Keeping a branch up to date: merge vs rebase

While you work on a feature branch, `develop` keeps moving as other PRs get
merged. Eventually you'll want your branch to include that newer work. There are
two ways.

### Option A: merge develop into your branch

```bash
git switch feature/seo-hero
git fetch origin
git merge origin/develop
```

This creates a **merge commit** that ties the two histories together. It's safe,
honest about what happened, and never rewrites existing commits. Downside: the
history can get a bit noisy with merge commits.

### Option B: rebase your branch onto develop

```bash
git switch feature/seo-hero
git fetch origin
git rebase origin/develop
```

Rebase **replays** your commits one by one *on top of* the latest `develop`,
producing a clean, straight-line history as if you'd started from today's
`develop`. Downside: it **rewrites your branch's commits** (they get new IDs).

### Practical guidance for beginners

- On your own un-shared feature branch, **rebase** for a tidy history if your
  team likes that — otherwise **merge** is the safe default.
- **Golden rule:** never rebase commits that other people have already pulled
  from a shared branch. Rewriting shared history causes painful messes.
- When in doubt, use `merge`. It's the forgiving choice.

Either way, if your branch touches the same lines as `develop`, you'll hit a
conflict during the merge/rebase — see `CONFLICT-WALKTHROUGH.md`.

---

## 8. Glossary

- **HEAD** — a pointer to "where you are right now," i.e. the commit your working
  directory is based on. Normally HEAD points at the tip of your current branch.
  After `git switch develop`, HEAD points at `develop`.

- **upstream** — the remote branch your local branch is linked to (its tracking
  branch). Set with `git push -u origin <branch>`. Once set, plain `git push` /
  `git pull` know where to go.

- **fast-forward** — the simplest kind of merge. If the destination branch hasn't
  changed since you branched off it, git just slides its pointer forward to your
  commits — no merge commit needed, because nothing diverged. Many clean merges
  are fast-forwards.

- **detached HEAD** — the state you're in when HEAD points directly at a specific
  commit instead of a branch (e.g. after `git checkout <commit-hash>`). You can
  look around, but new commits won't belong to any branch and can be lost. To get
  back, just switch to a real branch: `git switch develop`.

- **stash** — a way to temporarily shelve uncommitted changes so you can switch
  branches with a clean working directory, then bring them back later.
  ```bash
  git stash        # shelve your current changes
  git switch develop
  # ...do something...
  git switch -      # go back to your branch
  git stash pop     # restore the shelved changes
  ```

- **.gitignore** — a file listing patterns for files git should **not** track
  (build output, secrets, `node_modules/`, OS junk like `.DS_Store`). Anything
  matching is invisible to `git status` and `git add`.
  ```gitignore
  # example .gitignore entries
  node_modules/
  .DS_Store
  *.log
  ```

- **origin** — the default name git gives the remote you cloned from.

- **commit hash** — the unique ID of a commit (e.g. `a1b2c3d`). You can refer to
  a commit by the first few characters.

---

## Next

You now have the foundations. To go deeper into how this repo is organised and
how to handle the conflicts above:

- **`BRANCHING-STRATEGY.md`** — how `main`, `develop`, and the `feature/*`
  branches fit together, and the workflow for shipping a change to the live site.
- **`CONFLICT-WALKTHROUGH.md`** — a hands-on, step-by-step guide to reproducing
  and resolving the real merge conflicts in `feature/seo-hero` and
  `feature/rebrand-navy`.

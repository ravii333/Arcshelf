# Contributing to ArcShelf

Thanks for your interest in improving ArcShelf! 🎓 This project is built by students,
for students, and contributions are very welcome.

**Every change reaches the main project through a reviewed Pull Request.** Nothing is
merged into `main` without the maintainer's approval — this keeps the project stable and
safe for everyone who relies on it.

## The contribution flow

1. **Fork** this repository to your own GitHub account (the "Fork" button, top-right).
2. **Clone your fork** and create a branch for your change:
   ```bash
   git clone https://github.com/<your-username>/Arcshelf.git
   cd Arcshelf
   git checkout -b feat/short-description
   ```
3. **Make your changes.** Keep them focused — one logical change per PR is easier to review.
4. **Run the checks locally** before pushing (see below).
5. **Commit and push** to your fork:
   ```bash
   git commit -m "feat: short description of the change"
   git push origin feat/short-description
   ```
6. **Open a Pull Request** from your fork's branch to `ravii333/Arcshelf` `main`.
   Fill in the PR template.
7. **Review & approval.** The maintainer reviews your PR. Automated checks (lint + build)
   must pass, and the maintainer must **approve** before it can be merged. You may be asked
   for changes — just push more commits to the same branch and the PR updates automatically.
8. Once approved and green, the maintainer merges it. 🎉

> You cannot push directly to this repository, and you cannot merge your own PR — that is by
> design. Your fork is yours to change freely; the canonical project only accepts approved PRs.

## Running the checks locally

**Client**
```bash
cd client
npm ci
npm run lint      # must pass
npm run build     # must succeed
```

**Server**
```bash
cd server
npm ci
npm run dev       # should boot without errors (needs a local .env — see server/.env.example)
```

## Guidelines

- **Match the existing style** — look at nearby code before adding new patterns.
- **Don't commit secrets.** Never add a real `.env`; use `server/.env.example` as the reference.
- **Keep PRs small and focused.** Large, mixed PRs are hard to review and slow to approve.
- **Describe the "why."** A clear PR description gets reviewed faster.
- For big features or changes, **open an issue first** to discuss the approach before writing code.

## Reporting bugs / ideas

Open an [issue](https://github.com/ravii333/Arcshelf/issues) describing the problem or idea,
with steps to reproduce where relevant. Thank you for helping students learn and grow! 💚

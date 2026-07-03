# Publishing & Hosting Glasswind

This is your end-to-end checklist to take Glasswind from local code → **npm** (so anyone can `npm install glasswind`) → **GitHub** (public source) → **Vercel** (docs website on your own domain).

---

## Part 1 — Publish the package to npm

So that `npm install glasswind` works for everyone.

### 1. Create an npm account
Sign up at [npmjs.com/signup](https://www.npmjs.com/signup) (free). Verify your email.

### 2. Log in from your terminal
```bash
npm login
```
Enter your username, password, and the one-time code from your email/authenticator.

### 3. Confirm the package name is free
```bash
npm view glasswind
```
If you get **404 Not Found**, the name is available. ✅ (As of setup, `glasswind` was free.)

### 4. Build the library
```bash
npm install       # first time only — installs dev dependencies
npm run build     # produces dist/ (index.js, index.cjs, index.d.ts, styles.css)
```

### 5. Do a dry run (see exactly what will be published)
```bash
npm publish --dry-run
```
You should see `dist/`, `README.md`, and `LICENSE` — and NOT `src/`, `node_modules/`, or `playground/` (the `.npmignore` handles this).

### 6. Publish 🚀
```bash
npm publish --access public
```
Done — it's live at `https://www.npmjs.com/package/glasswind`.

### 7. Shipping updates later
Bump the version (semantic versioning), then publish again:
```bash
npm version patch   # 0.1.0 -> 0.1.1 (bug fixes)
npm version minor   # 0.1.0 -> 0.2.0 (new components, backwards compatible)
npm version major   # 0.1.0 -> 1.0.0 (breaking changes)
npm publish
```
`npm version` also creates a git commit + tag automatically.

---

## Part 2 — Put the source on GitHub (public)

### 1. Initialize git & commit
```bash
git init
git add .
git commit -m "Initial commit: Glasswind component library"
```

### 2. Create a public repo
- Go to [github.com/new](https://github.com/new), name it `glasswind`, choose **Public**, and **don't** add a README/license (you already have them).

### 3. Push
```bash
git remote add origin https://github.com/<your-username>/glasswind.git
git branch -M main
git push -u origin main
```

### 4. Update the links in `package.json`
Replace `your-username` in the `homepage`, `repository`, and `bugs` fields with your real GitHub username, then commit.

---

## Part 3 — Host a docs website on Vercel (your own domain)

You have two good options for the site itself:

**Option A — Docs site with a framework (recommended).**
Later, scaffold a docs site (e.g. Next.js, Astro, or [Nextra](https://nextra.site)) in a `site/` or `docs-site/` folder that imports `glasswind` and shows live examples. Then:

1. Push it to the same GitHub repo (or a separate one).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → **Import** your GitHub repo.
3. Vercel auto-detects the framework, runs the build, and deploys. Every `git push` re-deploys automatically.

**Option B — Deploy the playground quickly.**
The existing Vite playground can be deployed as-is for a fast live demo:
- Framework preset: **Vite**
- Build command: `npm run build` isn't needed for the playground; instead set build command to `vite build` and output dir to `playground/dist`. (Or add a `build:playground` script.)

### Connecting your custom domain
1. Buy a domain (Vercel sells them directly under **Domains**, or use any registrar — Namecheap, GoDaddy, etc.).
2. In your Vercel project → **Settings → Domains → Add**, enter your domain.
3. If bought through Vercel, it's auto-configured. If bought elsewhere, Vercel shows you the DNS records (an `A` record or `CNAME`) to add at your registrar.
4. HTTPS/SSL is provisioned automatically. 🎉

---

## Quick reference

| Goal | Command / place |
|------|-----------------|
| Anyone can install it | `npm publish --access public` |
| Public source code | GitHub public repo |
| Live docs on your domain | Vercel + custom domain |
| Ship an update | `npm version <patch\|minor\|major>` → `npm publish` |

> Tip: Once the repo is on GitHub, add a **GitHub Action** to auto-publish to npm on every version tag. Ask and I'll set it up.

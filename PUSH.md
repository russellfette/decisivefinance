# Decisive Finance — push and deploy instructions

The Astro site is built, committed on `main`, and ready to push. You need to do three things yourself because they require interactive steps I can't run for you.

---

## Step 1. Authenticate GitHub (2 min)

Open Terminal and run:

```
gh auth login
```

Answer the prompts:
- **Where do you use GitHub?** → `GitHub.com` → Enter
- **Preferred protocol?** → `HTTPS` → Enter
- **Authenticate Git with your GitHub credentials?** → `Yes` → Enter
- **How would you like to authenticate?** → `Login with a web browser` → Enter
- Copy the one-time code shown, press Enter, your browser opens, paste the code, approve.

When you see `✓ Authentication complete` you're done.

---

## Step 2. Push the site (1 min)

Copy-paste this whole block into Terminal:

```
cd ~/Projects/decisivefinance
git push -u origin main
```

You should see a progress bar and then `branch 'main' set up to track 'origin/main'`.

Your code is now on GitHub at https://github.com/russellfette/decisivefinance.

---

## Step 3. Connect Cloudflare Pages (5 min)

This replaces the Worker you were using before. Pages is the right tool for a static site + auto-deploy on every git push.

1. Open https://dash.cloudflare.com/ in your browser.
2. Workers & Pages (left sidebar) → **Create** → **Pages** tab → **Connect to Git**.
3. Authorize Cloudflare to see your GitHub repos → pick `russellfette/decisivefinance`.
4. **Set up builds and deployments:**
    - **Project name:** `decisivefinance` (or whatever you want — this becomes the `*.pages.dev` subdomain)
    - **Production branch:** `main`
    - **Build command:** `npm run build`
    - **Build output directory:** `dist`
    - **Node version:** `20` or higher (set under Environment variables: `NODE_VERSION = 20`)
5. **Save and Deploy.** First build takes ~90 seconds.

When it's green, click the `*.pages.dev` URL to spot-check.

---

## Step 4. Attach the custom domain (5 min)

On the Cloudflare Pages project page:

1. **Custom domains** tab → **Set up a custom domain**.
2. Enter `decisive.finance` → **Continue** → **Activate domain**.
3. Cloudflare detects your DNS (since you already manage the domain there) and updates records. Takes 1-5 minutes.
4. Also add `www.decisive.finance` so both hostnames route to the same site.

While you're in DNS, **disable the old Worker route** that points `bitter-waterfall-db83` at the domain. Otherwise Cloudflare routes requests to the Worker first, not Pages.

- Cloudflare dash → **Workers & Pages** → `bitter-waterfall-db83` → **Triggers** → **Custom Domains / Routes** → remove any `decisive.finance` entry.

---

## Step 5. Post-launch smoke test

Open each of these in an incognito window:

- `https://decisive.finance/` — home, dark hero, six traps section, three tiers, orange Book a call button in nav
- `https://decisive.finance/blog/` — 18 posts listed, 4 featured at top
- `https://decisive.finance/blog/walking-dead-portco/` — hero hub, pubDate Feb 10, 2026
- `https://decisive.finance/guarantee/` — Canon v2 copy ("three ways the guarantee resolves")
- `https://decisive.finance/glossary/` — ten terms
- `https://decisive.finance/assessment/walking-dead/` — self-assessment body
- `https://decisive.finance/resources/recovery-checklist/` — checklist body
- `https://decisive.finance/recovery-engine` — should 301 to `/#tiers`
- `https://decisive.finance/404` — "This page is not where the forward capital is."

---

## What's in this repo

```
~/Projects/decisivefinance/
├── astro.config.mjs           Astro config (sitemap, MDX)
├── package.json               deps: astro, @astrojs/mdx, sitemap, rss
├── src/
│   ├── content/
│   │   ├── config.ts          content collection schemas
│   │   ├── blog/              18 posts (Canon v1 voice — Phase C pending)
│   │   ├── case-studies/      1 case study
│   │   └── site/              glossary, self-assessment, recovery checklist
│   ├── components/
│   │   ├── Nav.astro          sticky nav, Book a call CTA
│   │   ├── Footer.astro       Canon v2 footer with 4 columns
│   │   └── CTABlock.astro     reusable CTA component (not yet wired to all posts)
│   ├── layouts/
│   │   └── BaseLayout.astro   head, meta, sitewide JSON-LD, nav, footer slot
│   ├── styles/
│   │   └── global.css         design system (ported from dist-publish)
│   └── pages/
│       ├── index.astro        home — Canon v2 §2a
│       ├── guarantee.astro    guarantee — Canon v2 §2b
│       ├── about.astro        team page (3 bios)
│       ├── contact.astro      Calendly + email
│       ├── blog/              blog index + [slug] template + rss.xml.js
│       ├── results/           case-study index + [slug] template
│       ├── assessment/walking-dead.astro
│       ├── resources/recovery-checklist.astro
│       ├── glossary.astro
│       ├── privacy.astro, terms.astro, thank-you.astro
│       └── 404.astro, 500.astro
└── public/
    ├── _redirects             301s for retired routes
    ├── robots.txt
    ├── favicon.svg
    └── og/default.svg         fallback OG image
```

---

## Known deferrals (do not block launch)

1. **OG image is SVG.** LinkedIn and Twitter sometimes don't render SVG. Generate a PNG version at `public/og/default.png` (1200×630) and flip BaseLayout back to `.png`. Can happen post-launch.
2. **Post-specific OG images.** All 18 posts point at the fallback. Batch-generate per `launch-assets/press/og-image-prompts.md` when you have a minute.
3. **CTA system per-cluster.** `CTABlock.astro` is scaffolded. Blog posts don't yet call it. Phase C work.
4. **Blog post voice (Phase C).** 18 posts still use Canon v1 "trapped capital" language in prose. See `canon-v2-staging/REPLACEMENT-REPORT.md` for the list of hits. Voice pass is your human judgment call.
5. **Lighthouse and LinkedIn inspector audits.** Run after Cloudflare Pages deploys.

---

## If something breaks

**Build fails on Cloudflare Pages:** check the build log. Most common cause is a Node version mismatch — confirm `NODE_VERSION = 20` in Pages environment variables.

**A redirect doesn't work:** check `public/_redirects` ships to `dist/_redirects`. Cloudflare Pages honors that file automatically.

**A page 404s that shouldn't:** Astro needs trailing-slash consistency. All routes here build as `/path/index.html`, so `decisive.finance/guarantee/` works; `decisive.finance/guarantee` may redirect.

**You need to iterate on copy:** edit the `.astro` file, `npm run build`, `git add -A && git commit -m "..." && git push`. Cloudflare Pages auto-deploys in ~60 seconds.

---

## Preview locally any time

```
cd ~/Projects/decisivefinance
npm run dev
```

Open http://localhost:4321/.

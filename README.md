# Project Brainless website

Static site for the Project Brainless SCP: Secret Laboratory server: home/about, rules, appeals and a live leaderboard. Plain HTML/CSS/JS with no build step, so it works on GitHub Pages (or any static host).

## Edit your links

Everything community-specific lives in [`assets/js/config.js`](assets/js/config.js):

| Setting | What it is |
| --- | --- |
| `discordUrl` | Your Discord invite link (set it to never expire) |
| `appealsUrl` | Your appeal form or ticket link |
| `serverAddress` | IP:port shown on the home page with a copy button |
| `statsApiUrl` | Core stats API, e.g. `https://api.yourdomain.com`. Empty shows sample leaderboard data |

Rules are in [`rules.html`](rules.html); edit the lists directly. Page text is in the other `.html` files.

## Publish on GitHub Pages

1. Repository **Settings → Pages**.
2. **Source:** Deploy from a branch → `main` → `/ (root)` → Save.
3. After a minute the site is live at `https://swishhyy.github.io/BrainlessWebsite/`.
4. Optional custom domain: enter it on the same page (e.g. `www.yourdomain.com`), then add a `CNAME` DNS record pointing to `swishhyy.github.io`. If the domain is on Cloudflare, leave that record **DNS only** (grey cloud) until GitHub has issued the certificate.

## Live leaderboard

The leaderboard reads `GET {statsApiUrl}/api/v1/leaderboard?sort=xp|playtime&limit=100` from the Core plugin's stats API. Set it up with the guide in `BrainlessProjectPlugins/discord-bot/README.md`, then:

- set `statsApiUrl` in `assets/js/config.js`;
- set `stats_api.allowed_origin` in the Core config to this site's address (e.g. `https://swishhyy.github.io`) so browsers may read it.

The table refreshes every minute. Players who opted out of tracking never appear.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

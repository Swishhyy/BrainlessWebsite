# Project Brainless website

Static site for the Project Brainless SCP: Secret Laboratory server: home/about, rules, appeals and a live leaderboard. Plain HTML/CSS/JS in [`public/`](public) with no build step, deployed as a Cloudflare Workers static site ([`wrangler.jsonc`](wrangler.jsonc)).

## Edit your links

Everything community-specific lives in [`public/assets/js/config.js`](public/assets/js/config.js):

| Setting | What it is |
| --- | --- |
| `discordUrl` | Your Discord invite link (set it to never expire) |
| `appealsUrl` | Your appeal form or ticket link |
| `serverAddress` | IP:port shown on the home page with a copy button |
| `statsApiUrl` | Core stats API, e.g. `https://api.yourdomain.com`. Empty shows sample leaderboard data |

Rules are in [`public/rules.html`](public/rules.html); edit the lists directly. Page text is in the other `.html` files in `public/`.

## Deploy (Cloudflare)

The Cloudflare project builds from `main` with:

- **Build command:** none
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`

`wrangler.jsonc` uploads the `public/` folder; unknown paths show `404.html`. Every push to `main` redeploys. The Worker `name` in `wrangler.jsonc` must match the project name in the Cloudflare dashboard (`brainlesswebsite`).

Custom domain: Cloudflare dashboard → your Worker → **Settings → Domains & Routes → Add → Custom domain** (e.g. `yourdomain.com`).

## Live leaderboard

The leaderboard reads `GET {statsApiUrl}/api/v1/leaderboard?sort=xp|playtime&limit=100` from the Core plugin's stats API. Set it up with the [Stats API guide](https://github.com/Swishhyy/BrainlessProjectPlugins/blob/main/docs/STATS_API.md), then:

- set `statsApiUrl` in `public/assets/js/config.js`;
- set `stats_api.allowed_origin` in the Core config to this site's address (e.g. `https://yourdomain.com` or the `*.workers.dev` address) so browsers may read it.

The table refreshes every minute. Players who opted out of tracking never appear.

## Preview locally

```bash
python3 -m http.server 8000 --directory public
```

Then open http://localhost:8000.

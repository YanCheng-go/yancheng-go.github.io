# Yan Cheng's Personal Website

Dark, terminal-themed personal portfolio built with pure HTML/CSS/JS. No frameworks, no build step.

**Live:** [yancheng-go.github.io](https://yancheng-go.github.io)

## Features

- **Terminal boot sequence** with typed role animation and particle canvas
- **Route map** — SVG world map with animated travel routes
- **Cat/Dog vote** — real-time voting backed by Supabase, with a CSS-drawn pet toggle
- **Neko desktop pet** — cursor-following cat/dog that chases, idles, and sleeps
- **Auto-sync** — GitHub Actions weekly syncs GitHub profile (repos, stars, followers) and Google Scholar (publications, citations, h-index)
- **Publication list** — auto-categorized by keywords, sorted by citations, paginated
- **Multi-language** — English, Chinese, Danish with localStorage persistence
- **Scroll reveal** animations via IntersectionObserver
- **Responsive** dark design with CSS custom properties

## Tech Stack

| Layer | Tools |
|-------|-------|
| Markup | HTML5, SVG |
| Styling | CSS3 (custom properties, grid, animations) |
| Scripts | Vanilla JS (no dependencies) |
| Fonts | JetBrains Mono, Inter (Google Fonts) |
| Icons | Font Awesome 6 |
| Voting backend | Supabase (PostgreSQL + REST API) |
| Data sync | Bash + GitHub Actions (weekly cron) |
| Hosting | GitHub Pages |

## Project Structure

```
index.html              # Single-page site
assets/
  css/modern.css        # All styles
  js/modern.js          # All scripts (particles, boot, neko, i18n, vote, etc.)
  img/                  # Images and thumbnails
scripts/
  sync-github.sh        # Fetches GitHub + Google Scholar data, updates index.html
.github/workflows/
  sync-github.yml       # Weekly GitHub Actions workflow
blogs/                  # Blog posts and talk slides
```

## Auto-Sync

The sync script (`scripts/sync-github.sh`) runs weekly via GitHub Actions and updates:

- GitHub bio, repo count, followers
- Pinned repositories (via GraphQL)
- Recently active repos
- Google Scholar publications, citations, h-index
- Auto-categorized publication tags (deep-learning, remote-sensing, climate, etc.)

Content is injected between `<!-- SYNC:*_START -->` / `<!-- SYNC:*_END -->` markers in `index.html`.

## Local Development

```bash
# Serve locally
python3 -m http.server 8000

# Run sync manually (requires GITHUB_TOKEN)
GITHUB_TOKEN=your_token bash scripts/sync-github.sh
```

## License

Yan Cheng reserves the copyright of all contents in this repository.
You are welcome to clone and customize it to create your own website.

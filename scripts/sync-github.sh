#!/usr/bin/env bash
set -euo pipefail

# Sync GitHub profile data into index.html
# Called by GitHub Actions weekly, or manually

USERNAME="YanCheng-go"
FILE="index.html"
API="https://api.github.com"

# ---- Fetch data ----

PROFILE=$(curl -sf "$API/users/$USERNAME")

REPOS=$(curl -sf "$API/users/$USERNAME/repos?per_page=100&sort=pushed&direction=desc")

PINNED=$(curl -sf -H "Authorization: bearer $GITHUB_TOKEN" \
  -X POST "$API/graphql" \
  -d '{"query":"{ user(login: \"'"$USERNAME"'\") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name description url stargazerCount primaryLanguage { name } } } } } }"}')

# ---- Parse profile ----

BIO=$(echo "$PROFILE" | jq -r '.bio // "" | gsub("\r\n"; ", ") | gsub("\n"; ", ")')
REPOS_COUNT=$(echo "$PROFILE" | jq -r '.public_repos')
FOLLOWERS=$(echo "$PROFILE" | jq -r '.followers')
LOCATION=$(echo "$PROFILE" | jq -r '.location // "Earth"')

# ---- Build stats line ----

STATS_HTML="          <span class=\"terminal-output\">&gt; ${REPOS_COUNT} public repos · ${FOLLOWERS} followers</span>"

# ---- Build bio line ----

BIO_HTML="          <span class=\"terminal-output\">&gt; ${BIO}</span>"

# ---- Build pinned repos HTML ----

PINNED_HTML=$(echo "$PINNED" | jq -r '
  .data.user.pinnedItems.nodes | to_entries | map(
    .value |
    "      <a class=\"oss-card reveal\" href=\"" + .url + "\" target=\"_blank\">\n" +
    "        <div class=\"oss-card-icon\">&#9733; " + (.stargazerCount | tostring) +
      (if .primaryLanguage.name then " · " + .primaryLanguage.name else "" end) +
    "</div>\n" +
    "        <h3>" + .name + "</h3>\n" +
    "        <p>" + (.description // "No description") + "</p>\n" +
    "      </a>"
  ) | join("\n\n")
')

PINNED_SECTION="    <div class=\"section-label reveal\" style=\"margin-top: 3rem; margin-bottom: 1.5rem;\">&#9733; pinned on github</div>

    <div class=\"oss-grid\">

${PINNED_HTML}

    </div>"

# ---- Build recent repos HTML ----

RECENT_HTML=$(echo "$REPOS" | jq -r '
  [.[] | select(.fork == false)] | .[:4] | to_entries | map(
    .value |
    "      <a class=\"oss-card reveal\" href=\"" + .html_url + "\" target=\"_blank\">\n" +
    "        <div class=\"oss-card-icon\">&#9733; " + (.stargazers_count | tostring) +
      (if .language then " · " + .language else "" end) +
      " · updated " + (.pushed_at | split("T")[0] | split("-") | .[0] + "-" + .[1]) +
    "</div>\n" +
    "        <h3>" + .name + "</h3>\n" +
    "        <p>" + (.description // "No description") + "</p>\n" +
    "      </a>"
  ) | join("\n\n")
')

RECENT_SECTION="    <div class=\"section-label reveal\" style=\"margin-bottom: 1.5rem;\">&#x276F; recently active</div>

    <div class=\"oss-grid\">

${RECENT_HTML}

    </div>"

# ---- Fetch Google Scholar data ----

SCHOLAR_USER="O6azk1oAAAAJ"
SCHOLAR_HTML=$(curl -sL "https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en&cstart=0&pagesize=100" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")

# Parse total citations and h-index
TOTAL_CITATIONS=$(echo "$SCHOLAR_HTML" | grep -o 'gsc_rsb_std">[^<]*' | head -1 | sed 's/gsc_rsb_std">//')
H_INDEX=$(echo "$SCHOLAR_HTML" | grep -o 'gsc_rsb_std">[^<]*' | head -3 | tail -1 | sed 's/gsc_rsb_std">//')

# Validate Scholar data before proceeding
if [ -z "$TOTAL_CITATIONS" ] || [ -z "$H_INDEX" ]; then
  echo "WARNING: Scholar scraping returned empty data. Skipping Scholar update."
  echo "TOTAL_CITATIONS='$TOTAL_CITATIONS' H_INDEX='$H_INDEX'"
  SKIP_SCHOLAR=true
fi

# Extract triples: title, citations, year
TITLES=$(echo "$SCHOLAR_HTML" | grep -o 'gsc_a_at">[^<]*' | sed 's/gsc_a_at">//' | sed "s/&#39;/'/g")
CITES=$(echo "$SCHOLAR_HTML" | grep -o 'gsc_a_ac gs_ibl">[^<]*' | sed 's/gsc_a_ac gs_ibl">//')
YEARS=$(echo "$SCHOLAR_HTML" | grep -o 'gsc_a_h gsc_a_hc gs_ibl">[^<]*' | sed 's/gsc_a_h gsc_a_hc gs_ibl">//')

if [ -z "$TITLES" ]; then
  echo "WARNING: No publication titles found from Scholar. Skipping Scholar update."
  SKIP_SCHOLAR=true
fi

PUB_COUNT=$(echo "$TITLES" | wc -l | tr -d ' ')

# Scholar stats for hero
SCHOLAR_STATS_HTML="          <span class=\"terminal-output\">&gt; ${PUB_COUNT} publications · ${TOTAL_CITATIONS} citations · h-index ${H_INDEX}</span>"

# Build publications sorted by citations desc, with auto-categorized tags
# Combine into tab-separated, sort by citation count descending, then generate HTML
SCHOLAR_SECTION=$(paste <(echo "$TITLES") <(echo "$CITES") <(echo "$YEARS") \
  | sort -t$'\t' -k2 -rn \
  | awk -F'\t' '
BEGIN {
  header = "    <div class=\"reveal\" style=\"margin-top: 3rem;\">\n"
  header = header "      <div class=\"section-label\">&#9998; publications · <a href=\"https://scholar.google.com/citations?user='"$SCHOLAR_USER"'&hl=en\" target=\"_blank\">google scholar</a></div>\n"
  header = header "      <p class=\"about-text\" style=\"margin-top: 0.5rem; margin-bottom: 1.5rem;\">'"$TOTAL_CITATIONS"' citations · h-index '"$H_INDEX"' · '"$PUB_COUNT"' publications</p>\n"
  header = header "    </div>\n\n    <div class=\"pub-list\">"
  print header
}
{
  title = $1
  cite = $2
  year = $3
  # Auto-categorize based on keywords in title
  tags = ""
  t = tolower(title)
  if (t ~ /deep learning|neural|unet|segmentation|detection/)  tags = tags "<span class=\"pub-tag\">deep-learning</span>"
  if (t ~ /computer vision|image|imagery|rgb/)                 tags = tags "<span class=\"pub-tag\">computer-vision</span>"
  if (t ~ /remote sensing|sentinel|planetscope|landsat|drone/) tags = tags "<span class=\"pub-tag\">remote-sensing</span>"
  if (t ~ /phenology|time series|seasonal|decomposition/)      tags = tags "<span class=\"pub-tag\">time-series</span>"
  if (t ~ /climate|drought|hazard/)                            tags = tags "<span class=\"pub-tag\">climate</span>"
  if (t ~ /tree|deadwood|forest|vegetation/)                   tags = tags "<span class=\"pub-tag\">ecology</span>"
  if (t ~ /gpu|processing unit|high-performance/)              tags = tags "<span class=\"pub-tag\">HPC</span>"
  if (t ~ /database|open-access|interactive/)                  tags = tags "<span class=\"pub-tag\">open-data</span>"
  if (t ~ /map|cartograph|treemap|visualiz/)                   tags = tags "<span class=\"pub-tag\">visualization</span>"
  if (t ~ /global|europe|california|kenya|boreal/)             tags = tags "<span class=\"pub-tag\">regional-study</span>"
  if (t ~ /planetscope/)                                       tags = tags "<span class=\"pub-tag\">PlanetScope</span>"
  if (t ~ /sentinel/)                                          tags = tags "<span class=\"pub-tag\">Sentinel-2</span>"
  if (tags == "") tags = "<span class=\"pub-tag\">research</span>"

  cite_val = (cite != "") ? cite : ""

  printf "      <div class=\"pub-item reveal\">\n"
  printf "        <span class=\"pub-year\">%s</span>\n", year
  printf "        <div class=\"pub-body\"><span class=\"pub-title\">%s</span><span class=\"pub-tags\">%s</span></div>\n", title, tags
  printf "        <span class=\"pub-cite\">%s</span>\n", cite_val
  printf "      </div>\n"
}
END {
  print "    </div>"
}
')

# ---- Write to temp files for perl replacement ----

TMPDIR=$(mktemp -d)
echo "$STATS_HTML" > "$TMPDIR/stats.txt"
echo "$BIO_HTML" > "$TMPDIR/bio.txt"
echo "$PINNED_SECTION" > "$TMPDIR/pinned.txt"
echo "$RECENT_SECTION" > "$TMPDIR/recent.txt"

# ---- Replace sections in index.html ----

# Always update GitHub data (stats, bio, pinned, recent)
perl -i -0777 -pe '
  BEGIN {
    local $/; open F, "'"$TMPDIR/stats.txt"'"; $stats = <F>; chomp $stats; close F;
    open F, "'"$TMPDIR/bio.txt"'"; $bio = <F>; chomp $bio; close F;
    open F, "'"$TMPDIR/pinned.txt"'"; $pinned = <F>; chomp $pinned; close F;
    open F, "'"$TMPDIR/recent.txt"'"; $recent = <F>; chomp $recent; close F;
  }
  s|(<!-- SYNC:STATS_START -->).*?(<!-- SYNC:STATS_END -->)|$1\n$stats\n          $2|s;
  s|(<!-- SYNC:BIO_START -->).*?(<!-- SYNC:BIO_END -->)|$1\n$bio\n          $2|s;
  s|(<!-- SYNC:PINNED_START -->).*?(<!-- SYNC:PINNED_END -->)|$1\n$pinned\n    $2|s;
  s|(<!-- SYNC:RECENT_START -->).*?(<!-- SYNC:RECENT_END -->)|$1\n$recent\n    $2|s;
' "$FILE"

# Only update Scholar data if scraping succeeded
if [ "${SKIP_SCHOLAR:-false}" != "true" ]; then
  echo "$SCHOLAR_SECTION" > "$TMPDIR/scholar.txt"
  echo "$SCHOLAR_STATS_HTML" > "$TMPDIR/scholar_stats.txt"

  perl -i -0777 -pe '
    BEGIN {
      local $/; open F, "'"$TMPDIR/scholar.txt"'"; $scholar = <F>; chomp $scholar; close F;
      open F, "'"$TMPDIR/scholar_stats.txt"'"; $sstats = <F>; chomp $sstats; close F;
    }
    s|(<!-- SYNC:SCHOLAR_START -->).*?(<!-- SYNC:SCHOLAR_END -->)|$1\n$scholar\n    $2|s;
    s|(<!-- SYNC:SCHOLAR_STATS_START -->).*?(<!-- SYNC:SCHOLAR_STATS_END -->)|$1\n$sstats\n          $2|s;
  ' "$FILE"
fi

rm -rf "$TMPDIR"

echo "Synced: ${REPOS_COUNT} repos, ${FOLLOWERS} followers, ${TOTAL_CITATIONS} citations, pinned + recent + scholar updated."

# field note* studios

Static one-page site, built for GitHub Pages.

## Files
- `index.html` — the whole site (desktop + mobile responsive)
- `CNAME` — custom domain for GitHub Pages (`fieldnotestudios.com`)
- `.nojekyll` — tells Pages to serve files as-is, no Jekyll
- `README.md` — you're reading it

## Wiring up Formspree (do this once)
1. Go to formspree.io → sign up with hello@fieldnotestudios.com (free tier is 50 submissions/month, more than enough to start).
2. Click **+ New form** → give it the name "fieldnotestudios enquiries" → copy the form ID (a 10-char slug like `xzbnwqkl`).
3. Open `index.html`, search for `FORMSPREE_FORM_ID`, replace with your form ID.
4. Commit and push — Pages redeploys in ~30 seconds.

Formspree will email every enquiry to the sign-up address. Add a reply-to by setting `_replyto: {{Email}}` field in Formspree's form settings.

## Updating the site
Ask Claude in chat ("change the hero to …", "add a new service row …") — once this repo is connected, Claude edits `index.html` here, commits, pushes. GitHub Pages rebuilds and the live site updates.

# Contribute a case

Open an issue with the original creator URL, exact Qwen model/version, original recording, tools used, and the prompt if the creator published it. Include reference assets and follow-up instructions when available. Label comparisons and sponsored demonstrations.

Maintainers verify attribution, remove duplicate media by SHA-256, archive a complete playback copy and poster on the permanent BeatAPI CDN, and create the matching BeatAPI case before adding a primary preview link. Source URLs are attribution only. Do not substitute another gallery or an X/Reddit page for playback.

Keep Max and Max-Preview distinct. Anonymous models and unconfirmed model claims stay in the research queue. A title or task description is not a complete original prompt. Keep unavailable prompts explicit.

Select six starting points across distinct uses and creators, checking visible result quality, readable posters and model/version consistency. Keep every case discoverable: show each cover once, with featured cases linked from their category instead of repeated. Do not select solely by likes or repost counts.

Run `npm run build && npm test`, then sync the website catalog and verify playback, source attribution, mobile layout and the six featured destinations. Publish the website routes before promoting new README links.

No automated posting is part of this repository. Share a specific case with an honest workflow description when promoting it.

## README presentation

Keep a real-example cover in `assets/readme-cover.png` (the reproducible 1600 × 560 layout is `assets/cover-layout.html`). Store each credited source poster in `assets/posters/<case-id>.jpg`. The generator renders six highlights in a three-column grid, followed by the remaining cases grouped by use. Category counts include highlights; featured cases have text links within their category. Keep the cover compact, use the official `assets/beatapi-logo.png`, and show the six highlights immediately after one short intro and one action/count row. Place the inline category directory after the highlights, and the smaller website screenshot sits in the usage guide. Keep model variant, tools and duration on one compact line, followed by the prompt/case-note link and creator credit. Every image and playback action leads to the corresponding BeatAPI page; creator links remain attribution. Do not replace the visual catalog with a metadata-only table.

## Maintenance

Verify the source → archive the original recording and poster → verify prompt text → sync the site case → review the six highlights → run `npm run build && npm test`. Update both README languages through `scripts/build.mjs`; do not edit the generated files directly. Keep the opening short enough that visitors reach the first examples within roughly one screen of scrolling.

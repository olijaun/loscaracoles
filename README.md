# Los Caracoles

The public club website is built with Eleventy. Concerts are Markdown files in
`src/events/`; the homepage, club page, listings, and concert detail pages
share the layout in `src/_includes/`.

## Local preview

With Node.js 22 or later, run `npm install` and `npm start`. Eleventy prints
the local preview URL. Use `npm test` to check the concert date rules and
`npm run build` to generate the static site in `_site/`.

## GitHub Pages setup

1. Push this project root to the club's GitHub repository.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Run **Publish Los Caracoles** from the Actions tab to publish the first version.
   Later commits to the default branch publish automatically. The workflow uses
   the Pages base path for assets and links, including on project URLs.
4. Preview on the GitHub Pages URL before connecting the club domain. Set the
   custom domain through GitHub's Pages settings when the site is ready to switch.

The same workflow also runs daily at 00:17 in Bern. Concerts stay in the
upcoming list through their local date. The next build moves them to the archive
and keeps their detail URLs. A browser-side date check hides past entries from
an older upcoming listing if the scheduled build runs late or stops. GitHub may
disable scheduled workflows in a public repository after 60 days without activity.
A manual workflow run can refresh the site and archive whenever needed.

## Konzert erfassen

1. Open [Pages CMS](https://app.pagescms.org/) and connect the club's repository.
   The editor configuration is in `.pages.yml`. Use the default branch for
   direct publishing.
2. Invite editors in the CMS. Email invitations for editors without GitHub accounts
   depend on the Pages CMS hosting plan.
3. Select **Veranstaltungen**, create an entry, fill out the form and save. The save
   commits a Markdown file and triggers a site build.

Use the concert date and venue in Bern, a 24-hour start time such as `20:00`,
and an external ticket URL. Add an alternative text if the image conveys
information. The seed entries are three past concerts from the 2026 festival.

The homepage newsletter form submits directly to Mailchimp. The statutes PDF still
points to the existing site. Transfer it before switching `loscaracoles.ch`
to this site.

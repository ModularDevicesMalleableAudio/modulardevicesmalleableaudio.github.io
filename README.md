# modulardevicesmalleableaudio.github.io

Source for the Modular Devices / Malleable Audio site:
<https://modulardevicesmalleableaudio.github.io/>

## How it deploys

GitHub Pages builds and publishes on every push to `main` — Settings →
Pages is set to "Deploy from a branch", `main` at `/` (root). There is no
CI workflow: **a push to `main` is a deploy**, normally live inside a
minute. Build results appear in the Actions tab as `pages-build-deployment`.

This is a *user* Pages site, so it is served from the domain root. It used
to be a project site at `/mdma/`; the repo was renamed to move it to the
root, and `baseurl` is now empty.

## Running it locally

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000/>. Because `baseurl` is empty, local paths
match live paths exactly.

## Conventions

Link to internal pages and assets through Jekyll's URL filters rather than
hardcoding paths:

```liquid
[Setup]({{ '/documentation/MSEQ/setup' | relative_url }})
<img src="{{ '/assets/MSEQ.jpeg' | relative_url }}">
```

Hardcoded absolute paths silently break if the site ever moves back under a
subpath or onto a custom domain.

## Layout

| Path | Contents |
| --- | --- |
| `_posts/` | Dated news entries |
| `_layouts/`, `_includes/` | Page templates and shared fragments |
| `_sass/` | Styles, imported by `assets/*.scss` |
| `assets/` | Images and compiled CSS entry points |
| `MSEQ-docs-*.md` | MSEQ documentation, mapped by `permalink` to `/documentation/MSEQ/...` |

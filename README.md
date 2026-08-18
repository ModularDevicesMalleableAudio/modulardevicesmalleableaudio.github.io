# modulardevicesmalleableaudio.github.io

Source for the Modular Devices / Malleable Audio site:
<https://modulardevicesmalleableaudio.github.io/>

## Publishing MSEQ documentation

The MSEQ documentation is authored in the `docs/` directory of the
[`sequencer`](https://github.com/ModularDevicesMalleableAudio/sequencer) repo.
The `MSEQ-docs-*.md`, `MSEQ-view-*.md`, and `MSEQ-docs-manifest.json` files in
this repo are generated output and must not be edited by hand. The generator
checks their recorded hashes and refuses to overwrite hand-edited output.

Publishing is a deliberate operator step:

```sh
cd ~/code/sequencer
uv run --script scripts/build_site_docs.py --out ~/code/mdma/mdma

cd ~/code/mdma/mdma
./scripts/build-local.sh
./scripts/serve-local.py  # review at http://localhost:4000
git add -A
git commit
git push
```

The sequencer repo's `docs/site-manifest.yml` controls which pages are
published, their order, titles, and URLs. See its `docs/README.md` for the full
publishing and figure-generation contracts.

## How it deploys

GitHub Pages builds and publishes on every push to `main` via the `pages`
workflow in `.github/workflows/pages.yml` — Settings → Pages is set to
"GitHub Actions". **A push to `main` is a deploy**, normally live inside a
minute; the run appears in the Actions tab as `pages`.

This is a *user* Pages site, so it is served from the domain root. It used
to be a project site at `/mdma/`; the repo was renamed to move it to the
root, and `baseurl` is now empty.

## Running it locally

Build into `_site/` without installing Ruby (gems are cached in `vendor/`, so
repeat runs take a few seconds):

```sh
docker run --rm -e BUNDLE_PATH=/srv/vendor/bundle -v "$PWD":/srv -w /srv ruby:3.1 \
  bash -c 'bundle install --quiet && bundle exec jekyll build'
```

Use `build`, not `serve`. `github-pages ~> 223` pins Jekyll 3.9, which builds
fine on a modern Ruby but whose `serve` dies on Ruby 3.x with "no implicit
conversion of Hash into Integer". Serve the output separately instead.

One catch when serving `_site/` yourself: the MSEQ permalinks have no trailing
slash, so Jekyll writes `documentation/MSEQ/manual.html` and Pages serves it at
`/documentation/MSEQ/manual`. `python3 -m http.server` won't do that mapping, so
those two URLs 404 locally even though they work live — use a server that falls
back to `.html`, or check them as `manual.html`.

Because `baseurl` is empty, local paths otherwise match live paths exactly.

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

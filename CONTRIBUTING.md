# Contributing

This repo packages [OpenClaw](https://github.com/openclaw/openclaw) for StartOS.

## Documentation — keep it in sync

- **`README.md`** — what this package is, how it differs from upstream, and how it's built (image, volumes, interfaces). For developers and AI assistants.
- **`instructions.md`** — the user-facing instructions packed into the `.s9pk` and shown on the **Instructions** tab in StartOS, for the person running the service. Required alongside `README.md`.
- **`CONTRIBUTING.md`** — this file.

**Any code change that warrants it must update `README.md` and `instructions.md` in the same change** — a new or renamed action, an added or removed volume / port / interface / dependency, a changed default, a new limitation, any altered user-visible behavior. Don't defer: a package that ships with a stale README or stale instructions is not done, even if the code is perfect. Content rules live in the packaging guide: [Writing READMEs](https://docs.start9.com/packaging/writing-readmes.html) and [Writing Service Instructions](https://docs.start9.com/packaging/writing-instructions.html).

## Building

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for environment setup, then:

```bash
npm ci    # install dependencies
make      # build the universal .s9pk
```

## Updating the upstream version

OpenClaw is built from the local `Dockerfile`, which installs OpenClaw via its official install script. To track a new upstream release:

1. Bump `OPENCLAW_VERSION` in `Dockerfile` to the new version.
2. Add a new version file under `startos/versions/` (named for the new version string), set it as `current` in `startos/versions/index.ts`, and move the prior `current` into the `other` array. A new version file is only needed when the bump carries an `up`/`down` migration, or when you want the old release notes preserved in git history — see [Versions](https://docs.start9.com/packaging/versions.html).
3. Rebuild (`make`), sideload the `.s9pk`, and confirm it starts.
4. Review `README.md` for anything the bump changed.

## GitHub Actions

Three workflows live under `.github/workflows/`. All three are thin wrappers that call reusable workflows in [`start9labs/shared-workflows`](https://github.com/Start9Labs/shared-workflows); the local files just configure triggers, pass inputs, and forward secrets.

- **`build.yml` — PR validation.** Triggered by `pull_request` against `master` (non-draft, ignoring `*.md` changes) and `workflow_dispatch`. Builds the `.s9pk` and uploads each arch as its own artifact for sideload smoke-testing. Cancels in-progress runs on the same branch/PR when new commits land.
- **`tagAndRelease.yml` — master → registry.** Triggered by push to `master` (ignoring `*.md`). Reads `version` from the manifest, skips if that version is already published, otherwise force-pushes a `v<version>` tag and chains into the release step.
- **`release.yml` — tag → registry.** Triggered by pushing a `v*.*` tag directly. Builds per arch, creates a GitHub Release, and publishes to the configured registry.

## How to contribute

1. Fork the repository and create a branch from `master`.
2. Make your changes — including the doc updates above.
3. Open a pull request to `master`.

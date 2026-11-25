# AITrainer agent instructions

This file is the source of truth for repository-specific AI assistant instructions.
`CLAUDE.md` imports this file; maintain shared instructions here.

## System prompt

You are an expert software developer acting as a peer programming partner on
AITrainer. Work alongside the user: explain your reasoning briefly, call out
trade-offs, ask when requirements are unclear, and keep the user in control of
decisions.

Match your approach to the size of the change:

- **Small, scoped edits.** When the user is working in a specific file, make
  targeted changes to the files in focus. Keep the diff small, stay within the
  requested scope, and check the result with the user before moving on.
- **Multi-file changes.** For features, refactors, or fixes that touch several
  files, plan the steps first and then make the edits. Once the lint and test
  tooling exists (see Project overview), run the linter and Jest tests and fix
  any failures before reporting back.

Follow the rest of this file for branching, PR, architecture, and style rules.

## Project overview

AITrainer is a browser-based work tracker.

- Written in TypeScript.
- Compiled into a Progressive Web App (PWA) so it works in desktop browsers and
  on mobile devices (phones and tablets).
- Tests use Jest.
- Linting uses ESLint with the TypeScript parser and enforces the rules listed below.

Verified commands (run from the repository root after `npm install`):

- `npm run build`: bundles `src/app/main.ts` and `src/sw.ts` with esbuild and
  copies `public/` into `dist/`. `npm run dev` rebuilds on change.
- `npm test`: runs the Jest suite in `tests/`.
- `npx jest tests/core/tasks.test.ts`: runs a single Jest test file.
- `npm run lint`: runs ESLint.
- `npm run typecheck`: runs `tsc` for the app and the service worker.

The app is a static site: serve `dist/` with any static file server to try it.

## Development workflow

- Never commit feature work directly to `main`.
- Create a new branch for every feature or fix, named `feature/<short-description>`
  or `fix/<short-description>`.
- Every change reaches `main` through a pull request. Do not merge without a PR.
- Run the linter and the Jest test suite before opening or updating a PR.
- Keep PRs focused on one feature or fix.

## Architecture and conventions

- Use strict TypeScript (`"strict": true`) for all source code.
- Build the app as a PWA: include a web app manifest and a service worker, and
  make sure the layout works at both desktop and mobile/tablet screen sizes.
- Keep application logic separate from DOM and UI code so it can be unit tested
  with Jest without a browser.
- Put all Jest tests in the top-level `tests/` folder, using the `*.test.ts`
  naming pattern. Do not place tests inside `src/`.

## Folder structure

```
AITrainer/
├── public/              Static assets copied as-is into dist/
│   ├── index.html, styles.css
│   ├── manifest.webmanifest   PWA web app manifest
│   └── icons/           App icons for desktop and mobile
├── scripts/build.mjs    esbuild bundling and copy to dist/
├── src/                 Application source (TypeScript)
│   ├── core/            Pure logic with no DOM access; unit tested with Jest
│   ├── ui/              DOM and UI components
│   ├── app/             App bootstrap and wiring of core and ui
│   └── sw.ts            Service worker (tsconfig.sw.json, WebWorker lib)
├── tests/               All Jest tests (unit and integration); mirrors src/ layout
├── package.json
├── tsconfig.json, tsconfig.sw.json
├── jest.config.js       Jest configuration
├── eslint.config.mjs    ESLint configuration
├── AGENT.md
├── CLAUDE.md
└── README.md
```

Service worker caching is network-first with a cache fallback, so updated
assets reach users without bumping the cache name. Keep it that way unless
offline-first behavior is explicitly required.

## Linting rules (base set)

The base ESLint configuration should enforce at least these rules:

- `@typescript-eslint/no-explicit-any`: error. Do not use `any`. Use `unknown`
  and narrow the type, or define a proper type.
- `@typescript-eslint/no-non-null-assertion`: error. Avoid `!` assertions.
- `@typescript-eslint/no-unused-vars`: error.
- `@typescript-eslint/explicit-function-return-type`: warn for exported functions.
- `@typescript-eslint/consistent-type-imports`: error.
- `eqeqeq`: error. Use `===` and `!==`.
- `no-console`: warn. Allow `console.warn` and `console.error` only.
- `prefer-const`: error.
- `no-var`: error.

Do not disable a rule inline (`eslint-disable`) without a comment explaining why.

## Code style

- Only add comments where the code needs clarification.
- Do not add comments that restate the code.

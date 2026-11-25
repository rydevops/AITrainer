# AITrainer agent instructions

This file is the source of truth for repository-specific AI assistant instructions.
`CLAUDE.md` imports this file; maintain shared instructions here.

## Project overview

AITrainer is a browser-based work tracker.

- Written in TypeScript.
- Compiled into a Progressive Web App (PWA) so it works in desktop browsers and
  on mobile devices (phones and tablets).
- Tests use Jest.
- Linting uses ESLint with the TypeScript parser and enforces the rules listed below.

Status: the project is at the initialization stage. The root `README.md` contains
only the project title. The TypeScript, PWA, Jest, and ESLint setup has not been
created yet. Until it exists, do not claim build, test, or lint commands work.
Once the setup is added, replace this section with verified commands, including
how to run a single Jest test.

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

## Folder structure (planned)

This layout is planned and has not been created yet. Update it when the folders
exist.

```
AITrainer/
├── public/              Static assets copied as-is into the build output
│   ├── manifest.webmanifest   PWA web app manifest
│   └── icons/           App icons for desktop and mobile
├── src/                 Application source (TypeScript)
│   ├── core/            Pure logic with no DOM access; unit tested with Jest
│   ├── ui/              DOM and UI components
│   ├── app/             App bootstrap and wiring of core and ui
│   └── sw.ts            Service worker
├── tests/               All Jest tests (unit and integration); mirrors src/ layout
├── package.json
├── tsconfig.json
├── jest.config.*        Jest configuration
├── eslint.config.*      ESLint configuration
├── AGENT.md
├── CLAUDE.md
└── README.md
```

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

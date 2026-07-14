# Design: Modernize `@bdrk/eslint-config`

**Date:** 2026-07-14
**Status:** Approved

## Goal

Bring the `@bdrk/eslint-config` shareable ESLint configuration current: support the
latest ESLint, prune anything no longer necessary, and add sane defaults for new
rules that are consistent with the existing (strict, correctness-first,
style-conscious) philosophy.

This is a **breaking change** and ships as a **major version bump**. Downstream
consumers lint before committing the upgrade, so any newly-flagged code is expected
and acceptable to fix on their side.

## Decisions (settled during brainstorming)

1. **Config format: flat config only.** Ship `eslint.config.js`-style flat config as
   the sole format. No legacy `.eslintrc` compatibility layer. (Legacy is removed in
   ESLint 10 anyway.)
2. **Target ESLint 10** (the current latest). Build/test against ESLint 10; peer
   dependency allows `>=9` for consumer flexibility (all chosen plugins support both 9
   and 10).
3. **Style enforcement: migrate to `@stylistic/eslint-plugin`.** Preserve the existing
   formatting rules exactly, sourced from the maintained successor plugin.
4. **Import linting: switch to `eslint-plugin-import-x`.** The classic
   `eslint-plugin-import@2.32` does not yet declare ESLint 10 peer support; `import-x`
   is the actively-maintained, TS-rewritten drop-in with identical rule names.
5. **New-rule defaults: match current strictness.** Enable new rules as `error` where
   they fit the existing philosophy; leave the noisy/opinionated ones `off`.

### Ground truth

Rule sets were introspected from the actual latest packages (ESLint 10.7.0,
typescript-eslint 8.64.0, @stylistic 5.10.0, eslint-plugin-import-x 4.17.1,
@eslint-community/eslint-plugin-eslint-comments 4.7.2), not from memory. All rule
renames, removals, and @stylistic/import-x mappings below are verified against those
installed packages.

## Architecture & Layout

Flat-config shareable package with two entry points (unchanged consumer surface):

- `@bdrk/eslint-config` → base JS config (array of flat config objects)
- `@bdrk/eslint-config/typescript` → TypeScript config (array)

**Source files** remain `index.js` (base) and `typescript/index.js` (TS), but each now
exports an **array** of flat config objects instead of a single eslintrc object. The
TS config is built with `tseslint.config(...)`, spreading the base array and adding the
TypeScript layers.

**Module format: CommonJS.** Keep `module.exports` / `require`. All target dependencies
ship dual CJS/ESM builds, so `require('typescript-eslint')` etc. works, and this avoids
a `"type": "module"` conversion. Consumers import the package identically regardless of
its internal format.

**`package.json` `exports` map** provides the `/typescript` subpath:

```json
"exports": {
  ".": "./index.js",
  "./typescript": "./typescript/index.js"
}
```

**Self-linting:** add a root `eslint.config.js` that consumes the package's own base
config to lint the repo. This replaces the old `eslint -c ./index.js ./ --ext .js`
script (the `--ext` flag no longer exists in flat config); the new script is
`eslint .`. The self-lint config sets `sourceType: 'commonjs'` for the package's own
CJS sources.

## Dependency Changes

| Action | Package | Notes |
|---|---|---|
| Bump | `eslint` → `^10` (devDependency); peer `>=9` | build/test on 10 |
| Replace | `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` → **`typescript-eslint` ^8** (unified) | provides `tseslint.config()` + `tseslint.configs.*` |
| Replace | `eslint-plugin-import` → **`eslint-plugin-import-x` ^4** | identical rule names |
| Replace | `eslint-plugin-eslint-comments` → **`@eslint-community/eslint-plugin-eslint-comments` ^4** | maintained fork |
| Add | `@stylistic/eslint-plugin` ^5 | all formatting rules |
| Add | `@eslint/js` ^10 | `js.configs.recommended` |
| Add | `globals` | replaces eslintrc `env` |
| Keep | `@bdrk/semantic-release-config` | release tooling |

`peerDependencies` rewritten to match: `eslint >=9`, `typescript-eslint >=8`,
`@stylistic/eslint-plugin >=5`, `eslint-plugin-import-x >=4`,
`@eslint-community/eslint-plugin-eslint-comments >=4`. Add `engines: { node: ">=18" }`.

## `env` Replacement

Flat config has no `env`. Replace with:

- `languageOptions.globals: { ...globals.node }` (was `env: { node: true }`)
- `languageOptions.ecmaVersion: 'latest'` (was `env: { es6: true }`)

The base shared config leaves `sourceType` at the flat-config default; only the
package's own self-lint config pins `sourceType: 'commonjs'`.

## Base Config (`index.js`) Rule Handling

- **Recommended preset:** `eslint:recommended` → `js.configs.recommended` (from
  `@eslint/js`).
- **26 formatting rules move verbatim to `@stylistic/*`** with identical options
  (all confirmed present in @stylistic):
  `indent`, `quotes`, `comma-dangle`, `comma-spacing`, `comma-style`, `brace-style`,
  `key-spacing`, `keyword-spacing`, `linebreak-style`, `lines-between-class-members`,
  `max-len`, `new-parens`, `no-floating-decimal`, `no-mixed-operators`,
  `no-trailing-spaces`, `operator-linebreak`, `quote-props`, `space-before-blocks`,
  `space-before-function-paren`, `spaced-comment`, `space-in-parens`, `wrap-iife`,
  `arrow-parens`, `eol-last`, `padding-line-between-statements`.
- **`id-blacklist` → `id-denylist`** (renamed core rule; same forbidden-identifier
  array).
- **`no-process-exit`** (currently `'off'`, moved to `eslint-plugin-n`): **drop** — no
  behavior change.
- **Non-stylistic core rules stay in core, unchanged:** `complexity`,
  `max-classes-per-file`, `camelcase`, `curly`, `eqeqeq`, `func-style`, and all the
  `no-*` correctness rules currently configured.
- **import rules:** all 13 map 1:1 to `import-x/*` (verified): `first`,
  `newline-after-import`, `no-absolute-path`, `no-amd`, `no-default-export`,
  `no-extraneous-dependencies`, `no-mutable-exports`, `no-named-default`,
  `no-named-export`, `no-self-import`, `prefer-default-export`, `no-unassigned-import`,
  `order`.
- **eslint-comments rules:** all map to the `@eslint-community` fork with the same
  options.

Plugins are registered in flat config via a `plugins: { ... }` object rather than a
string array.

## TypeScript Config (`typescript/index.js`) Rule Handling

Built with `tseslint.config(...)` spreading the base array plus:
`tseslint.configs.recommended` + `tseslint.configs.recommendedTypeChecked` (renamed
from `recommended-requiring-type-checking`; preserves the type-checked tier).

Parser setup switches from `parserOptions.project: 'tsconfig.json'` to
`languageOptions.parserOptions.projectService: true` (typescript-eslint v8's
recommended default) so consumers no longer must have a root `tsconfig.json` or
override the path.

**Removed / renamed TS rules (verified against v8):**

| Current rule | Action |
|---|---|
| `@typescript-eslint/{brace-style, comma-dangle, comma-spacing, func-call-spacing, indent, keyword-spacing, lines-between-class-members, member-delimiter-style, object-curly-spacing, quotes, semi, space-infix-ops, type-annotation-spacing, no-extra-parens, no-extra-semi}` | → `@stylistic/*` (TS-aware). `func-call-spacing` → `@stylistic/function-call-spacing`. |
| `@typescript-eslint/ban-types` | → split into `no-empty-object-type` + `no-unsafe-function-type` + `no-wrapper-object-types` (+ `no-restricted-types` if the `Function` allowance must be reproduced) |
| `@typescript-eslint/no-throw-literal` | → `only-throw-error` (renamed) |
| `@typescript-eslint/no-parameter-properties` | → `parameter-properties` (renamed; was `'off'`, stays off) |
| `@typescript-eslint/no-implicit-any-catch` | drop (removed; obsolete under `useUnknownInCatchVariables`) — was `'off'` |
| `@typescript-eslint/no-unused-vars-experimental` | drop (removed) — was `'off'` |
| `@typescript-eslint/sort-type-union-intersection-members` | drop (removed; successor also deprecated) — was `'off'` |
| `@typescript-eslint/no-empty-interface` | → `no-empty-object-type` (deprecated → successor) |
| `@typescript-eslint/no-type-alias` | drop (deprecated) — was `'off'` |
| `@typescript-eslint/no-var-requires` | drop; keep `no-require-imports` (already present) |
| `@typescript-eslint/typedef` | drop (deprecated) — was `'off'` |

The `naming-convention` block and the `*.module.ts` / `*.d.ts` overrides carry over
unchanged, expressed as flat config objects with `files`.

## New Rules — Sane Defaults

Adopt a curated subset of genuinely-new rules as `error` where they fit the
correctness-first philosophy; leave noisy/opinionated ones `off` (mirroring existing
`no-magic-numbers: off`, `no-console: off`, `no-explicit-any: off`). Each rule gets a
one-line justification comment in the config. Because this ships as a major bump, exact
membership is low-stakes and may be tuned during implementation.

**New TypeScript rules ON (`error`):**
`no-unsafe-enum-comparison`, `no-unsafe-function-type`, `no-wrapper-object-types`,
`no-empty-object-type`, `no-duplicate-type-constituents`,
`no-redundant-type-constituents`, `no-duplicate-enum-values`, `no-mixed-enums`,
`no-array-delete`, `no-meaningless-void-operator`, `no-unnecessary-template-expression`,
`no-unnecessary-type-conversion`, `only-throw-error`, `prefer-find`,
`prefer-promise-reject-errors`, `prefer-return-this-type`,
`use-unknown-in-catch-callback-variable`, `no-unsafe-declaration-merging`,
`related-getter-setter-pairs`, `no-import-type-side-effects`, `consistent-type-imports`,
`consistent-generic-constructors`.

**New TypeScript rules OFF** (too opinionated / would fight existing choices):
`no-magic-numbers`, `no-restricted-imports`, `strict-void-return`,
`no-unsafe-type-assertion`, `prefer-destructuring`, `max-params`,
`class-methods-use-this`, `return-await` (leave default), `no-deprecated` (valuable but
noisy against external deps — start off).

**New core rules ON (`error`):**
`array-callback-return`, `no-constructor-return`, `no-promise-executor-return`,
`no-self-compare`, `no-unmodified-loop-condition`, `no-unreachable-loop`,
`no-object-constructor` (successor to `no-new-object`), `no-new-native-nonconstructor`,
`prefer-object-has-own`, `no-useless-assignment`, `no-unassigned-vars`,
`preserve-caught-error`. (Most other new core rules are already on via `recommended`.)

## Tooling / Repo Updates

- `package.json`: `exports` map, rewritten `devDependencies` + `peerDependencies`,
  `lint` script → `eslint .`, add `engines.node >=18`.
- Add root `eslint.config.js` for self-linting; keep the repo lint-clean.
- Rewrite `README.md` for flat-config usage (`import`/spread examples for both base and
  TypeScript variants).
- `.pre-commit-config.yaml` local lint hook keeps calling `npm run lint`.
- CI/CD (`fcgroup/actions` reusable workflows) untouched unless they pin an
  incompatible Node version.
- `.releaserc.json` / semantic-release unchanged; the breaking change is signalled via a
  `BREAKING CHANGE:` commit footer to trigger the major bump.

## Verification

- Build a small fixture (JS + TS sample files) in a scratch area and run the real
  config against them with ESLint 10. Confirm: config loads without "rule not
  found"/deprecation errors, expected rules fire on violating samples, and clean
  samples pass.
- Run the package's own self-lint (`npm run lint`) and confirm the repo is clean.

## Out of Scope

- No Prettier integration (style stays in ESLint via @stylistic).
- No dual legacy/flat publishing.
- No changes to the rule *philosophy* beyond the curated new-rule additions above.
- No unrelated refactoring of CI workflows or release config.

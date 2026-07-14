# ESLint Shareable Configs

This repository contains the standard ESLint shareable configuration for Bedrock projects.

It ships as [flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
and targets **ESLint 9+** (developed and tested against ESLint 10).

## Referencing this Configuration

Install the NPM package in your project:

```bash
npm install --save-dev @bdrk/eslint-config
```

Then reference it from your project's `eslint.config.js` (or `eslint.config.mjs`).
The exported config is an array of flat config objects — spread it into your own
config, adding any project-specific overrides afterwards.

**For JavaScript projects:**

```js
// eslint.config.js
const bdrk = require('@bdrk/eslint-config');

module.exports = [
  ...bdrk,
  {
    // project-specific overrides
  },
];
```

**For TypeScript projects:**

```js
// eslint.config.js
const bdrk = require('@bdrk/eslint-config/typescript');

module.exports = [
  ...bdrk,
  {
    // project-specific overrides
  },
];
```

Using ES modules? Import the default export instead:

```js
// eslint.config.mjs
import bdrk from '@bdrk/eslint-config';

export default [
  ...bdrk,
  // project-specific overrides
];
```

Anything defined in this configuration can be overridden by adding a later config
object with the rules you want to change.

## What's included

- **Base (`@bdrk/eslint-config`):** `@eslint/js` recommended rules plus Bedrock's
  conventions, formatting via [`@stylistic/eslint-plugin`](https://eslint.style),
  import hygiene via [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x),
  and directive-comment hygiene via
  [`@eslint-community/eslint-plugin-eslint-comments`](https://github.com/eslint-community/eslint-plugin-eslint-comments).
- **TypeScript (`@bdrk/eslint-config/typescript`):** everything in the base config plus
  [`typescript-eslint`](https://typescript-eslint.io) recommended + type-checked rules
  and Bedrock's TypeScript conventions.

The TypeScript config uses typescript-eslint's
[`projectService`](https://typescript-eslint.io/getting-started/typed-linting), so it
auto-detects the nearest `tsconfig.json` — no `parserOptions.project` override required
in most projects.

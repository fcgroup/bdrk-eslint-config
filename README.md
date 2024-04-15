# ESLint Shareable Configs

This repository contains the standard ESLint shareable configuration for Bedrock projects.

## Referencing this Configuration

You can reference this config by installing the NPM package in your project:

```bash
npm install --save-dev @bdrk/eslint-config
```

Then update the project's `.eslintrc.json` file to extend this configuration:

**For JavaScript projects:**
```json
{
  "extends": "@bdrk/eslint-config"
}
```

**For TypeScript projects:**
```json
{
  "extends": "@bdrk/eslint-config/typescript"
}
```

You can overwrite settings defined in this configuration by specifying them in your project's `.eslintrc.json`.

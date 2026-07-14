const tseslint = require('typescript-eslint');
const stylistic = require('@stylistic/eslint-plugin');

const BASE_CONFIG = require('../index');

const NAMING_CONVENTION = [
  // Default naming convention
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'forbid',
    trailingUnderscore: 'forbid',
  },

  // Global constants
  {
    selector: 'variable',
    modifiers: ['global', 'const'],
    format: ['camelCase', 'UPPER_CASE'],
  },

  // Exported constants
  {
    selector: 'variable',
    modifiers: ['exported', 'const'],
    format: ['UPPER_CASE', 'PascalCase'],
  },

  // Exported function variables
  {
    selector: 'variable',
    modifiers: ['exported'],
    types: ['function'],
    format: ['camelCase'],
  },

  // Exported functions
  {
    selector: 'function',
    modifiers: ['exported'],
    format: ['PascalCase', 'camelCase'],
  },

  // Type alias names
  {
    selector: 'typeAlias',
    format: ['PascalCase'],
  },

  // Class names
  {
    selector: 'class',
    format: ['PascalCase'],
  },

  // Class member names
  {
    selector: 'classProperty',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },

  // Interface names
  {
    selector: 'interface',
    format: ['PascalCase'],
    prefix: ['I'],
  },

  // Enum names
  {
    selector: 'enum',
    format: ['PascalCase'],
  },

  // Enum member names
  {
    selector: 'enumMember',
    format: ['PascalCase'],
  },

  // Generic type parameters
  {
    selector: 'typeParameter',
    format: ['PascalCase'],
  },

  // Angular environment.ts
  {
    selector: 'variable',
    modifiers: ['global', 'exported'],
    filter: 'environment',
    format: ['camelCase'],
  },
];

module.exports = tseslint.config(
  ...BASE_CONFIG,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        // Replaces the old `project: 'tsconfig.json'`; auto-detects the nearest
        // tsconfig so consumers no longer need to override the project path.
        projectService: true,
        ecmaFeatures: {
          jsx: false,
        },
      },
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/class-literal-property-style': ['error', 'fields'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/naming-convention': ['error', ...NAMING_CONVENTION],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off', // Conflicts with non-nullable-type-assertion-style
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/parameter-properties': 'off', // Renamed from no-parameter-properties
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/unified-signatures': 'error',

      // Replacements for rules removed / renamed in typescript-eslint v8.
      // `ban-types` was split into these focused rules:
      '@typescript-eslint/no-empty-object-type': 'error', // also replaces no-empty-interface
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      // `no-throw-literal` was renamed to `only-throw-error`.
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'error',
      // `no-loop-func` / `no-loss-of-precision` extension rules were deprecated in
      // favour of the core rules.
      'no-loop-func': 'error',

      // New typescript-eslint rules, matched to the existing strict philosophy.
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/prefer-find': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

      // @stylistic (TS-aware formatting; migrated from removed @typescript-eslint
      // extension rules).
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1,
        FunctionDeclaration: {
          parameters: 'first',
        },
        FunctionExpression: {
          parameters: 'first',
        },
      }],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/semi': 'error',
      '@stylistic/space-infix-ops': ['error', { int32Hint: true }],
      '@stylistic/type-annotation-spacing': 'error',
    },
  },
  {
    files: ['**/*.module.ts'],
    rules: {
      'import-x/first': 'off',
      'import-x/newline-after-import': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
);

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialisation de la compatibilité pour les configs legacy
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

// Détection de l'environnement
const isProd = process.env.NODE_ENV === 'production';

// Configuration ESLint de base
const eslintConfig = [
  // Configurations de base et next.js
  ...compat.extends('next/core-web-vitals'),

  // Configuration globale pour tous les fichiers
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: __dirname,
      },
    },
    rules: {
      // Règles de base ESLint
      'no-console': isProd ? 'warn' : 'off',
      'no-debugger': isProd ? 'error' : 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-undef': 'error',
      'prefer-const': 'warn',

      // Règles React
      'react/prop-types': 'off', // Next.js utilise TypeScript/PropTypes pour la validation
      'react/react-in-jsx-scope': 'off', // React 17+ n'a plus besoin d'importer React
      'react/jsx-uses-react': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
      'react/jsx-props-no-spreading': 'off', // Autoriser le spread des props
      'react/no-unknown-property': ['error', { ignore: ['jsx'] }],

      // Règles Prettier
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          endOfLine: 'auto',
        },
      ],
    },
  },

  // Configuration spécifique pour les fichiers de configuration
  {
    files: [
      '*.config.{js,mjs,cjs}',
      'next.config.{js,mjs,cjs}',
      'postcss.config.{js,mjs,cjs}',
    ],
    rules: {
      'no-unused-vars': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Configuration spécifique pour les fichiers de test
  {
    files: [
      '**/*.test.{js,mjs,jsx}',
      '**/*.spec.{js,mjs,jsx}',
      '**/__tests__/**/*.{js,mjs,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off', // Pour éviter les faux positifs avec les fonctions Jest
    },
  },

  // Configuration pour les API routes de Next.js
  {
    files: ['**/pages/api/**/*.{js,mjs,jsx}', 'middleware.{js,mjs,jsx}'],
    rules: {
      'no-console': 'warn', // Pas de console.log dans les API routes (utiliser un logger)
    },
  },
];

// Configuration pour React Server Components
const serverComponentsConfig = {
  files: ['**/app/**/*.{js,mjs,jsx}'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
    'no-unused-expressions': 'off', // Pour les expressions JSX dans les RSC
  },
};

// Configuration pour les fichiers TailwindCSS
const tailwindConfig = {
  files: ['tailwind.config.{js,mjs,cjs}'],
  rules: {
    'no-undef': 'off',
  },
};

// Ajout des configurations spécifiques
eslintConfig.push(serverComponentsConfig);
eslintConfig.push(tailwindConfig);

// Ajouter la configuration pour Sentry
const sentryConfig = {
  files: ['sentry.*.config.{js,mjs,jsx}'],
  rules: {
    'no-undef': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
eslintConfig.push(sentryConfig);

// Optimisation des performances ESLint en production
if (isProd) {
  eslintConfig.push({
    files: ['**/*.{js,mjs,cjs,jsx}'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false, // Permet l'utilisation de /* eslint-disable */ dans le code
      cache: true,
      cacheLocation: '.eslintcache',
    },
  });
}

export default eslintConfig;

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Vendored assets and build output are not our code.
  globalIgnores(['dist', 'public']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // The apps/ pattern intentionally co-locates the launcher function
      // (which builds the os-gui native window) with the React component.
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          allowExportNames: [
            'launchFileExplorer',
            'navigateIExplorer',
            'launchIExplorer',
            'launchMSDOS',
            'launchFileViewer',
            'launchMyComputer',
            'launchNetwork',
            'launchNotepad',
            'launchPortfolio',
            'launchRecycleBin',
            'launchSearch',
            'launchSettings',
            'launchSoundRecorder',
            'launchWelcome',
            // Context convenience hooks (mirrors DesktopContext's disable comment)
            'useLanguage',
            'useWindow',
            'useWindowMenu',
          ],
        },
      ],
    },
  },
])

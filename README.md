# Playwright tests for Personalia

This project contains a minimal Playwright test setup targeting Personalia.

Quick start (Windows PowerShell):

1. Install dependencies:

```powershell
npm install
npx playwright install --with-deps
```

2. Run tests against dev (default):

```powershell
# uses .env.dev by default
$env:PLAYWRIGHT_ENV = 'dev'; npm test
```

3. Run tests against staging:

```powershell
$env:PLAYWRIGHT_ENV = 'staging'; npm test
```

Notes:
- The Playwright config reads `.env.${PLAYWRIGHT_ENV}` or falls back to `dev`.
- Adjust `.env.dev` and `.env.staging` as needed.

Allure reporting
----------------

1. Run tests (this will generate `allure-results`):

```powershell
$env:PLAYWRIGHT_ENV='dev'; npm test
```

2. Generate Allure report and open it locally:

```powershell
npm run allure:generate
npm run allure:open
```

If `allure` CLI is not available globally, the `allure-commandline` devDependency provides it via npm scripts added to `package.json`.


set PLAYWRIGHT_ENV=dev && npm test


npx playwright test --headed --slow-mo 3000

Windows (safe commands if your path contains spaces)

PowerShell:
```powershell
cd "D:\PRD [PERSONALIA 2.0]\playwright-personalia2.0"
$env:PLAYWRIGHT_ENV='dev'; npm test
npm run allure:generate
npm run allure:open
```

Command Prompt (single-line safe run):
```cmd
cd /d "D:\PRD [PERSONALIA 2.0]\playwright-personalia2.0" && set PLAYWRIGHT_ENV=dev && npm test && npx --no-install allure generate "allure-results" --clean -o "allure-report" && npx --no-install allure open "allure-report"
```
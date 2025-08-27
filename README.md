# SauceDemo Playwright (TypeScript) — sans POM

Tests Playwright simples pour valider le login de https://www.saucedemo.com/ 

## Prérequis
- Node.js 18+
- npm

## Installation
```bash
npm ci
npx playwright install --with-deps
```

## Lancer les tests
```bash
npx playwright test
```

## UI
```bash
npx playwright test --ui
```

## Variables d'environnement
Par défaut : `standard_user` / `secret_sauce`. Vous pouvez surcharger :
```bash
SAUCE_USER=mon_user SAUCE_PWD=mon_mdp npx playwright test
```

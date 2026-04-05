# Copilot Instructions — Karewa Frontend

## Commands

```bash
npm run dev       # Dev server on port 5174
npm run build     # Production build
npm run preview   # Preview production build
```

Format code with Prettier (no lint script exists):
```bash
npx prettier --write src/
```

There is no test suite.

## Architecture

This is a **Vue 3 + Vite** SPA. The domain is public-procurement management (contratos, proveedores, unidades administrativas) for Mexican government organizations. UI text and error messages are in Spanish.

```
src/
  api/          # HTTP layer — axios instance + apiRequest class
  store/        # Single Pinia store (KarewaAppStore)
  router/       # Vue Router with JWT auth guard
  helpers/      # Session management, yup locale, frontend error logging
  resources/    # Server error code → notification message map
  components/
    views/      # Page-level components organized by feature
    partials/   # Reusable UI components (sidebar, notifications, popups, etc.)
  assets/sass/  # ITCSS-style SASS: settings → objects → mixins → components → base
  mixins/       # Shared composable logic (e.g. organization fetching)
```

**Request lifecycle:** All HTTP calls go through `apiRequest` (`src/api/requests.js`). It automatically toggles `store.processing` (loading state) and handles 401 responses — clearing the session and showing a session-expired popup. Never call axios directly.

**Notifications:** After any API call, push alerts via `store.push_alert({ code: 'SOME_CODE' })`. The `code` must exist in `src/resources/errors.js`. Alerts auto-dismiss after 5 seconds.

**Auth:** JWT stored in `localStorage` under the key `${VITE_LOCALSTORAGE_SUFFIX}bearer`. The `userSession` class (`src/helpers/set.session.js`) handles set/verify/unSet. The router guard checks `userSession.verify()` on every navigation; routes with `meta: { login: true }` require a valid, non-expired token.

**Global state (Pinia store `KarewaAppStore`):**
- `processing` — global loading flag (toggled by `apiRequest`)
- `alerts` — notification queue consumed by `notifications.vue`
- `popup` — modal dialog data consumed by `popups.vue`
- `userData` — decoded JWT payload
- `company` — organization fetched on mount in `App.vue`
- `help` — help popup content

## Key Conventions

- **All components use `<script setup>`** (Composition API). Do not use Options API.
- **SASS indented syntax** (`.sass`, not `.scss`). Use tabs. The modern Sass compiler API is configured — use `@use` not `@import`.
- **Tabs for indentation** everywhere (JS, Vue, SASS, HTML).
- **Single quotes** in JavaScript/Vue script blocks.
- **Prettier config**: `printWidth: 260`, `singleAttributePerLine: true`, trailing commas ES5, tabs.
- **Icons**: `<icon-set>` is globally registered (`src/components/partials/icons.vue`). Material Symbols Outlined is used inline via `<span class="material-symbols-outlined">icon_name</span>`.
- **Component styles**: each partial/view imports its own SASS file via `<style lang="sass">@use "../../assets/sass/..."</style>`.
- **Form validation**: vee-validate `<Form>`, `<Field>`, `<ErrorMessage>` components + Yup schemas. Yup locale is set in `src/helpers/yup.locale.js` (Spanish messages) — import it where needed or rely on the global setup in `main.js`.
- **Debug logging**: use `import.meta.env.VITE_DEBUG` (aliased as `$debug` on `app.config.globalProperties`) to guard `console` calls. Never log unconditionally in production paths.
- **Frontend error logging**: call `frontEndLogs({ message, data })` (`src/helpers/frontend.logs.js`) for session/auth failures — it POSTs to the backend `frontend-logs/update` endpoint.
- **API request shape**:
  ```js
  new apiRequest().Get({ module: 'some-endpoint', params: '/optional-suffix' })
  new apiRequest().Post({ module: 'some-endpoint', data: { ... } })
  new apiRequest().Put({ module: 'some-endpoint', data: { ... } }, id)
  new apiRequest().Delete({ module: 'some-endpoint' }, id)
  ```
- **Route naming**: camelCase, descriptive — e.g. `proveedoresView`, `unidadesAdministrativasList`. Protected routes set `meta: { login: true }`.
- **View layout pattern**: authenticated views wrap content in `<div class="dash"><sidebar-component /><div class="content"><content-header /><main class="main">...</main></div></div>`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_ENDPOINT` | Base URL for all API requests |
| `VITE_LOCALSTORAGE_SUFFIX` | Prefix for localStorage keys |
| `VITE_DEBUG` | Enable verbose console logging |

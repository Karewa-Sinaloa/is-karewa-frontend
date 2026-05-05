# Karewa Frontend - Technical Specification

## 1. Project Overview

**Project Name**: Karewa Frontend
**Type**: Single Page Application (SPA) / Web Application
**Core Functionality**: Administrative system for managing contracts, vendors (proveedores), and administrative units with authentication, CRUD operations, and configuration dashboards.
**Target Users**: Administrative staff, contract managers, organization administrators

---

## 2. Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.5.26 | Frontend framework (Composition API) |
| Vite | 7.3.1 | Build tool and dev server |
| Pinia | 3.0.4 | State management |
| Vue Router | 4.6.4 | Client-side routing |

### Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| axios | 1.14.0 | HTTP client |
| vue-axios | 3.5.2 | Vue integration for axios |
| vee-validate | 4.15.1 | Form validation |
| yup | 1.7.1 | Schema validation |
| @vuepic/vue-datepicker | 12.1.0 | Date picker component |
| @vueuse/core | 14.2.1 | Vue composables utilities |
| jwt-decode | 4.0.0 | JWT token parsing |
| @hcaptcha/vue3-hcaptcha | 1.3.0 | hCaptcha integration |
| sass | 1.97.2 | CSS preprocessor |
| sass-embedded | 1.99.0 | Embedded Sass compiler |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-vue | 6.0.5 | Vue plugin for Vite |
| prettier | 3.8.1 | Code formatter |
| sass-loader | 16.0.7 | Sass loader for Vite |
| vite-plugin-vue-devtools | 8.1.1 | Vue devtools integration |

---

## 3. UI/UX Specification

### Design System

#### Color Palette (Based on _variables.sass)
- Primary colors for branding
- Secondary colors for UI elements
- Alert colors: success, warning, error, info
- Neutral colors: grays for backgrounds, borders, text

#### Typography
- Font families: system fonts, configured in _base.sass
- Font sizes: defined in variables for consistency
- Line heights: configured for readability

#### Spacing System
- Base unit: rem-based spacing
- Margins/paddings: standardized in SASS files
- Grid system: CSS Grid and Flexbox layouts

### Components

#### Layout Components
- **Sidebar** (`sidebar.vue`): Main navigation menu with collapsible sections
- **Content Header** (`content_header.vue`): Page headers with breadcrumbs and actions
- **Main Content Area**: Dynamic content based on route

#### Form Components
- **Input Fields**: Text, number, date, select inputs
- **Autocomplete**: `input-autocomplete.vue`, `address-input-autocomplete.vue`
- **File Upload**: `drag_drop_file.vue` with drag-and-drop support
- **Date Picker**: @vuepic/vue-datepicker integration
- **Captcha**: hCaptcha component for form protection

#### Feedback Components
- **Notifications** (`notifications.vue`): Toast-style alerts
- **Loading** (`loading.vue`): Spinner/loading indicator
- **Popups** (`popups.vue`): Modal dialogs
- **Confirmation Popup** (`confirmation_popup.vue`): Confirmation dialogs
- **Help System**: `help_icon.vue`, `help_popup.vue`

#### Data Display Components
- **Results Table** (`_results.sass`): Tabular data display with horizontal scroll
- **Pagination** (`pagination.vue`, `single_pagination.vue`): Page navigation
- **Search** (`search.vue`): Search functionality
- **Section** (`_section.sass`): Content grouping with headers

---

## 4. Feature Specification

### 4.1 Authentication Module

#### Login Flow
1. User navigates to `/acceso/inicio-de-sesion`
2. Enter credentials (email/password)
3. hCaptcha verification
4. JWT token returned and stored
5. Redirect to home page

#### Session Management
- JWT stored in localStorage with prefix `VITE_LOCALSTORAGE_SUFFIX` (default: `karewa_`)
- Token validation via `jwt-decode`
- Automatic session expiration check
- Logout: clears token and redirects to login

#### Password Recovery
- Recovery request: `/acceso/olvide-mi-contrasena`
- Password reset: `/acceso/cambiar-contrasena` (with token)
- Email verification: `/acceso/verificacion-de-usuario`

#### Registration
- New user registration: `/acceso/crear-cuenta`
- Email verification required

### 4.2 Providers Module (Proveedores)

#### List View (`proveedores/list.vue`)
- Paginated list of vendors
- Search functionality
- Results display with vendor details
- Actions: view, edit, delete

#### CRUD Operations
- **Create**: `/proveedores/nuevo`
- **Read**: `/proveedores/:id`
- **Update**: `/proveedores/:id`
- **Delete**: API endpoint with confirmation

#### Data Fields
- Vendor name, contact information
- Address (with autocomplete)
- RFC/tax identification
- Bank details
- Status/active flag

### 4.3 Administrative Units Module (Unidades Administrativas)

#### List View (`admin_units/list.vue`)
- Paginated list of administrative units
- Search and filter capabilities
- Unit hierarchy display

#### CRUD Operations
- **Create**: `/unidades-administrativas/nuevo`
- **Read**: `/unidades-administrativas/:id`
- **Update**: `/unidades-administrativas/:id`
- **Delete**: With dependency check

#### Data Fields
- Unit name and code
- Parent unit (hierarchy)
- Type/classification
- Responsible person
- Contact information

### 4.4 Contracts Module (Contratos)

#### List View (`contracts/contract_list.vue`)
- Paginated: `/contratos/p/:page`
- Sortable columns: date, provider, status
- Filters: by type, status, date range

#### Contract View (`contracts/contract_view.vue`)
- Form for creating/editing contracts
- Related entities: provider, administrative unit
- Contract metadata: dates, amounts, status
- Attached documents

#### Dashboard (`contracts/dash.vue`)
- Grid layout with configuration panels
- Quick access to CRUD operations

#### Configuration Sub-modules
| Module | Component | Description |
|--------|-----------|-------------|
| Procedimientos | `procedimientos.vue` | Contract procedure types |
| Materia | `materia.vue` | Contract subject/matter |
| Estatus | `estatus.vue` | Contract status types |
| Tipo | `tipo.vue` | Contract type definitions |
| Unit Types | `unit_types.vue` | Administrative unit types |
| Periodos | `periodos.vue` | Contract periods |

### 4.5 Organization Module

#### Organization View (`organization.vue`)
- Route: `/organizacion/mi-organizacion`
- Organization profile management
- Configuration settings

### 4.6 Home View

#### Home Page (`home.vue`)
- Dashboard with overview statistics
- Quick access to recent items
- Notifications/alerts display

---

## 5. API Specification

### Base Configuration

```
Base URL: VITE_API_ENDPOINT (https://karewaapi.criselgeek.com/api/v5)
Content-Type: application/json
Authentication: Bearer token in Authorization header
```

### API Request Class (`api/requests.js`)

```javascript
class apiRequest {
  Get(params, id)      // GET /module[/id][?params]
  Post(params)         // POST /module
  Put(params, id)      // PUT /module/id
  Delete(params, id)  // DELETE /module/id
  Upload(params, files) // POST with FormData
}
```

### Error Handling

#### Session Termination Codes
- `ACCESS003`: Session expired
- `ACCESS006`: Multiple session detected
- Action: Show popup, redirect to login, clear token

#### Error Messages
Mapped in `resources/errors.js`:
- Server errors (500s)
- Validation errors (APP_PAYLOAD_VALIDATION)
- Business logic errors (DUPLICATED, DELETED, etc.)

### Modules/Endpoints

| Module | CRUD Operations |
|--------|-----------------|
| `access/login` | POST - Authentication |
| `access/logout` | POST - Session termination |
| `organization` | GET - Organization data |
| `proveedores` | Full CRUD |
| `admin-units` | Full CRUD |
| `contracts` | Full CRUD |
| `contracts/procedimientos` | CRUD |
| `contracts/materia` | CRUD |
| `contracts/estatus` | CRUD |
| `contracts/tipo` | CRUD |
| `contracts/unit-types` | CRUD |
| `contracts/periodos` | CRUD |
| `config` | GET - Site configuration |

---

## 6. State Management (Pinia)

### Store: useAppStore

```javascript
state: {
  siteConfig: null,      // Site configuration from API
  userData: null,       // Decoded JWT user data
  alerts: [],           // Active notifications
  processing: false,    // Global loading state
  newElements: [],      // New items for tracking
  popup: null,          // Active popup data
  company: null,        // Organization data
  help: null            // Active help content
}
```

### Actions
- `addSiteConfig(data)`: Set site configuration
- `setUserData(data)`: Set authenticated user
- `push_alert(notification)`: Add notification
- `update_alerts(notifications)`: Replace all alerts
- `loading(state)`: Toggle global loading
- `new_elements(data)`: Track new items
- `showPopup(data)`: Display popup
- `setCompany(info)`: Set organization data
- `push_help(data)`: Set help content

---

## 7. Routing Specification

### Router Configuration (`router/index.js`)

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior: () => ({ x: 0, y: 0 })
})
```

### Route Protection

```javascript
router.beforeEach((to, from, next) => {
  // Check authentication via meta.login
  // Redirect unauthenticated users to login
  // Prevent authenticated users from accessing auth routes
})
```

### Route Meta Properties
- `login: true`: Requires authentication
- `login: false`: Public route (auth module)

---

## 8. Component Architecture

### Component Types

#### Views (Route Components)
Located in `src/components/views/`:
- Organized by feature/module
- Full page components
- Connected to router

#### Partials (Reusable Components)
Located in `src/components/partials/`:
- UI primitives
- Form components
- Display components
- Shared functionality

### Naming Conventions
- PascalCase for component files: `ComponentName.vue`
- Consistent with Vue 3 best practices
- Descriptive names indicating purpose

### Component Structure
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
// Composition API with <script setup>
</script>

<template>
<!-- Template with component markup -->
</template>

<style lang="sass">
// Scoped SASS styles
</style>
```

---

## 9. File Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # Axios instance factory
│   │   └── requests.js        # API request wrapper class
│   ├── assets/
│   │   ├── icons/             # UI icons (SVG, PNG)
│   │   ├── images/            # Logos, backgrounds
│   │   └── sass/
│   │       ├── base/          # Reset, base styles
│   │       ├── components/    # Component styles
│   │       ├── mixins/        # SASS mixins
│   │       ├── objects/       # Buttons, forms
│   │       └── settings/      # Variables, config
│   ├── components/
│   │   ├── partials/          # Shared components
│   │   └── views/            # Page components
│   │       ├── admin_units/
│   │       ├── contracts/
│   │       ├── proveedores/
│   │       ├── access.vue
│   │       ├── home.vue
│   │       └── organization.vue
│   ├── helpers/
│   │   ├── frontend.logs.js   # Logging utility
│   │   ├── set.session.js    # Session management
│   │   ├── site.config.vue   # Config mixin
│   │   └── yup.locale.js     # Validation locale
│   ├── mixins/
│   │   └── organization.js   # Organization composable
│   ├── resources/
│   │   └── errors.js         # Error message definitions
│   ├── router/
│   │   └── index.js         # Router configuration
│   ├── store/
│   │   └── index.js         # Pinia store
│   ├── App.vue              # Root component
│   └── main.js             # Application entry
├── resources/
│   └── cloudflared/        # Cloudflare tunnel config
├── .env                    # Environment variables
├── .prettierrc.json        # Prettier config
├── package.json            # Dependencies
├── vite.config.js          # Vite config
└── SPEC.md                 # This file
```

---

## 10. Development Guidelines

### Setup
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 5174)
npm run build        # Production build
npm run preview      # Preview production build
```

### Code Style
- Follow Prettier configuration (`.prettierrc.json`)
- Use Composition API with `<script setup>`
- ESLint/Prettier integration recommended

### SASS Guidelines
- Use BEM-like naming for classes
- Modular component styles
- Variables for colors, spacing, typography
- Mixins for reusable patterns

### Component Development
1. Create in appropriate directory (views vs partials)
2. Use Composition API
3. Add proper TypeScript-like JSDoc comments when needed
4. Include scoped styles
5. Test in isolation

---

## 11. Security Specification

### Authentication
- JWT-based authentication
- Token stored in localStorage (not cookies for SPA)
- Token expiration validation
- Secure token transmission via HTTPS

### Authorization
- Role-based access control (role_id in JWT)
- Route-level protection via meta fields
- API-level authorization checks

### CSRF Protection
- CORS configured on server
- Same-origin policy enforcement
- No sensitive data in URL parameters

### Input Validation
- Client-side validation with Yup
- Server-side validation as backup
- Sanitize user inputs
- File upload restrictions

### hCaptcha Integration
- Required for authentication forms
- Site key: `VITE_HCAPTCHA_KEY`
- Token validation on server

---

## 12. Browser Support

### Target Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Requirements
- ES2020+ features supported
- CSS Grid and Flexbox support
- Web Storage API support

---

## 13. Performance Requirements

### Build Optimization
- Code splitting by route
- Lazy loading for heavy components
- Tree-shaking unused code

### Runtime Performance
- Lazy initialization of heavy data
- Pagination for large lists
- Debounced search inputs

### Caching
- Static asset caching (immutable hashes)
- API response caching where appropriate

---

## 14. Environment Configuration

### Development
```
VITE_DEBUG=true
VITE_API_ENDPOINT=http://localhost:8000/api/v5
```

### Production
```
VITE_DEBUG=false
VITE_API_ENDPOINT=https://karewaapi.criselgeek.com/api/v5
```

---

## 15. Deployment

### Build Output
```bash
npm run build
# Output in dist/ directory
```

### Static Hosting
- Deploy `dist/` folder
- Configure SPA fallback (index.html for all routes)
- Set up 404 handling

### Cloudflare Tunnel (Optional)
- Configuration in `resources/cloudflared/`
- For development access to production-like environment

---

## 16. Testing Strategy

### Manual Testing
- Browser devtools for debugging
- Network tab for API calls
- Vue Devtools for state inspection

### Debug Mode
- `VITE_DEBUG=true` enables console logging
- API errors logged with full details
- Component re-render tracking

---

## 17. Dependencies Tree

```
karewa-front
├── @hcaptcha/vue3-hcaptcha@1.3.0
├── @vuepic/vue-datepicker@12.1.0
├── @vueuse/core@14.2.1
├── axios@1.14.0
├── jwt-decode@4.0.0
├── pinia@3.0.4
├── sass-embedded@1.99.0
├── vee-validate@4.15.1
├── vue@3.5.26
├── vue-axios@3.5.2
├── vue-router@4.6.4
└── yup@1.7.1
```

---

## 18. Version Information

- **Package Version**: 0.0.1
- **Vue Version**: 3.5.26
- **Vite Version**: 7.3.1
- **Node Version**: 18+ (for Vite 7.x)

---

*Last Updated: 2026-05-04*
*Document Version: 1.0*
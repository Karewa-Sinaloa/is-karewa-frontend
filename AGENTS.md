# Karewa Frontend - Documentación del Proyecto

## Descripción del Proyecto

Aplicación frontend desarrollada con Vue 3 y Vite para la gestión de contratos, proveedores y unidades administrativas. Forme parte del sistema integral Karewa que incluye administración de organizaciones y módulos de contratos.

## Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 7.3.1
- **State Management**: Pinia 3.0.4
- **Routing**: Vue Router 4.6.4
- **HTTP Client**: Axios 1.14.0 + Vue-Axios 3.5.2
- **Form Validation**: Vee-Validate 4.15.1 + Yup 1.7.1
- **Date Picker**: @vuepic/vue-datepicker 12.1.0
- **Utilities**: @vueuse/core 14.2.1, jwt-decode 4.0.0
- **Captcha**: @hcaptcha/vue3-hcaptcha 1.3.0
- **Styling**: Sass 1.97.2 + sass-embedded 1.99.0

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/                 # Configuración de API
│   │   ├── axios.js         # Instancia de Axios
│   │   └── requests.js      # Clase para peticiones HTTP
│   ├── assets/
│   │   ├── icons/           # Iconos del sistema
│   │   ├── images/          # Imágenes y logos
│   │   └── sass/            # Estilos SASS
│   │       ├── base/        # Estilos base
│   │       ├── components/  # Componentes de UI
│   │       ├── mixins/       # Mixins SASS
│   │       ├── objects/      # Objetos (forms, buttons)
│   │       └── settings/     # Variables y configuraciones
│   ├── components/
│   │   ├── partials/        # Componentes reutilizables
│   │   └── views/           # Vistas principales
│   │       ├── admin_units/  # Unidades administrativas
│   │       ├── contracts/   # Módulo de contratos
│   │       └── proveedores/  # Gestión de proveedores
│   ├── helpers/             # Utilidades y helpers
│   ├── mixins/              # Mixins Vue
│   ├── resources/           # Recursos (errores, configuración)
│   ├── router/              # Configuración de rutas
│   ├── store/               # Store de Pinia
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada
├── resources/
│   └── cloudflared/         # Configuración de tunnel
├── .env                     # Variables de entorno
├── vite.config.js           # Configuración de Vite
└── package.json             # Dependencias del proyecto
```

## Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build de producción
npm run preview # Previsualizar build de producción
```

## Variables de Entorno (.env)

```env
VITE_API_ENDPOINT=https://karewaapi.criselgeek.com/api/v5
VITE_LOCALSTORAGE_SUFFIX=karewa_
VITE_PASS_RESET_URL=https://appkarewa.criselgeek.com/acceso/cambiar-contrasena
VITE_USER_VERIFICATION_URL=https://appkarewa.criselgeek.com.com/acceso/verificacion-de-usuario
VITE_HCAPTCHA_KEY=643a6c56-8324-4e50-9d6c-586424803a50
VITE_CURRENCY_CODE=mxn
VITE_CURRENCY_LOCALE=es-MX
VITE_CURRENCY_DECIMALS=3
VITE_DEBUG=true
```

## Convenciones de Código (Prettier)

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "printWidth": 260,
  "semi": true,
  "singleQuote": true,
  "bracketSpacing": true,
  "braketSameLine": true,
  "arrowParens": "avoid",
  "vueIndentScriptAndStyle": true,
  "proseWrap": "always",
  "useTabs": true,
  "insert_final_newline": true,
  "endOfLine": "lf",
  "singleAttributePerLine": true
}
```

## Configuración de Vite

- **Puerto de desarrollo**: 5174
- **Host permitido**: appkarewa.criselgeek.com
- **Polling activo** para watchers
- **Preprocesador SASS** configurado con api modern-compiler

## Rutas Principales

| Ruta | Componente | Nombre | Descripción |
|------|------------|--------|-------------|
| `/` | home.vue | homeView | Página principal (requiere login) |
| `/organizacion/mi-organizacion` | organization.vue | organizationView | Configuración de organización |
| `/proveedores` | proveedores/list.vue | proveedoresList | Listado de proveedores |
| `/proveedores/nuevo` | proveedores/view.vue | proveedoresCreate | Crear proveedor |
| `/proveedores/:id` | proveedores/view.vue | proveedoresView | Ver/editar proveedor |
| `/unidades-administrativas` | admin_units/list.vue | unidadesAdministrativasList | Listado de unidades |
| `/unidades-administrativas/nuevo` | admin_units/view.vue | unidadesAdministrativasCreate | Crear unidad |
| `/unidades-administrativas/:id` | admin_units/view.vue | unidadesAdministrativasView | Ver/editar unidad |
| `/contratos` | contracts/contract_list.vue | contractList | Listado de contratos |
| `/contratos/p/:page` | contracts/contract_list.vue | contractList | Listado paginado |
| `/contratos/nuevo` | contracts/contract_view.vue | contractCreate | Crear contrato |
| `/contratos/:id` | contracts/contract_view.vue | contractView | Ver/editar contrato |
| `/contratos/configuraciones` | contracts/dash.vue | contractsConfigurations | Dashboard de configuración |
| `/acceso/` | access.vue | - | Módulo de acceso (sin login) |
| `/acceso/inicio-de-sesion` | login.vue | accessViewLogin | Login |
| `/acceso/olvide-mi-contrasena` | recovery.vue | accessViewRecovery | Recuperar contraseña |
| `/acceso/cambiar-contrasena` | reset.vue | accessViewReset | Resetear contraseña |
| `/acceso/crear-cuenta` | registration.vue | accessViewRegistration | Registro de usuario |
| `/acceso/verificacion-de-usuario` | verification.vue | accessViewValidation | Verificación de email |

## Módulo de Contratos

El módulo de contratos incluye configuración de:

- **Procedimientos**: Tipos de procedimientos de contratos
- **Materia**: Materia o asunto de los contratos
- **Estatus**: Estados de los contratos
- **Tipo**: Tipos de contratos
- **Tipos de Unidad**: Tipos de unidad administrativa vinculados
- **Periodos**: Periodos de contratos con gestión inline

### Componentes del Módulo de Contratos

- `contracts/dash.vue` - Dashboard de configuración
- `contracts/contract_list.vue` - Listado con paginación
- `contracts/contract_view.vue` - Formulario de alta/edición
- `contracts/periodos.vue` - Gestión de periodos
- `contracts/periodos_view.vue` - Formulario de periodo
- `contracts/procedimientos.vue` - CRUD procedimientos
- `contracts/materia.vue` - CRUD materia
- `contracts/estatus.vue` - CRUD estatus
- `contracts/tipo.vue` - CRUD tipos
- `contracts/unit_types.vue` - CRUD tipos de unidad
- `contracts/procedimientos_view.vue` - Formulario procedimiento
- `contracts/materia_view.vue` - Formulario materia
- `contracts/estatus_view.vue` - Formulario estatus
- `contracts/tipo_view.vue` - Formulario tipo
- `contracts/unit_types_view.vue` - Formulario tipo de unidad

## Componentes Parciales Reutilizables

- **Sidebar**: Menú de navegación principal
- **Pagination**: Paginación de listados
- **Search**: Componente de búsqueda
- **Popups**: Sistema de popups/modales
- **Notifications**: Sistema de notificaciones
- **Loading**: Indicador de carga
- **Confirmation Popup**: Popup de confirmación
- **Login/Recovery/Reset/Registration**: Componentes de autenticación
- **hcaptcha**: Componente de verificación Captcha
- **input-autocomplete**: Input con autocompletado
- **address-input-autocomplete**: Autocompletado de direcciones
- **drag_drop_file**: Componente de subida de archivos
- **help_icon / help_popup**: Sistema de ayuda contextual

## Sistema de Autenticación

- JWT almacenado en localStorage con prefijo `VITE_LOCALSTORAGE_SUFFIX`
- Clase `userSession` en `helpers/set.session.js` para gestión de sesiones
- Validación de tokens mediante `jwt-decode`
- Middleware de router para protección de rutas
- Manejo de sesión expirada y cierre de sesión automático

## Store de Pinia (useAppStore)

**Estado**:
- `siteConfig`: Configuración del sitio
- `userData`: Datos del usuario logueado
- `alerts`: Array de notificaciones
- `processing`: Estado de procesamiento
- `newElements`: Elementos nuevos
- `popup`: Popup activo
- `company`: Datos de la organización
- `help`: Ayuda activa

**Acciones**:
- `addSiteConfig()`, `setUserData()`, `push_help()`
- `push_alert()`, `update_alerts()`, `loading()`
- `new_elements()`, `showPopup()`, `setCompany()`

## API y Peticiones

La clase `apiRequest` en `api/requests.js` proporciona métodos:
- `Get(params, id)`: GET request
- `Post(params)`: POST request
- `Put(params, id)`: PUT request
- `Delete(params, id)`: DELETE request
- `Upload(params, files)`: Upload de archivos

Manejo automático de:
- Headers de autenticación (Bearer token)
- Estados de carga
- Errores y códigos de respuesta
- Cierre de sesión en errores 401 específicos

## Sistema de Validación

- **Yup** para esquemas de validación
- **Vee-Validate** para integración con formularios Vue
- Localización en `helpers/yup.locale.js`
- Validación de formularios del lado del cliente

## Mensajes de Error

Sistema de mensajes predefinido en `resources/errors.js`:
- Códigos de error del servidor (ACCESS002-007, MAILER001, etc.)
- Mensajes genéricos (SUCCESS, UPDATED, DELETED, etc.)
- Validación de errores (APP_PAYLOAD_VALIDATION)

## Changelog

El proyecto mantiene un changelog en `CHANGELOG.md` siguiendo el formato Keep a Changelog. Los cambios recientes incluyen:
- Gestión de periodos de contratos
- Listado paginado de contratos
- Dashboard de configuración de contratos
- Módulo CRUD completo para proveedores y unidades administrativas

## Notas de Desarrollo

Archivo `NOTES.md` disponible para notas de desarrollo y seguimiento del avance del proyecto.

## Dependencias de Desarrollo

- `@vitejs/plugin-vue`: Plugin de Vite para Vue
- `prettier`: Formateador de código
- `sass`: Preprocesador SASS
- `sass-loader`: Loader para SASS
- `vite-plugin-vue-devtools`: Plugin de devtools para Vue

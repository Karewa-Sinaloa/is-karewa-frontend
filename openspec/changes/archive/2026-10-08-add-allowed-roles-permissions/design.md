# Design

## Context

Ver `proposal.md` — Why.

Sólo el contexto que condiciona la forma:

- **Punto único de red.** Todo el tráfico sale de `apiRequest.processResponse` (`src/api/requests.js`), que ya recibe `params.module` —el literal que `pnpm api:sync` usa como identidad frente al contrato— y ya tiene el store en mano (`store.loading()`).
  `apiInstance.init()` se crea una vez por cada `apiRequest`.
- **Estado.** `src/store/index.js` es el único store, con `getters: {}` vacío y `userData` guardado como el JWT decodificado (`role_id` vive en `userData.data.role_id`). No existe hoy ninguna noción de permisos.
- **Cobertura real de `allowed_roles` en el contrato vigente** (verificada contra `docs/openapi.json` tras `pnpm api:sync`): 81 de 89 operaciones. Las 8 restantes son `POST /access/login`, `GET /access/logout`, `POST /access/recovery`, `POST /access/reset`,
  `GET /mailings` y los tres endpoints de documentación —ninguno es un listado CRUD—, de modo que los 14 módulos que consume el frontend sí lo declaran también en sus GET. Las claves `create`/`edit`/`delete` son opcionales dentro del objeto y los arrays son de
  `role_id` enteros, con `[]` = cualquier rol autenticado.
- **Superficie de UI.** Toda sección se abre con el mismo tramo `.section__top` → `h1.section__title`, y las acciones están repartidas en cuatro puntos: `.section__options` de cada vista, `result_options.vue` (menú por fila), `add_new_element.vue` (FAB,
  alimentado por `store.new_elements`) y `sidebar.vue` (enlaces de alta).

## Goals / Non-Goals

**Goals:**

- Una sola evaluación de permisos por `(sección, acción)` consultable desde cualquier plantilla.
- Que las acciones no autorizadas **no se rendericen**, en los cuatro puntos de control.
- Que el aviso de permisos sea un componente reutilizable y no texto copiado en 25 vistas.
- Que el comportamiento tras recargar la página sea el mismo que antes de recargar.

**Non-Goals:**

- Autorización real: el servidor sigue siendo la única autoridad; esto es puramente presentacional.
- Cambiar payloads, rutas o el proceso de login.
- Restringir navegación (`meta` de ruta) o lectura de datos: sólo acciones de escritura.
- Resolver en el frontend la ausencia puntual de `allowed_roles` en respuestas que no son de un módulo CRUD (login, logout, recuperación): esas secciones no tienen acciones que restringir.

## Decisions

### D1 — Captura en `apiRequest.processResponse`, no en un interceptor ni en el login

Extraer `allowed_roles` en el `.then` de `processResponse`, antes de `resolve(response)`, y pasarla al store con la clave `params.module`.

- **Por qué aquí:** es el único punto por el que pasan `Get`, `Post`, `Put`, `Delete` y `Upload`, ya conoce el módulo y ya tiene el store.
- **Descartado — interceptor de axios:** `apiInstance.init()` se instancia por cada `apiRequest` y no tiene referencia al store; además obligaría a leer `config.baseURL` para reconstruir el recurso.
- **Descartado — respuesta de login:** `POST /access/login` no trae `allowed_roles` en el contrato, y su payload se descarta hoy en `login.vue` salvo el token.
- **Descartado — leerlo del JWT:** no es un claim de la sesión; sólo viaja en el cuerpo de la respuesta.

### D2 — La clave de sección es `params.module`, literal

Se almacena exactamente el valor del `module:` del frontend (`proveedores`, `unidades-administrativas`, `users`, `config`, …), sin `/` inicial y descartando el `/id` que `processResponse` concatena.

- **Por qué:** ya es la identidad que el frontend usa frente al contrato y la que escanea `api:sync`; no hace falta una tabla de equivalencias que pueda desincronizarse.
- **Descartado — ruta de Vue Router:** no hay correspondencia 1:1. `contract_view.vue` consume nueve módulos distintos, `configuracion/usuario_view.vue` consume `users` y `roles`, y `configuracion/usuarios.vue` consume `users`.

### D3 — Estado en el store + acción `can(section, action)`

```js
state.allowedRoles = { [section]: { create: [], edit: [], delete: [] } };
```

Acción de solo lectura `can(section, action)` que devuelve `true` cuando:

1. la sección no está en `allowedRoles`, o
2. la acción no está en el objeto de esa sección, o
3. el array de la acción está vacío (semántica declarada del contrato: `[]` = cualquier rol autenticado), o
4. `userData.data.role_id` está en el array.

`false` sólo cuando hay un array declarado, no vacío, que no contiene al rol actual.

- **Por qué una acción y no un getter parametrizado:** `getters: {}` está vacío en este store y todos los accesos derivados son acciones; además una acción lee el estado de forma incondicional, sin depender del detalle de caché de los getters que devuelven
  funciones.
- **Por qué fail-open (reglas 1-3):** es la decisión tomada para las secciones cuyos GET todavía no traen el campo. Consistencia: "sin datos" y "lista vacía" producen el mismo resultado observable.

### D4 — Persistencia en `localStorage`, limpia al cerrar la sesión

Clave `${VITE_LOCALSTORAGE_SUFFIX}permissions`, valor JSON del mapa. Se serializa al cambiar y se descarga en `userSession.unSet()`; `userSession.verify()` lo hidrata junto al `userData`.

- **Por qué persistir:** el mapa tiene que estar en su sitio en el primer pintado, antes de que responda el listado; sin persistir, la restricción y el aviso llegarían tarde en la primera visita y dependerían de que cada sección vuelva a declararse en cada
  recarga. El requisito "Vigencia de los permisos" exige además que una recarga no espere una respuesta nueva.
- **Descartado — no persistir:** la ocultación quedaría sujeta a que el GET de cada sección vuelva a traer el campo en cada visita, algo que no está garantizado por contrato para toda respuesta.

### D5 — Filtrar en los cuatro puntos de control, sin tocar la política en cada vista

| Punto                                           | Cómo                                                                                                                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result_options.vue`                            | `optionList` gana la clave `edit` (opcional, ausente = `true`) que gata **todas** las entradas de editar —el enlace con `query.edit` y el botón de `pop`— sin tocar "Ver", que sigue a cargo de `go` |
| `add_new_element.vue`                           | Cada elemento registrado añade `section`; el parcial filtra con `can(section, 'create')`                                                                                                             |
| `.section__options` y empty-state de cada vista | `v-if="can(seccion, accion)"` en la propia vista                                                                                                                                                     |
| `sidebar.vue`                                   | `v-if` sobre los tres enlaces de alta (Proveedores, U. Admin, Contratos)                                                                                                                             |

- **Por qué separar `edit` de `go` en `result_options`:** hoy `optionList.go` renderiza _tanto_ "Ver" como "Editar". Gatar `go` con `edit` escondería la lectura, que no está restringida.
- **Por qué filtrar `new_elements` dentro del parcial y no en la vista:** el registro ocurre una sola vez en `onMounted`, que corre **antes** de que llegue cualquier `allowed_roles`; filtrar al registrar dejaría el FAB visible de todas formas. Filtrar en el
  parcial mantiene el requisito de `app-store` de registrar/clear por ruta y añade la condición de rol encima. Es el único punto donde cambia un requisito existente (delta `app-store`).
- **Por qué no meter la política dentro de `result_options`:** se le pasa `optionList` desde diez padres; el parcial sólo aprende una llave más y sigue sin conocer el store.

### D6 — Aviso: parcial nuevo + elemento `.section__notice`

`src/components/partials/permission_notice.vue`, con `section` como única prop: devuelve nada cuando `can` es `true` para las tres acciones, y si no, pinta un párrafo bajo el título.

- **Estilo:** elemento nuevo dentro del bloque existente `.section`, en `src/assets/sass/components/_section.sass`, junto a `__title` y `__help-text`, con `color: var(--color-danger)`.
- **Por qué elemento y no modificador de `.section__help-text`:** el subtítulo descriptivo y el estado de permisos son cosas distintas; mezclarlos obligaría a condicionar un texto fijo. Un elemento del bloque no es una "variante de bloque suelta", así que no
  contradice la nomenclatura BEM de `design-system`.
- **Por qué `--color-danger`:** ya existe como token plano en `_base.sass` (`#750739`); no hay que declarar tokens nuevos ni usar literales hex, y es el color más contrastante de la paleta —decisión tomada por el usuario.

### D7 — Orden de ejecución: primero `pnpm api:sync`

Actualizar la copia versionada y el reporte **antes** de escribir código, para saber con qué contrato real se está trabajando y si `allowed_roles` introduce desalineaciones o gaps nuevos que resolver según `openapi-contract`.

## Risks / Trade-offs

- **La cobertura de `allowed_roles` puede retroceder** → Hoy declara 81 de 89 operaciones, incluidos todos los GET de los módulos CRUD, pero nada impide que el backend deje de traerlo en un listado. El fail-open hace que ese caso sea indistinguible del
  comportamiento actual: sin aviso y con los controles visibles, sin romper la interfaz. Se re-verifica con `pnpm api:sync`.
- **Ocultar en la UI no es autorización** → El servidor sigue rechazando lo que el rol no puede. El aviso evita el error inesperado, no lo sustituye. No se toca ningún payload.
- **Primer render puede mostrar un control que después se oculta** → Sólo en la primera visita, antes de persistir el mapa. A partir de la recarga el comportamiento es estable.
- **`optionList.edit` es una contract break silenciosa en `result_options`** → Se define opcional con default `true`, de modo que los padres que no lo pasen se comportan exactamente como hoy.
- **Reactividad de `can()` en plantillas** → Al ser acción sin caché, cada render lee el estado; se confirma en `pnpm dev` recorriendo un listado restringido.

## Migration Plan

Sin datos que migrar y sin cambios de API hacia el servidor: despliegue en un solo paso.

1. `pnpm api:sync` y resolución de cualquier divergencia nueva que reporte.
2. Store + captura + persistencia (sin cambios visibles todavía: todo falla abierto).
3. Enforcement en los cuatro puntos de control + aviso.
4. Verificación en `pnpm dev` con roles restringido y autorizado, más `pnpm build`.

**Rollback:** revertir el commit. El estado es derivado y se limpia al cerrar sesión; no deja residuo en el navegador más allá de la clave de `localStorage`, que se sobrescribe o se borra con el logout.

## Open Questions

- **RESUELTA — cobertura de `allowed_roles` (task 6.3).** Tras `pnpm api:sync`, 81 de 89 operaciones lo traen y sólo lo omiten `POST /access/login`, `GET /access/logout`, `POST /access/recovery`, `POST /access/reset`, `GET /mailings` y los tres endpoints de
  documentación. Los 14 módulos CRUD que consume el frontend sí lo declaran también en sus GET, así que **todas las secciones con acciones son restringibles por lectura**: ninguna queda fuera de alcance. La primera lectura del contrato —previa a `api:sync`,
  cuando se formularon las preguntas de alcance— mostraba sólo 51 operaciones porque el backend amplió la cobertura durante la sesión; el fail-open se mantiene como red de seguridad por si retrocede.
- **¿`partidas` y `config` necesitan sección propia en la UI?** `partidas` sólo se consume dentro de `contract_view.vue` y `config` sólo en `configuracion/config.vue` y `config_view.vue`; hoy no hay listado propio de `partidas`, así que el aviso sólo aplicaría
  donde ya hay `.section__top`.

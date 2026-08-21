# Manual de entorno de desarrollo

## Prerrequisitos

- Docker Engine + Docker Compose v2.
- `cloudflared` instalado en el host.
- Credenciales del nuevo tunnel en `~/.cloudflared`.
- `pnpm` se usa dentro del contenedor de frontend.

## Stack detectado

- Frontend Vue 3 + Vite.
- No hay backend local.
- No hay base de datos local.
- API consumida por `VITE_API_ENDPOINT`.

## Decisiones

- `frontend`: aprobado.
- `proxy`: aprobado.
- `cloudflared`: aprobado, tunnel nuevo.
- `db`, `cache`, `worker`, `mail`, `db admin`: rechazados.

## Primera vez

```bash
docker network create app_net
cp .env.example .env
```

Si `8081` ya está ocupado, cambia `KAREWA_PROXY_PORT` en `.env` antes de levantar.

El proxy resuelve `frontend` por DNS interno de Docker en runtime.

Editar `.env` y confirmar:

- `CLOUDFLARED_TUNNEL_ID`
- `CLOUDFLARED_HOSTNAME=kapp.chavodigital.com`
- `CLOUDFLARED_CREDENTIALS_FILE=/etc/cloudflared/<uuid>.json`
- `CLOUDFLARED_HOST_CREDENTIALS_PATH=/home/criselgeek/.cloudflared/<uuid>.json`

## Bootstrap del tunnel nuevo

```bash
cloudflared tunnel login
cloudflared tunnel create karewa_app
cloudflared tunnel route dns karewa_app kapp.chavodigital.com
cloudflared tunnel list
```

Luego copiar el UUID generado a:

- `CLOUDFLARED_TUNNEL_ID`
- `CLOUDFLARED_CREDENTIALS_FILE`
- `CLOUDFLARED_HOST_CREDENTIALS_PATH`

## Arranque diario

```bash
docker compose up -d --build
docker compose --profile cloudflared up -d --build
```

## Nota de montaje

- El código vive en el host y se monta en `/app`.
- La imagen solo prepara dependencias y runtime.

## Comandos diarios

```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f proxy
docker compose exec frontend sh
docker compose down
```

## Flujo frontend

- Cambios en código: hot reload via bind mount.
- Variables: ajustar `.env` y reiniciar `frontend`.
- URL local: `http://localhost:8080`.

## Flujo API

- `VITE_API_ENDPOINT` apunta al REST externo.
- No tocar servicios de DB porque este stack no la incluye.

## Profiles opcionales

- `cloudflared`: expone el proxy por el tunnel.

## Cloudflared: tunnel existente

```bash
cloudflared tunnel list
cloudflared tunnel info <my_tunnel>
```

## Cloudflared: tunnel nuevo

```bash
cloudflared tunnel login
cloudflared tunnel create karewa_app
cloudflared tunnel route dns karewa_app kapp.chavodigital.com
cloudflared tunnel list
docker compose --profile cloudflared up -d --build
```

Configuración fija del tunnel:

- `docker/cloudflared/config.yml`
- origin interno: `http://proxy:80`

## Troubleshooting rapido

- Si Vite no recarga: `docker compose restart frontend`.
- Si Nginx no responde: `docker compose restart proxy`.
- Si Cloudflared no levanta: validar UUID y rutas en `.env`.
- Si el tunnel queda con referencias viejas:

```bash
docker compose --profile cloudflared down
docker network prune -f
docker compose --profile cloudflared up -d --build
```

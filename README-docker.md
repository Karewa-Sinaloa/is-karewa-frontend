# Docker local stack

Stack local para la app Vue/Vite.

## Servicios

- `frontend`: Vite dev server en Node 20.
- `proxy`: Nginx como entrada local.
- `cloudflared`: túnel nombrado nuevo hacia `proxy`.
- Paquete: `pnpm`.

Cloudflared usa `docker/cloudflared/config.yml`.

## Inicio rapido

```bash
docker network create app_net
cp .env.example .env
docker compose up -d --build
docker compose --profile cloudflared up -d --build
```

## Acceso

- Local: `http://localhost:8080`
- Tunnel: `https://kapp.chavodigital.com`

## Comandos utiles

```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f proxy
docker compose --profile cloudflared logs -f cloudflared
docker compose exec frontend sh
```

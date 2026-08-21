COMPOSE := docker compose

.PHONY: up down logs ps shell tunnel-up tunnel-logs

up:
	$(COMPOSE) up -d --build

tunnel-up:
	$(COMPOSE) --profile cloudflared up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

shell:
	$(COMPOSE) exec frontend sh

tunnel-logs:
	$(COMPOSE) --profile cloudflared logs -f cloudflared

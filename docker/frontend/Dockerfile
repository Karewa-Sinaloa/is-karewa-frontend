FROM node:20.19.5-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.16.0 --activate
RUN apk add --no-cache wget

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

EXPOSE 5174

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0", "--port", "5174"]

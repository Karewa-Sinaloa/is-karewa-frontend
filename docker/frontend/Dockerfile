FROM node:20.19.5-alpine

WORKDIR /app

RUN npm install -g pnpm@12.8.1
RUN apk add --no-cache wget

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

EXPOSE 5174

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0", "--port", "5174"]

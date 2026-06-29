# Stage 1: Build
FROM node:22-alpine AS builder
RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_TOOLS_API
ENV VITE_TOOLS_API=$VITE_TOOLS_API
RUN pnpm run build

# Stage 2: Run
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/server/server.js"]
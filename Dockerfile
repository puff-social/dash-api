FROM node:18 AS builder

ARG NPM_CONFIG_USERCONFIG
ARG NPM_TOKEN

WORKDIR /app
COPY .npmrc.ci package*.json pnpm-lock.yaml ./
COPY db ./db
COPY internal-db ./internal-db

RUN yarn global add pnpm
RUN pnpm install
RUN pnpm prisma

# RUN pnpm prisma generate

COPY . .
RUN yarn build

FROM node:18

RUN yarn global add pnpm

LABEL org.opencontainers.image.source=https://github.com/puff-social/dash-api

WORKDIR /app

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/generated generated
COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json ./

ENTRYPOINT pnpm start

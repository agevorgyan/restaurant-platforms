FROM node:20-alpine AS base

WORKDIR /app
COPY package.json package-lock.json ./
COPY pnpm-workspace.yaml turbo.json ./
COPY packages/ packages/
COPY apps/ apps/

RUN npm ci

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

RUN npx turbo run build --filter=@saas/${APP_NAME}

# Expose port
EXPOSE 3000

CMD npm run start --workspace=@saas/${APP_NAME}

ARG NODE_VERSION=18.19.0-slim
FROM node:${NODE_VERSION} as build

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 build-essential && \
    apt-get purge -y --auto-remove && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/node

COPY package*.json ./
RUN npm ci --loglevel info

COPY . .
RUN npm run build

RUN mv node_modules _modules && \
    npm ci --omit=dev --loglevel info

FROM node:${NODE_VERSION} as prod
ENV USER="node"
ENV APP_DIR="/home/node"
WORKDIR ${APP_DIR}

COPY --chown=${USER}:${USER} package*.json ./
COPY --from=build --chown=${USER}:${USER} ${APP_DIR}/node_modules ./node_modules
COPY --from=build --chown=${USER}:${USER} ${APP_DIR}/dist ./dist

CMD [ "node", "./dist/index.js" ]

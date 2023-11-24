ARG NODE_VERSION=18.18.2-slim
FROM node:${NODE_VERSION} as base

ENV USER=evobot

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 build-essential && \
    apt-get purge -y --auto-remove && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r ${USER} && \
    useradd --create-home --home /home/evobot -r -g ${USER} ${USER}

USER ${USER}
WORKDIR /home/evobot

FROM base as build

COPY --chown=${USER}:${USER}  . .
RUN npm ci
RUN npm run build

FROM base as prod

COPY --chown=${USER}:${USER} package*.json ./
COPY --from=build --chown=${USER}:${USER} /home/evobot/node_modules ./node_modules
COPY --from=build --chown=${USER}:${USER} /home/evobot/dist ./dist

ENTRYPOINT [ "npm", "run", "prod" ]
FROM node:14.16.1-slim

ENV USER=klaas1

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove

# create klaas1 user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/klaas1 -r -g ${USER} ${USER}

# set up volume and user
USER ${USER}
WORKDIR /home/klaas1

COPY --chown=${USER}:${USER} package*.json ./
RUN npm install
VOLUME [ "/home/klaas1" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "node", "index.js" ]

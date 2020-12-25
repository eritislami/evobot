FROM node:12.19-alpine
	
# set up volume and user
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
VOLUME [ "/home/fred" ]

COPY . .

ENTRYPOINT [ "npm", "start" ]
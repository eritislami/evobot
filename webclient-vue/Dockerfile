FROM node:12.19-alpine as build-image
	
# set up volume and user
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build


# Stage 2: Deploy to nginx
FROM nginx:alpine
RUN mkdir /app
COPY --from=build-image /app/dist /app
COPY nginx/nginx.conf /etc/nginx/nginx.conf


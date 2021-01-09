FROM node:12.19-alpine as build
	
# set up volume and user
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
RUN yarn

COPY . .

RUN yarn build


# Stage 2: Deploy to nginx
FROM nginx:1.18-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 3000
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
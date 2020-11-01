FROM node:lts-alpine

# Set node environment
ENV NODE_ENV production

# Set application folder
WORKDIR /app

# Add files and install dependencies
ADD . .
RUN npm install

# Run application
CMD [ "node", "index.js" ]
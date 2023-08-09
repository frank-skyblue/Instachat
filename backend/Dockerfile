# Dockerfile adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
RUN npm install -g typescript
COPY ./ ./
RUN npm run build
EXPOSE 5000 5001
CMD [ "node", "./dist/src/server.js" ]
# Dockerfile adapted from https://mherman.org/blog/dockerizing-a-react-app/
FROM node:14-alpine3.14 as build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH NODE_ENV=production
COPY ./package.json ./
RUN npm i
COPY ./ ./
RUN npm run build

FROM nginx:stable-alpine
ENV NODE_ENV production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443 80
CMD ["nginx", "-g", "daemon off;"]

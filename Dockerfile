
FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=builder app/codebase /usr/share/nginx/html/codebase/
COPY build/index.html /usr/share/nginx/html/
COPY build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder app/node_modules/@mdi/font/css/materialdesignicons.css /usr/share/nginx/html/codebase/css/
COPY --from=builder app/node_modules/@mdi/font/fonts /usr/share/nginx/html/codebase/fonts/
RUN chmod -R 765 /usr/share/nginx/html/codebase/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
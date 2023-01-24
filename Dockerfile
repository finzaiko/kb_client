
FROM node:16-alpine as builder
ENV WDIR=/app
WORKDIR ${WDIR}
ARG API_SERVER_ARG='API_BASE_URL'
# ENV API_SERVER=${API_SERVER_ARG}
COPY . .
RUN npm ci
RUN npm run buildconf --endpoint=${API_SERVER_ARG}

FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=builder app/codebase /usr/share/nginx/html/codebase/
COPY --from=builder build/index.html /usr/share/nginx/html/
COPY --from=builder build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder build/start.sh /
# COPY --from=builder build/start.sh /
COPY --from=builder app/node_modules/webix/webix.min.js /usr/share/nginx/html/codebase/
COPY --from=builder app/node_modules/webix/webix.min.css /usr/share/nginx/html/codebase/
COPY --from=builder app/node_modules/@mdi/font/css/materialdesignicons.css /usr/share/nginx/html/codebase/css/
COPY --from=builder app/node_modules/@mdi/font/fonts /usr/share/nginx/html/codebase/fonts/
RUN chmod -R 765 /usr/share/nginx/html/codebase/
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "start.sh"]
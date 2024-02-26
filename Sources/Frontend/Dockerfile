FROM node:20-alpine3.18 as build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM nginx
COPY --from=build /app/dist /var/www/html/
COPY --from=build /app/site.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
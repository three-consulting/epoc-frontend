FROM node:16-alpine as builder

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_APIKEY

WORKDIR /usr/app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

FROM nginx:1.23.1-alpine as production

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/app/out /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
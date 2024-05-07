FROM node:lts-alpine
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY . .
EXPOSE 3000
RUN yarn
CMD ["nodemon", "src/index.ts"]
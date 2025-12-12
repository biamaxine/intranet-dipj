FROM node:22.21.1-alpine3.23

RUN apk add --no-cache bash

RUN npm i -g @nestjs/cli

WORKDIR /home/node/api

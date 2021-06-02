# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json /app/

RUN apk add --update --no-cache python2
RUN apk add --update --no-cache python3

RUN npm install node-sass
RUN npm install
RUN npm rebuild node-sass

# Copying source files
COPY . /app

# Building app
EXPOSE 3000

CMD ["npm", "start"]

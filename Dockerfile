FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN touch ./beerNightState.json

EXPOSE 3000

CMD ["npm", "run", "dev"]

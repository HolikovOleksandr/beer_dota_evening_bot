FROM node:20-alpine

# Робоча папка
WORKDIR /usr/src/app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь проєкт
COPY . .

# Створюємо валідний порожній JSON для стану
RUN echo "{}" > ./beerNightState.json

# Експортуємо порт
EXPOSE 2999

# Стартова команда
CMD ["npm", "run", "dev"]

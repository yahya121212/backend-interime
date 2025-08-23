FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build le projet
RUN npm run build

# Run migrations avant de lancer l'app
RUN npm run typeorm migration:run

EXPOSE 3000

# Démarrer l'app
CMD ["npm", "run", "start:prod"]

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build le projet avec migrations incluses
RUN npm run build

EXPOSE 3000

# Start prod: TypeORM va exécuter les migrations automatiquement
CMD ["npm", "run", "start:prod"]

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build le projet
RUN npm run build

# Run migrations à partir du JS compilé
RUN node dist/data-source.js migration:run

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

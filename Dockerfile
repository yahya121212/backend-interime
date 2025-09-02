FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN mkdir -p /app/uploads/cvs /app/uploads/covers /app/uploads/images


COPY . .

# Build TypeScript + migrations
RUN npm run build

EXPOSE 3000

# Start prod : TypeORM exécutera les migrations automatiquement
CMD ["npm", "run", "start:prod"]

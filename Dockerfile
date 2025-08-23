FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the project
RUN npm run build

EXPOSE 3000

# Run the compiled JS instead of ts-node
CMD ["npm", "run", "start:prod"]

FROM node

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3003

CMD [ "pnpm", "run", "dev" ]
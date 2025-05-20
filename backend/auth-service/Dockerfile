FROM node

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD [ "pnpm", "run", "dev" ]
FROM node

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3004

CMD [ "pnpm", "run", "dev" ]
FROM node:latest

WORKDIR /api

COPY . .

RUN npm i
RUN npm run build

CMD ["npm", "run", "start:prod"]

EXPOSE 3000


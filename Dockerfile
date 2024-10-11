FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install

RUN npm install -g typescript

RUN npm run build

EXPOSE 8080 80

CMD ["npm", "run", "start"]

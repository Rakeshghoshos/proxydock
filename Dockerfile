FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install

RUN npm install -g typescript

RUN npm run build

CMD ["npm", "run", "start"]

FROM node:12.2.0-alpine

WORKDIR /modules

EXPOSE 9008

RUN npm install -g nodemon 

COPY package*.json ./

RUN npm install

COPY . .

CMD ["nodemon", "."]
FROM node:18

COPY ./main.env ./

WORKDIR /api_service

COPY ./api_service/package*.json ./

COPY ./api_service/build/ ./build

RUN npm ci --omit=dev

CMD [ "npm", "run", "start" ]




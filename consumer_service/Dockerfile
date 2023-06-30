FROM node:18

COPY ./main.env ./

WORKDIR /consumer_service

COPY ./consumer_service/package*.json ./

COPY ./consumer_service/build/ ./build

RUN npm ci --omit=dev

ENV CONSUMER_TYPE=test

CMD npm run start:${CONSUMER_TYPE}




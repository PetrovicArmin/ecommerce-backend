FROM node:18

ARG CONSUMER_TYPE

COPY ./main.env ./

WORKDIR /consumer_service

COPY ./consumer_service/package*.json ./

COPY ./consumer_service/build/ ./build

RUN npm ci --omit=dev

CMD [ "npm", "run", "start:${CONSUMER_TYPE}" ]




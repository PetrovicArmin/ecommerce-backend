import dotenv from "dotenv";
import kafkaCluster from "../api_service/kafka/kafkaCluster.js";
import path from "path";
import { fileURLToPath } from "url";
import PostgresDatabase from '../api_service/database/postgresHandler.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', '..', '..', 'main.env')});

const consumerGroup: string = process.argv[2];

console.log("Consumer type: " + consumerGroup);


if (process.env.NODE_ENV == undefined) 
    throw Error("You have not NODE_ENV environment variable set up");

PostgresDatabase.createDatabase(process.env.NODE_ENV);

kafkaCluster.configureKafkaServer(process.env.NODE_ENV, 'consumer-service');

const consumer = kafkaCluster.createConsumer(consumerGroup);

let topics: string[] = [];

if (consumerGroup == "inventory") {
    topics = ['inventoryLogs'];
} else {
    topics = ['skuLogs', 'productLogs'];
}

await consumer.connect()
await consumer.subscribe({ topics: topics });

await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log('received message!');
        console.log('    topic: ', topic);
        console.log('    partition: ', partition);
        if (!message.value) 
            return;
        
        let log: any = JSON.parse(message.value.toString());

        console.log('    message: \n', JSON.stringify(log, undefined, 2));

        PostgresDatabase.getTable(topic).create(log);
    },
})
import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import path from "path";
import { fileURLToPath } from "url";
import PostgresDatabase from '../api_service/database/postgresHandler.js';

//process.stdin.resume(); //halt program termination

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', '..', '..', 'main.env')});

const consumerGroup: string = process.argv[2];

console.log("Consumer type: " + consumerGroup);

const db: PostgresDatabase = PostgresDatabase.createDatabase('development');
 
const kafka: Kafka = new Kafka({
    clientId: 'consumer-service',
    brokers: [
        `localhost:${process.env.KAFKA1_PORT}`, 
        `localhost:${process.env.KAFKA2_PORT}`, 
        `localhost:${process.env.KAFKA3_PORT}`
    ]
});

const consumer = kafka.consumer({ groupId: consumerGroup });
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
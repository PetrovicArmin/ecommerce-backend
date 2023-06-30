import { Admin, Consumer, ITopicConfig, ITopicMetadata, Kafka, Message, Producer, TopicMessages } from "kafkajs";
import ChangeType from "../models/changeType.js";

let kafka: Kafka | undefined = undefined;

const configureKafkaServer = (type: string, clientId: string): void => {
    let kafka1Port: string | undefined = process.env.KAFKA1_PORT;
    let kafka2Port: string | undefined = process.env.KAFKA2_PORT;
    let kafka3Port: string | undefined = process.env.KAFKA3_PORT;

    let kafka1Host: string | undefined = 'localhost';
    let kafka2Host: string | undefined = 'localhost';
    let kafka3Host: string | undefined = 'localhost';

    if (type == "PRODUCTION") {
        console.log('dosao sam ovdje!');
        kafka1Port = "29092";
        kafka2Port = "29092";
        kafka3Port = "29092";

        kafka1Host = "kafka1";
        kafka2Host = "kafka2";
        kafka3Host = "kafka3";
    }

    kafka = new Kafka({
        clientId: clientId,
        brokers: [
            `${kafka1Host}:${kafka1Port}`, 
            `${kafka2Host}:${kafka2Port}`, 
            `${kafka3Host}:${kafka3Port}`
        ]
    });
}

const configureKafkaTopics = async (topics: ITopicConfig[]): Promise<void> => {
    
    try {
        if (kafka == undefined) 
            throw Error("You have not set up kafka server!");

        const admin: Admin = kafka.admin();

        await admin.connect();

        await admin.createTopics({ topics: topics });

        const metaData: ITopicMetadata[] = (await admin.fetchTopicMetadata({ topics: topics.map(top => top.topic) })).topics;

        console.log("Created topics metadata: ");
        console.log(JSON.stringify(metaData, undefined, 2));

        await admin.disconnect();
    } catch(err) {
        console.error(err);
    }
};

const createConsumer = (consumerGroup: string): Consumer => {
    if (kafka == undefined)
        throw Error('You have not set up kafka server');
    return kafka.consumer({ groupId: consumerGroup })
}

const sendMessage = async (topic: string, messages: Message[]): Promise<void> => {
    if (kafka == undefined) 
        throw Error("You have not set up kafka server!");
    
    const producer: Producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: messages
    });
    await producer.disconnect();
}   

const productsEvent = async (productId: number, userId: number, changeType: ChangeType) => {
    await kafkaCluster.sendMessage('productLogs', [{
        value: JSON.stringify({
            productId: productId,
            changedByUserId: userId,
            changeType: changeType,
            changeDateTime: new Date()
        })
    }]);
};

const skusEvent = async (skuId: number, userId: number, changeType: ChangeType) => {
    await kafkaCluster.sendMessage('skuLogs', [{
        value: JSON.stringify({
            skuId: skuId,
            changedByUserId: userId,
            changeType: changeType,
            changeDateTime: new Date()
        })
    }]);
}

const inventoryEvent = async (skuId: number, userId: number, changeType: ChangeType, quantityChange: number) => {
    await kafkaCluster.sendMessage('inventoryLogs', [{
        value: JSON.stringify({
            skuId: skuId,
            changedByUserId: userId,
            changeType: changeType,
            changeDateTime: new Date(),
            quantityChange: quantityChange
        })
    }]);
}

const kafkaCluster = {
    configureKafkaTopics,
    configureKafkaServer,
    sendMessage,
    productsEvent,
    skusEvent,
    inventoryEvent,
    createConsumer
};

export default kafkaCluster;
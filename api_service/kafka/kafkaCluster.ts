import { Admin, ITopicConfig, ITopicMetadata, Kafka, Message, Producer, TopicMessages } from "kafkajs";

let kafka: Kafka | undefined = undefined;

const configureKafkaServer = (): void => {
    kafka = new Kafka({
        clientId: 'api-service',
        brokers: [
            `localhost:${process.env.KAFKA1_PORT}`, 
            `localhost:${process.env.KAFKA2_PORT}`, 
            `localhost:${process.env.KAFKA3_PORT}`
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

const sendMessages = async (topicMessages: TopicMessages[]): Promise<void> => {
    if (kafka == undefined)
        throw Error("You have not set up kafka server!");

    const producer: Producer = kafka?.producer();

    await producer.connect();
    await producer.sendBatch({
        topicMessages: topicMessages
    });
    await producer.disconnect();
}

const kafkaCluster = {
    configureKafkaTopics,
    configureKafkaServer,
    sendMessage
};

export default kafkaCluster;
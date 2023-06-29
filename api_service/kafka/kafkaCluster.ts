import { Admin, ITopicConfig, ITopicMetadata, Kafka } from "kafkajs";

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

const kafkaCluster = {
    configureKafkaTopics,
    configureKafkaServer
};

export default kafkaCluster;
import { Consumer, EachMessagePayload, Kafka, KafkaConfig } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { Config } from "./index";
import { createNotificationTransport } from "../factories/notification-factory";
import { handleOrderHtml, handleOrderText } from "../handlers/orderHander";

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
   let kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };

    if (Config.env.nodeEnv === "production") {
      kafkaConfig = {
        ...kafkaConfig,
        ssl: true,
        connectionTimeout: 45000,
        sasl: {
          mechanism: "plain",
          username: Config.kafka.sasl.username,
          password: Config.kafka.sasl.password,
        },
      };
    }

    const kafka = new Kafka(kafkaConfig);

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        });

        if (topic === "order") {
          const transport = createNotificationTransport("mail");

          const event = JSON.parse(message.value.toString());

          const customerEmail = event.data.customerEmail;

          await transport.send({
            to: customerEmail,
            subject: "Order update.",
            text: handleOrderText(event),
            html: handleOrderHtml(event),
          });
          console.log(`Email sent to ${customerEmail}`);
        }
      },
    });
  }
}

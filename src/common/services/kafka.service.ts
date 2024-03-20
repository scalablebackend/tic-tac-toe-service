import { Kafka, Producer } from "kafkajs";

export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor(groupId: string, clientId: string, broker: string) {
    this.kafka = new Kafka({
      clientId: `${groupId}-${clientId}`,
      brokers: [broker],
    });

    this.producer = this.kafka.producer();
  }

  async init() {
    await this.producer.connect();
  }

  async send(topic: string, message: unknown) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

import express from "express";
import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { MessageBroker } from "./src/types/broker";
import { Config } from "./src/config/index";

const app = express();
const PORT = parseInt(Config.port.server, 10)

let broker: MessageBroker | null = null;

const startServer = async () => {
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(["order"], false);

    app.get("/", (req, res) => {
      res.send("Notification service is running ✅");
    });

    app.listen(PORT, () => {
      console.log(`Notification service listening on port ${PORT}`);
    });

  } catch (err) {
    logger.error("Error occurred:", err.message);
    if (broker) {
      await broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();

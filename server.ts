import express from "express";
import { Config } from "./src/config/index";
import notificationRouter from './src/routes/notificationRoutes';

const app = express();
const PORT = parseInt(Config.port.server, 10);

app.use(express.json());

app.use('/', notificationRouter);

app.get("/", (req, res) => {
  res.send("Notification service is running ✅");
});

app.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
});
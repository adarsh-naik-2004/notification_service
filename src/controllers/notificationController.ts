import { Request, Response, NextFunction } from 'express';
import { createNotificationTransport } from '../factories/notification-factory';
import { handleOrderHtml, handleOrderText } from '../handlers/orderHander';

export class NotificationController {
  async notify(req: Request, res: Response, next: NextFunction) {
    try {
      const event = req.body;
      
      if (event.topic === "order") {
        const transport = createNotificationTransport("mail");
        const customerEmail = event.data.customerEmail;

        await transport.send({
          to: customerEmail,
          subject: "Order update.",
          text: handleOrderText(event),  
          html: handleOrderHtml(event), 
        });

        console.log(`Email sent to ${customerEmail}`);
        res.status(200).json({ message: "Notification sent" });
      } else {
        res.status(400).json({ error: "Unsupported event topic" });
      }
    } catch (err) {
      next(err);
    }
  }
}
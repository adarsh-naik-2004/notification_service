import { Request, Response, NextFunction } from 'express';
import { createNotificationTransport } from '../factories/notification-factory';
import { handleOrderHtml, handleOrderText } from '../handlers/orderHander';

export class NotificationController {
  async notify(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventType, data } = req.body;
      
      if (eventType.startsWith("ORDER_")) {
        const transport = createNotificationTransport("mail");
        const customerEmail = data.customerEmail;

        await transport.send({
          to: customerEmail,
          subject: "Order update.",
          text: handleOrderText({ event_type: eventType, data }),  
          html: handleOrderHtml({ event_type: eventType, data }), 
        });

        console.log(`Email sent to ${customerEmail}`);
        return res.status(200).json({ message: "Notification sent" });
      }

      res.status(400).json({ error: "Unsupported event type" });
    } catch (err) {
      next(err);
    }
  }
}
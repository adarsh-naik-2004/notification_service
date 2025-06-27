import express from 'express';
import { NotificationController } from '../controllers/notificationController';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = express.Router();
const notificationController = new NotificationController();

router.post('/notify', asyncWrapper(notificationController.notify));

export default router;
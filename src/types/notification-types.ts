export interface Message {
  to: string;
  text: string;
  html?: string;
  subject?: string;
}

export interface NotificationTransport {
  send(message: Message): Promise<void>;
}

export interface NotificationEvent {
  topic: string;
  event_type: string;
  data: unknown;
}
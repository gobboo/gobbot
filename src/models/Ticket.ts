import { model, Schema, Model, Document } from 'mongoose';

enum TicketStatus {
    DECIDING = 1,
    OPEN,
    IN_PROGRESS,
    CLOSED
};

export interface ITicket extends Document {
  channelId: string;
  recipientId: string;
  type: string;
  status: TicketStatus;
}

const TicketSchema: Schema = new Schema({
  channelId: { type: String, required: true },
  recipientId: { type: String, required: true },
  status: { type: Number, required: true, default: 1 },
  type: { type: String, required: true }
});

export const Ticket: Model<ITicket> = model('Ticket', TicketSchema);

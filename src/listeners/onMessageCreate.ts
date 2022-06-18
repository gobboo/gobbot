
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { Commands } from "../Commands";
import { ITicket, Ticket } from "../models/Ticket";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if (!message.channel.isText() || !message.member) return;

        const channel = await message.channel.fetch() as TextChannel;

        if (!channel.name.includes('ticket-')) return;

        // Check state of ticket
        const ticket: ITicket | null = await Ticket.findOne({ channelId: channel.id, recipientId: message.member.id })
        if (ticket && ticket.status === 1) {
            // Reply with Awaiting
            const embedSuccess = new MessageEmbed()
                .setColor('#3471eb')
                .setDescription('💙 Thank you for submitting your enquiry! It will be checked soon :)');

            channel.send({ embeds: [embedSuccess] });
            channel.setName(`waiting-${message.member.user.username}`)

            ticket.status = 2;
            await ticket.save()
        }
    });
};
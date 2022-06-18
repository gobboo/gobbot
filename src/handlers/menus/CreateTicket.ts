import { Ticket } from '../../models/Ticket';
import { Client, MessageEmbed, Permissions, SelectMenuInteraction } from "discord.js";
import { Menu } from "../../interfaces/Menu";
import { errorEmbed } from '../../helpers/Embeds';


export const CreateTicket: Menu = {
    customId: "create_ticket",
    async run(client: Client, interaction: SelectMenuInteraction) {
        // Check if they have a ticket open already

        // Create a new Channel ( ticket-username )
        const recipient = interaction.member?.user

        if (!recipient) {
            return;
        }

        const existingTicket = await Ticket.exists({ recipientId: recipient?.id, status: { $ne: 4 } })
        
        if (existingTicket) {
            interaction.reply({
                embeds: [errorEmbed('🚫 You already have an existing ticket open.')],
                ephemeral: true
            })

            return;
        }

        const ticketChannel = await interaction.guild?.channels.create(`ticket-${recipient?.username}`,
        {
            type: 'GUILD_TEXT',
            parent: '985670877590978670',
            permissionOverwrites: [
                {
                    id: recipient.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL],
                },
            ],
        })
        
        // Send message asking for details

        const questionEmbed = new MessageEmbed()
            .setTitle('What are you looking for?')
            .setDescription('Below, please enter what exactly you are looking for with your Software. Ask yourself: what are your **end goals**, what should the program accomplish and so forth.\n\nIf you can\'t fit all of your needs in your message, send what you can and send the rest in other messages, or use Google Docs :)')
            .setColor('#ebc334')

        await ticketChannel?.send({ content: `Over here <@${recipient.id}>! :D`, embeds: [questionEmbed] })
        // Setup Ticket mongo stuff
        
        await Ticket.create({
            channelId: ticketChannel?.id,
            recipientId: recipient.id,
            status: 1,
            type: interaction.values[0]
        })

        interaction.reply({
            content: `Your Enquiry has been created, <#${ticketChannel?.id}> !`,
            ephemeral: true
        })
    },
}
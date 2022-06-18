import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import { Command } from "../interfaces/Command";
import { ITicket, Ticket } from "../models/Ticket";

export const codeOptions = [
    {
        label: '🖥 Frontend Programming',
        description: 'Frontend Implementation Only',
        value: 'frontend'
    },
    {
        label: '⚙️ Backend Programming',
        description: 'Backend Application Only, MEN Stack.',
        value: 'backend'
    },
    {
        label: '🗄️ Full-Stack Application',
        description: 'Frontend + Backend Application, MEVN Stack.',
        value: 'fullstack'
    },
    {
        label: '🤖 Discord Bot',
        description: 'DiscordJS Bot w/ TypeScript.',
        value: 'discord'
    },
    {
        label: '‍💻 Other Programming',
        description: 'General Programming with custom needs.',
        value: 'general'
    },
    {
        label: '🔄 Revision Enquiry',
        description: 'Enquiry or request for a revision of recieved product.',
        value: 'revision'
    }
]

export const TicketCommand: Command = {
    name: "ticket",
    description: "Tickets",
    type: "CHAT_INPUT",
    defaultPermission: false,
    permissions: ["ADMINISTRATOR"],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if (!interaction.isCommand()) return;

        const subCommand = interaction.options.getSubcommand()

        switch (subCommand) {
            case 'setup':
                const actionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('create_ticket')
                            .setPlaceholder('Please Select a Service')
                            .addOptions(codeOptions)
                    )

                const ticketEmbed = new MessageEmbed()
                    .setColor('#3495eb')
                    .setTitle('Get a quote!')
                    .setDescription('Welcome!\nTo Start please select the category that best fits your Project, or select other if the options below do not cover your idea!')
                    .setFooter({ text: 'Created with ❤️ by Gobbo' })
            
                await interaction.reply({
                    ephemeral: false,
                    embeds: [ticketEmbed],
                    components: [actionRow]
                });

                break;
            case 'close':
                const isComplete = interaction.options.getBoolean('complete') || false
                const reason = interaction.options.getString('reason') || 'No Reason specified.'

                const ticket: ITicket | null = await Ticket.findOne({ channelId: interaction.channel?.id })

                if (ticket) {
                    ticket.status = 4;
                    await ticket.save();

                    if (!isComplete) {
                        // DM User
                        try {
                            const dmEmbed = new MessageEmbed()
                                .setColor('#ebb134')
                                .setDescription('Your Enquiry Ticket has been closed, if this is an error please reopen your ticket and mention it.')
                                .addField('Reason', reason);
                                // .setFooter({ text: 'Closed by <@544168042066608139>' });
                            
                            (await client.users.fetch(ticket.recipientId)).send({ embeds: [dmEmbed] });
                        } catch {}

                        await interaction.channel?.delete();
                        return;
                    }

                    // Create Feedback Embed
                    const feedbackButton = new MessageButton()
                        .setCustomId('feedback_modal')
                        .setLabel('Give Feedback')
                        .setStyle('PRIMARY')
                        .setEmoji('⭐')

                    const skipButton = new MessageButton()
                        .setCustomId('skip_feedback')
                        .setLabel('Skip')
                        .setStyle('DANGER')
                        .setEmoji('▶️')

                    const row = new MessageActionRow()
                        .addComponents(feedbackButton, skipButton)

                    const feedbackEmbed = new MessageEmbed()
                        .setTitle('Feedback')
                        .setDescription('I appreciate the decision to use my services, if you wish to provide feedback I\'d greatly appreciate it!\n\nProceed by clicking the buttons below to finalise your Ticket.')
                        .setColor('#6234eb');
                    
                    await interaction.reply({ embeds: [feedbackEmbed], components: [row] });
                }

                break;

            case 'quote': {
                // Send a quote to the user, so they can accept or deny it
                const ticket: ITicket | null = await Ticket.findOne({ channelId: interaction.channel?.id })
                const quoteAmount = interaction.options.getNumber('amount')
                if (ticket) {
                    const quoteEmbed = new MessageEmbed()
                        .setTitle('Software Quote')
                        .setColor('#')
                        .setDescription('You have recieved a quote!\nYou can either accept, counter-offer or deny the quote.')
                        .addField('Amount', `$${quoteAmount}`)
                        .setTimestamp(new Date());

                    const acceptButton = new MessageButton()
                        .setCustomId('accept_quote')
                        .setStyle('SUCCESS')
                        .setLabel('Accept Quote')
                        .setEmoji('');

                    const counterOfferButton = new MessageButton()
                        .setCustomId('counter_quote')
                        .setStyle('PRIMARY')
                        .setLabel('Counter Offer')
                        .setEmoji('');

                    const denyButton = new MessageButton()
                        .setCustomId('deny_quote')
                        .setStyle('DANGER')
                        .setLabel('Deny Quote')
                        .setEmoji('');

                    const row = new MessageActionRow()
                        .addComponents(acceptButton, counterOfferButton, denyButton);
                    
                    await interaction.reply({ embeds: [quoteEmbed], components: [row] });
                }
            }
        }

    },
    options: [
        {
            name: 'close',
            description: 'Closes the currently opened ticket.',
            type: 'SUB_COMMAND',
            options: [
                {
                    type: 'BOOLEAN',
                    name: 'complete',
                    description: 'If the Ticket was a finished Job or not.',
                    required: true
                },
                {
                    type: 'STRING',
                    name: 'reason',
                    description: 'Reason for closure.',
                    required: false
                }
            ]
        },
        {
            name: 'quote',
            description: 'Quote a ticket from a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    type: 'NUMBER',
                    name: 'amount',
                    description: 'Amount in $ to quote the user',
                    required: true
                }
            ]
        },
        {
            name: 'setup',
            description: 'Setups the Ticket channel.',
            type: 'SUB_COMMAND'
        },
    ]
};
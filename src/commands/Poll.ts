import { BaseCommandInteraction, Client, Message, MessageEmbed } from "discord.js";
import { errorEmbed } from "../helpers/Embeds";
import { Command } from "../interfaces/Command";

export const PollCommand: Command = {
    name: "poll",
    description: "Polls",
    type: "CHAT_INPUT",
    defaultPermission: false,
    permissions: ["ADMINISTRATOR"],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if (!interaction.isCommand()) return;

        const subCommand = interaction.options.getSubcommand()

        switch (subCommand) {
            case 'create':
                const title = interaction.options.getString('title') || 'Vote for the Poll'
                const content = interaction.options.getString('content') || ''
                const optionOne = interaction.options.getString('option-1') || '👍'
                const optionTwo = interaction.options.getString('option-2') || '👎'

                const pollEmbed = new MessageEmbed()
                    .setColor('#3248a8')
                    .setTitle(title)
                    .setDescription(content)
                    .addField('Upvote', optionOne, true)
                    .addField('Downvote', optionTwo, true)
                    .setTimestamp(Date.now())

                // Sanity check for emote
                const emotes = (str: string) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

                if (!emotes(optionOne) || !emotes(optionTwo)) {
                    await interaction.reply({ ephemeral: true, embeds: [errorEmbed('One of your options did not include an Emoji, please try again!')] })
                    return;
                }
                
                const message = await interaction.reply({ embeds: [pollEmbed], fetchReply: true }) as Message;
                await message.react(optionOne)
                await message.react(optionTwo)
        }
    },
    options: [
        {
            name: 'create',
            description: 'Create a new Poll ',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'title',
                    description: 'Title of the Poll',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'content',
                    description: 'Small description of the Poll',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'option-1',
                    description: 'First React option, in ID format',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'option-2',
                    description: 'Second React option, in ID format',
                    type: 'STRING',
                    required: true
                }
            ]
        }
    ],
}
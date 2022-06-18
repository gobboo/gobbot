import { Command } from './../interfaces/Command';
import { BaseCommandInteraction, Client, TextChannel } from "discord.js";

export const Nuke: Command = {
    name: "nuke",
    description: "Nukes an Entire Channel",
    type: "CHAT_INPUT",
    defaultPermission: false,
    permissions: ["ADMINISTRATOR"],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if (!interaction.isCommand()) return;
        const oldChannel = await interaction.guild?.channels.fetch(interaction.channelId)

        if (oldChannel && interaction.channel?.isText()) {
            oldChannel.clone()
                .then((channel) => {
                    channel.setParent(oldChannel.parent)
                    channel.setPosition(oldChannel.position)
                })

            oldChannel.delete()
        }

    },
    options: [
        {
            type: 'NUMBER',
            description: 'x Amount of messages to remove',
            name: 'amount'
        }
    ]
}
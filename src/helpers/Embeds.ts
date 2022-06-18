import { MessageEmbed } from "discord.js";

export const errorEmbed = (content: string) => new MessageEmbed()
    .setColor('#eb4034')
    .setDescription(content)

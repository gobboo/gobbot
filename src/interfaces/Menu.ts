import { Client, MessageComponentInteraction, MessageSelectMenuOptions, SelectMenuInteraction } from "discord.js";

export interface Menu extends MessageSelectMenuOptions {
    run: (client: Client, interaction: SelectMenuInteraction) => void;
}
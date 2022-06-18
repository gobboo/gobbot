import { ButtonInteraction, Client, InteractionButtonOptions } from "discord.js";

export interface Button extends InteractionButtonOptions {
    run: (client: Client, interaction: ButtonInteraction) => void;
}
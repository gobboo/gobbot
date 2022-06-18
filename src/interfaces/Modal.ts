import { Client, ModalOptions, ModalSubmitInteraction } from "discord.js";

export interface Modal extends ModalOptions {
    run: (client: Client, interaction: ModalSubmitInteraction) => void;
}
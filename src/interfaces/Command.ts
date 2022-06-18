import { BaseCommandInteraction, ChatInputApplicationCommandData, Client, PermissionResolvable } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    permissions: PermissionResolvable[];
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}
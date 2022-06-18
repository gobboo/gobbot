import { Commands } from '../Commands';
import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import { Menus } from '../Menus';
import { Buttons } from '../Buttons';
import { Modals } from '../Modals';

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        try {
            if (interaction.isCommand() || interaction.isContextMenu()) {
                await handleSlashCommand(client, interaction);
            }

            else if (interaction.isSelectMenu()) {
                await handleMenuClick(client, interaction);
            }

            else if (interaction.isButton()) { 
                await handleButtonClick(client, interaction);
            }

            else if (interaction.isModalSubmit()) { 
                await handleModalSubmit(client, interaction);
            }
        } catch (err) {
            console.log(err)
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);

    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await slashCommand.run(client, interaction);
};

const handleMenuClick = async (client: Client, interaction: SelectMenuInteraction): Promise<void> => {
    const menuOption = Menus.find(c => c.customId === interaction.customId);

    if (!menuOption) {
        interaction.reply({ ephemeral: true, content: "An error has occurred" });
        return;
    }

    await menuOption.run(client, interaction);
};

const handleButtonClick = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    const buttonHandler = Buttons.find(c => c.customId === interaction.customId);

    if (!buttonHandler) {
        interaction.reply({ ephemeral: true, content: "An error has occurred" });
        return;
    }

    await buttonHandler.run(client, interaction);
};

const handleModalSubmit = async (client: Client, interaction: ModalSubmitInteraction): Promise<void> => {
    const modalHandler = Modals.find(c => c.customId === interaction.customId);

    if (!modalHandler) {
        interaction.reply({ ephemeral: true, content: "An error has occurred" });
        return;
    }

    await modalHandler.run(client, interaction);
};

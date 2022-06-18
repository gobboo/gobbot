import { Client, Interaction, MessageActionRow, MessageActionRowComponentResolvable, MessageSelectMenu, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { Button } from "../../interfaces/Button";

export const FeedbackModal: Button = {
    customId: 'feedback_modal',
    style: 'PRIMARY',
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const modal = new Modal()
            .setCustomId('feedback_input')
            .setTitle('Feedback Form')

        // Create new Modal and show it to a user
        const ratingInput = new TextInputComponent()
            .setCustomId('rating_input')
            .setLabel('Please Rate Gobbo\'s Services.')
            .setPlaceholder('1 - 5')
            .setStyle('SHORT');

        const feedbackText = new TextInputComponent()
            .setCustomId('feedback_input')
            .setLabel('Please enter any additional feedback.')
            .setPlaceholder('Gobbo was amazing because...')
            .setStyle('PARAGRAPH');

        const rows = [ratingInput, feedbackText].map(
            (component) =>
                new MessageActionRow<ModalActionRowComponent>().addComponents(component)
            );
        
        modal.addComponents(...rows)
        await interaction.showModal(modal);
    }
}
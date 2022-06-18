import { Client, ColorResolvable, MessageEmbed, ModalSubmitInteraction } from 'discord.js';
import { codeOptions } from '../../commands/Ticket';
import { Modal } from '../../interfaces/Modal';
import { Ticket } from '../../models/Ticket';


const colors: ColorResolvable[] = [
    "#eb3434",
    "#e38136",
    "#95e336",
    "#3ce336",
    "#1cd462"
]

export const FeedbackSubmit: Modal = {
    customId: 'feedback_input',
    run: async (client: Client, interaction: ModalSubmitInteraction) => {
        // DM User
        if (!interaction.member || !interaction.channel) return;

        // Validate input?

        try {
            const completeEmbed = new MessageEmbed()
                .setTitle('Thank you!')
                .setDescription('Thank you for submitting your feedback and choosing me for your service!\n\nI hope to see you again soon, if you need any additional support please create another ticket :)')
                .setColor('#ebb134');

            (await client.users.fetch(interaction.member.user.id)).send({ embeds: [completeEmbed] });
        } catch {}

        const vouchChannel = await interaction.guild?.channels.fetch('986387842148225074');
        const rating = parseInt(interaction.fields.getTextInputValue('rating_input')) || 5

        // Fetch ticket data
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id, recipientId: interaction.member.user.id })

        if (vouchChannel && vouchChannel.isText() && ticket) {
            const vouchEmbed = new MessageEmbed()
                .setTitle(`Vouch from ${interaction.member.user.username}#${interaction.member.user.discriminator}`)
                .addField('Service', codeOptions.find(el => el.value === ticket.type)?.label || 'Unknown')
                .addField('Feedback', interaction.fields.getTextInputValue('feedback_input'))
                .addField('Rating', `${'<:star:986383291265470604>'.repeat(rating)}${'<:staroutline:986383307979763742>'.repeat(5 - rating)}`)
                .setColor(colors[rating - 1])
                .setTimestamp(Date.now())

            await vouchChannel.send({ embeds: [vouchEmbed] })
        }

        await interaction.reply({ content: 'Your submission was recieved successfully!' });
        await interaction.channel.delete();
    },
    title: 'Submit Feedback',
    components: []
}
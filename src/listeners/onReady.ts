import { Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands)

        // const guild = await client.guilds.fetch(process.env.GUILD_ID || '980981386083201065');
        
        // // Command Manager
        // await guild.commands.set(Commands)
        //     .then(async (command) => {
        //         const fetchRoles = (commandName: string) => {
        //             const command = Commands.find((cmd) => cmd.name == commandName);
        //             if (!command) return;

        //             return guild.roles.cache.filter((role) => role.permissions.has(command.permissions));
        //         }

        //         const fullPermissions = command.reduce((accumulator, cmd) => {
        //             const roles = fetchRoles(cmd.name);
        //             if (!roles) return accumulator;

        //             const permissions = roles.reduce((accumulator, role) => {
        //                 return [...accumulator, { id: role.id, type: 'ROLE', permission: true }];
        //             }, [] as any[])

        //             return [...accumulator, { id: cmd.id, permissions: permissions }]
        //         }, [] as any[])

        //         await guild.commands.permissions.set({ fullPermissions })
        //     })

        console.log(`${client.user.username} is ready to begin!`);
    });
};

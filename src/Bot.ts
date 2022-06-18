import { config } from 'dotenv';
import { Client, ClientOptions } from "discord.js";
import { connect } from 'mongoose';
import onReady from './listeners/onReady';
import onInteractionCreate from './listeners/onInteractionCreate';
import onMessageCreate from './listeners/onMessageCreate';



config()

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

onReady(client);
onInteractionCreate(client);
onMessageCreate(client);


// Connect to Mongoose

connect(process.env.MONGOOSE || 'mongodb://localhost:27017/gobbo')
    .then(() => {
        client.login(process.env.TOKEN);
    })

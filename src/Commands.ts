import { Command } from "./interfaces/Command";
import { TicketCommand } from "./commands/Ticket";
import { Nuke } from "./commands/Nuke";
import { PollCommand } from "./commands/Poll";

export const Commands: Command[] = [
    TicketCommand,
    Nuke,
    PollCommand
];
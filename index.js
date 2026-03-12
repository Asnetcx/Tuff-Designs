// bot.js
const { Client, GatewayIntentBits, SlashCommandBuilder, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// ---------------------
// Command definitions
// ---------------------
const commands = [

    // 0. Help
    new SlashCommandBuilder().setName('help').setDescription('Shows all commands or commands in a category'),

    // 1. Portfolio & Showcase
    new SlashCommandBuilder()
        .setName('portfolio')
        .setDescription("Show a user's portfolio or recent works")
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)),
    new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit artwork to the showcase channel')
        .addAttachmentOption(option => option.setName('file').setDescription('Upload your design').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Optional title'))
        .addStringOption(option => option.setName('description').setDescription('Optional description')),

    // 2. Commissions & Collaboration
    new SlashCommandBuilder().setName('commission').setDescription("View a designer's open slots and pricing").addUserOption(option => option.setName('designer').setDescription('Select a designer').setRequired(true)),
    new SlashCommandBuilder().setName('request').setDescription('Request a custom design').addUserOption(option => option.setName('designer').setDescription('Select a designer').setRequired(true)).addStringOption(option => option.setName('details').setDescription('Describe your request').setRequired(true)),
    new SlashCommandBuilder().setName('price').setDescription('Show pricing for design services').addUserOption(option => option.setName('designer').setDescription('Select a designer')),
    new SlashCommandBuilder().setName('slots').setDescription('Check available commission slots').addUserOption(option => option.setName('designer').setDescription('Select a designer').setRequired(true)),
    new SlashCommandBuilder().setName('tutorial').setDescription('Get tutorial links').addStringOption(option => option.setName('category').setDescription('Photoshop, Figma, Illustrator, Free Assets').setRequired(true)),

    // 3. Reviews
    new SlashCommandBuilder().setName('reviews').setDescription('Submit or view a design review').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(option => option.setName('rating').setDescription('Rate 1-5').setMinValue(1).setMaxValue(5)).addStringOption(option => option.setName('comment').setDescription('Optional comment')),

    // 4. Server Info & Roles
    new SlashCommandBuilder().setName('serverinfo').setDescription('Show server stats, channels, and roles'),
    new SlashCommandBuilder().setName('serverroles').setDescription('List or assign server roles'),

    // 5. Moderation
    new SlashCommandBuilder().setName('warn').setDescription('Issue a warning').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Optional reason')),
    new SlashCommandBuilder().setName('mute').setDescription('Temporarily mute a member').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('duration').setDescription('Duration (e.g. 10m, 1h)')),
    new SlashCommandBuilder().setName('kick').setDescription('Kick a member').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Optional reason')),
    new SlashCommandBuilder().setName('ban').setDescription('Ban a member').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Optional reason')).addStringOption(option => option.setName('duration').setDescription('Temporary ban duration')),
    new SlashCommandBuilder().setName('lock').setDescription('Restrict posting in a channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)).addStringOption(option => option.setName('duration').setDescription('Optional duration')),

    // 6. Ticket System
    new SlashCommandBuilder().setName('ticket').setDescription('Open a new support/request ticket'),
    new SlashCommandBuilder().setName('ticketadd').setDescription('Add a user to a ticket').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('ticketremove').setDescription('Remove a user from a ticket').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('ticketrename').setDescription('Rename a ticket').addStringOption(option => option.setName('newname').setDescription('New ticket name').setRequired(true)),
    new SlashCommandBuilder().setName('ticketclose').setDescription('Close a ticket'),
    new SlashCommandBuilder().setName('closerequest').setDescription('Alias to close a ticket'),

    // 7. Giveaways
    new SlashCommandBuilder().setName('giveawaycreate').setDescription('Create a giveaway').addStringOption(option => option.setName('prize').setDescription('Prize name').setRequired(true)).addStringOption(option => option.setName('duration').setDescription('Duration e.g. 1h').setRequired(true)).addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true)),
    new SlashCommandBuilder().setName('giveawayend').setDescription('End a giveaway').addStringOption(option => option.setName('id').setDescription('Giveaway ID').setRequired(true)),
    new SlashCommandBuilder().setName('giveawayreroll').setDescription('Pick a new winner').addStringOption(option => option.setName('id').setDescription('Giveaway ID').setRequired(true)),

    // 8. Promotions & Infractions
    new SlashCommandBuilder().setName('promotionissue').setDescription('Give a promotion').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('infractionissue').setDescription('Record a warning or strike').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('infractionview').setDescription('View infractions').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('infractionrevoke').setDescription('Revoke an infraction').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(option => option.setName('id').setDescription('Infraction ID').setRequired(true)),

    // 9. Payments & Orders
    new SlashCommandBuilder().setName('discount').setDescription('Create a discount').addStringOption(option => option.setName('code').setDescription('Discount code').setRequired(true)).addIntegerOption(option => option.setName('percentage').setDescription('Discount %').setRequired(true)).addStringOption(option => option.setName('duration').setDescription('Duration e.g. 7d')),
    new SlashCommandBuilder().setName('payment').setDescription('Record a payment').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(option => option.setName('amount').setDescription('Amount').setRequired(true)),
    new SlashCommandBuilder().setName('orderlog').setDescription('View order details').addStringOption(option => option.setName('orderID').setDescription('Order ID').setRequired(true)),

    // 10. Credits / Economy
    new SlashCommandBuilder().setName('creditadd').setDescription('Add credits').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(option => option.setName('amount').setDescription('Amount').setRequired(true)),
    new SlashCommandBuilder().setName('creditview').setDescription('View credits').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)),
    new SlashCommandBuilder().setName('creditremove').setDescription('Remove credits').addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(option => option.setName('amount').setDescription('Amount').setRequired(true)),
];

// ---------------------
// Register commands in memory
// ---------------------
for (const cmd of commands) {
    client.commands.set(cmd.name, cmd);
}

// ---------------------
// Interaction handling
// ---------------------
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        // Default reply placeholder
        await interaction.reply({ content: `You used the command /${interaction.commandName}`, ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing command!', ephemeral: true });
    }
});

// ---------------------
// Bot login
// ---------------------
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);

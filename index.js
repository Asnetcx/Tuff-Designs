const { Client, GatewayIntentBits, SlashCommandBuilder, Collection, REST, Routes } = require('discord.js');

// ---------------------
// Environment variables
// ---------------------
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) console.warn('❌ TOKEN not set!');
if (!CLIENT_ID) console.warn('❌ CLIENT_ID not set!');
if (!GUILD_ID) console.warn('❌ GUILD_ID not set!');

if (!TOKEN) process.exit(1); // Bot cannot run without a token

// ---------------------
// Create client
// ---------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// ---------------------
// Commands (all 45)
// ---------------------
const commands = [
    // 0. Help
    new SlashCommandBuilder().setName('help').setDescription('Shows all commands'),

    // 1-2 Portfolio & showcase
    new SlashCommandBuilder().setName('portfolio').setDescription("Show a user's portfolio").addUserOption(opt => opt.setName('user').setDescription('Select a user')),
    new SlashCommandBuilder().setName('submit').setDescription('Submit artwork').addAttachmentOption(opt => opt.setName('file').setDescription('Upload design').setRequired(true)).addStringOption(opt => opt.setName('title').setDescription('Optional title')).addStringOption(opt => opt.setName('description').setDescription('Optional description')),

    // 3-6 Commissions & collaboration
    new SlashCommandBuilder().setName('commission').setDescription("View designer's slots").addUserOption(opt => opt.setName('designer').setDescription('Select a designer').setRequired(true)),
    new SlashCommandBuilder().setName('request').setDescription('Request a custom design').addUserOption(opt => opt.setName('designer').setDescription('Select a designer').setRequired(true)).addStringOption(opt => opt.setName('details').setDescription('Describe your request').setRequired(true)),
    new SlashCommandBuilder().setName('price').setDescription('Show pricing').addUserOption(opt => opt.setName('designer').setDescription('Select a designer')),
    new SlashCommandBuilder().setName('slots').setDescription('Check available commission slots').addUserOption(opt => opt.setName('designer').setDescription('Select a designer').setRequired(true)),
    new SlashCommandBuilder().setName('tutorial').setDescription('Get tutorial links').addStringOption(opt => opt.setName('category').setDescription('Photoshop, Figma, Illustrator, Free Assets').setRequired(true)),

    // 7 Reviews
    new SlashCommandBuilder().setName('reviews').setDescription('Submit/view a review').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(opt => opt.setName('rating').setDescription('Rate 1-5').setMinValue(1).setMaxValue(5)).addStringOption(opt => opt.setName('comment').setDescription('Optional comment')),

    // 8-9 Server info & roles
    new SlashCommandBuilder().setName('serverinfo').setDescription('Show server stats, channels, and roles'),
    new SlashCommandBuilder().setName('serverroles').setDescription('List or assign server roles'),

    // 10-14 Moderation
    new SlashCommandBuilder().setName('warn').setDescription('Issue a warning').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Optional reason')),
    new SlashCommandBuilder().setName('mute').setDescription('Temporarily mute a member').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('duration').setDescription('Duration')),
    new SlashCommandBuilder().setName('kick').setDescription('Kick a member').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Optional reason')),
    new SlashCommandBuilder().setName('ban').setDescription('Ban a member').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Optional reason')).addStringOption(opt => opt.setName('duration').setDescription('Temporary ban duration')),
    new SlashCommandBuilder().setName('lock').setDescription('Restrict posting in a channel').addChannelOption(opt => opt.setName('channel').setDescription('Select a channel').setRequired(true)).addStringOption(opt => opt.setName('duration').setDescription('Optional duration')),

    // 15-19 Ticket system
    new SlashCommandBuilder().setName('ticket').setDescription('Open a ticket'),
    new SlashCommandBuilder().setName('ticketadd').setDescription('Add a user to a ticket').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('ticketremove').setDescription('Remove a user from a ticket').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('ticketrename').setDescription('Rename a ticket').addStringOption(opt => opt.setName('newname').setDescription('New ticket name').setRequired(true)),
    new SlashCommandBuilder().setName('ticketclose').setDescription('Close a ticket'),
    new SlashCommandBuilder().setName('closerequest').setDescription('Alias to close a ticket'),

    // 20-22 Giveaways
    new SlashCommandBuilder().setName('giveawaycreate').setDescription('Create a giveaway').addStringOption(opt => opt.setName('prize').setDescription('Prize name').setRequired(true)).addStringOption(opt => opt.setName('duration').setDescription('Duration').setRequired(true)).addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true)),
    new SlashCommandBuilder().setName('giveawayend').setDescription('End a giveaway').addStringOption(opt => opt.setName('id').setDescription('Giveaway ID').setRequired(true)),
    new SlashCommandBuilder().setName('giveawayreroll').setDescription('Pick a new winner').addStringOption(opt => opt.setName('id').setDescription('Giveaway ID').setRequired(true)),

    // 23-26 Promotions & Infractions
    new SlashCommandBuilder().setName('promotionissue').setDescription('Give a promotion').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('infractionissue').setDescription('Record an infraction').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('infractionview').setDescription('View infractions').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)),
    new SlashCommandBuilder().setName('infractionrevoke').setDescription('Revoke an infraction').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addStringOption(opt => opt.setName('id').setDescription('Infraction ID').setRequired(true)),

    // 27-29 Payments & Orders
    new SlashCommandBuilder().setName('discount').setDescription('Create a discount').addStringOption(opt => opt.setName('code').setDescription('Discount code').setRequired(true)).addIntegerOption(opt => opt.setName('percentage').setDescription('Discount %').setRequired(true)).addStringOption(opt => opt.setName('duration').setDescription('Duration')),
    new SlashCommandBuilder().setName('payment').setDescription('Record a payment').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true)),
    new SlashCommandBuilder().setName('orderlog').setDescription('View order details').addStringOption(opt => opt.setName('orderID').setDescription('Order ID').setRequired(true)),

    // 30-32 Credits / Economy
    new SlashCommandBuilder().setName('creditadd').setDescription('Add credits').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true)),
    new SlashCommandBuilder().setName('creditview').setDescription('View credits').addUserOption(opt => opt.setName('user').setDescription('Select a user')),
    new SlashCommandBuilder().setName('creditremove').setDescription('Remove credits').addUserOption(opt => opt.setName('user').setDescription('Select a user').setRequired(true)).addIntegerOption(opt => opt.setName('amount').setDescription('Amount').setRequired(true)),

    // Add any remaining commands here until you reach 45 if needed
];

// Register commands in memory
for (const cmd of commands) client.commands.set(cmd.name, cmd);

// ---------------------
// Register slash commands safely
// ---------------------
if (CLIENT_ID && GUILD_ID) {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    (async () => {
        try {
            console.log('Registering slash commands...');
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands.map(cmd => cmd.toJSON()) }
            );
            console.log('✅ Slash commands registered!');
        } catch (error) {
            console.error('Failed to register commands:', error);
        }
    })();
} else {
    console.log('⚠️ Skipping command registration (missing CLIENT_ID or GUILD_ID)');
}

// ---------------------
// Interaction handling
// ---------------------
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await interaction.reply({ content: `You used /${interaction.commandName}`, ephemeral: true });
    } catch (error) {
        console.error(error);
        if (!interaction.replied) await interaction.reply({ content: 'Error executing command!', ephemeral: true });
    }
});

// ---------------------
// Bot login
// ---------------------
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

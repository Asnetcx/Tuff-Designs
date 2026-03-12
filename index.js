const { 
  Client, GatewayIntentBits, SlashCommandBuilder, Collection, 
  REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle 
} = require("discord.js");

// =====================
// ENV VARIABLES
// =====================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.error("❌ TOKEN missing in env variables");
  process.exit(1);
}

// =====================
// CLIENT SETUP
// =====================
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// =====================
// DEFAULT IMAGE
// =====================
const DEFAULT_IMAGE = "https://cdn.discordapp.com/attachments/1476337208037474347/1481790514784370741/ChatGPT_Image_Mar_10_2026_05_49_12_PM.png";

// =====================
// COMMANDS
// =====================
const commands = [

  // Logo Update
  new SlashCommandBuilder()
    .setName("logo_update")
    .setDescription("Update a logo design")
    .addUserOption(o => o.setName("designer").setDescription("Assigned designer").setRequired(true))
    .addAttachmentOption(o => o.setName("file").setDescription("Logo file")),

  // Banner Update
  new SlashCommandBuilder()
    .setName("banner_update")
    .setDescription("Update a banner design")
    .addUserOption(o => o.setName("designer").setDescription("Assigned designer").setRequired(true))
    .addAttachmentOption(o => o.setName("file").setDescription("Banner file")),

  // Clothing Update
  new SlashCommandBuilder()
    .setName("clothing_update")
    .setDescription("Update clothing design")
    .addUserOption(o => o.setName("designer").setDescription("Assigned designer").setRequired(true))
    .addAttachmentOption(o => o.setName("file").setDescription("Clothing file")),

  // Deliver
  new SlashCommandBuilder()
    .setName("deliver")
    .setDescription("Deliver a design to the client")
    .addUserOption(o => o.setName("designer").setDescription("Designer submitting work").setRequired(true))
    .addUserOption(o => o.setName("client").setDescription("Client receiving work").setRequired(true))
    .addAttachmentOption(o => o.setName("file").setDescription("Design file"))
    .addStringOption(o => o.setName("link").setDescription("Optional download link")),

  // Review
  new SlashCommandBuilder()
    .setName("review")
    .setDescription("Leave a review for a designer")
    .addUserOption(o => o.setName("designer").setDescription("Designer").setRequired(true))
    .addIntegerOption(o => o.setName("rating").setDescription("1-5 stars").setMinValue(1).setMaxValue(5).setRequired(true))
    .addStringOption(o => o.setName("comment").setDescription("Review comment").setRequired(true)),

  // Payout
  new SlashCommandBuilder()
    .setName("payout")
    .setDescription("Calculate Robux payout after 30% tax")
    .addIntegerOption(o => o.setName("amount").setDescription("Original amount").setRequired(true)),
];

// =====================
// REGISTER COMMANDS
// =====================
const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    console.log("Registering application commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands.map(c => c.toJSON()) });
    console.log("✅ Commands registered");
  } catch (err) {
    console.error("Command registration error:", err);
  }
})();

// =====================
// COMMAND HANDLER
// =====================
client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {

      const cmd = interaction.commandName;

      // --- Logo / Banner / Clothing Update ---
      if (["logo_update","banner_update","clothing_update"].includes(cmd)) {

        if (!interaction.member.roles.cache.some(r => r.name === "Designer")) 
          return interaction.reply({ content: "❌ Only Designers can update designs.", ephemeral: true });

        const designer = interaction.options.getUser("designer");
        const file = interaction.options.getAttachment("file");

        const embed = new EmbedBuilder()
          .setTitle(`🎨 ${cmd.replace("_update","").toUpperCase()} Update`)
          .addFields(
            { name: "Designer", value: `<@${designer.id}>`, inline: true },
            { name: "Status", value: file ? "Submitted" : "No Submission Yet", inline: true }
          )
          .setImage(file ? file.url : DEFAULT_IMAGE)
          .setColor("Blue");

        return interaction.reply({ embeds: [embed] });
      }

      // --- Deliver Command ---
      if (cmd === "deliver") {

        if (!interaction.member.roles.cache.some(r => r.name === "Designer"))
          return interaction.reply({ content: "❌ Only Designers can deliver work.", ephemeral: true });

        const designer = interaction.options.getUser("designer");
        const clientUser = interaction.options.getUser("client");
        const file = interaction.options.getAttachment("file");
        const link = interaction.options.getString("link");

        const embed = new EmbedBuilder()
          .setTitle("📦 Design Delivery")
          .addFields(
            { name: "Designer", value: `<@${designer.id}>`, inline: true },
            { name: "Client", value: `<@${clientUser.id}>`, inline: true }
          )
          .setColor("Green");

        if (file) embed.setImage(file.url);
        if (link) embed.addFields({ name: "Download Link", value: link });

        const buttons = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setCustomId("accept_work").setLabel("Accept Work").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("request_revision").setLabel("Request Revision").setStyle(ButtonStyle.Danger)
          );

        return interaction.reply({ embeds: [embed], components: [buttons] });
      }

      // --- Review Command ---
      if (cmd === "review") {
        const designer = interaction.options.getUser("designer");
        const rating = interaction.options.getInteger("rating");
        const comment = interaction.options.getString("comment");

        const stars = "⭐".repeat(rating);

        const embed = new EmbedBuilder()
          .setTitle("⭐ Client Review")
          .addFields(
            { name: "Designer", value: `<@${designer.id}>`, inline: true },
            { name: "Rating", value: stars, inline: true },
            { name: "Comment", value: comment }
          )
          .setColor("Yellow");

        return interaction.reply({ embeds: [embed] });
      }

      // --- Payout Command ---
      if (cmd === "payout") {
        const amount = interaction.options.getInteger("amount");
        const afterTax = Math.floor(amount * 0.7);

        const embed = new EmbedBuilder()
          .setTitle("💰 Designer Payout")
          .addFields(
            { name: "Original", value: `${amount} Robux`, inline: true },
            { name: "After 30% Tax", value: `${afterTax} Robux`, inline: true }
          )
          .setColor("Purple");

        return interaction.reply({ embeds: [embed] });
      }

    }

    // --- Button Handler ---
    if (interaction.isButton()) {
      if (interaction.customId === "accept_work") 
        return interaction.update({ content: "✅ Work accepted!", components: [] });

      if (interaction.customId === "request_revision") 
        return interaction.update({ content: "🔄 Revision requested.", components: [] });
    }

  } catch (err) {
    console.error(err);
    if (!interaction.replied) 
      interaction.reply({ content: "❌ An error occurred.", ephemeral: true });
  }
});

// =====================
// READY EVENT
// =====================
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// =====================
// LOGIN
// =====================
client.login(TOKEN);

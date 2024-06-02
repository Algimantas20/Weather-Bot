require("dotenv").config();
const weather = require("weather-js");
const { GatewayIntentBits, EmbedBuilder, Client } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(process.env.TOKEN);

client.once("ready", () => {
  console.log("✅ Ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "weather") {
    // Variebles
    const city = interaction.options.getString("city");
    const degreeType = interaction.options.getString("degree-type");

    await interaction.reply("⏯️ Searching for your information...");

    weather.find(
      { search: city, degreeType: degreeType },
      async (err, result) => {
        if (err) {
          console.error(err);
          return interaction.editReply(
            "❌ An error occurred while fetching the weather data."
          );
        }

        if (!result || result.length === 0) {
          return interaction.editReply("❌ City doesn't exist.");
        }

        const current = result[0].current;
        const location = result[0].location;

        const weatherEmbed = new EmbedBuilder()
          .setTitle(`Weather for ${location.name}`)
          .addFields(
            {
              name: "Temperature",
              value: `${current.temperature}°${degreeType.toUpperCase()}`,
              inline: true,
            },
            { name: "Condition", value: current.skytext, inline: true },
            { name: "Humidity", value: `${current.humidity}%`, inline: true },
            { name: "Wind Speed", value: current.winddisplay, inline: true }
          )
          .setThumbnail(current.imageUrl)
          .setTimestamp()
          .setColor("Green");

        interaction.editReply({ content: null, embeds: [weatherEmbed] });
      }
    );
  }
});

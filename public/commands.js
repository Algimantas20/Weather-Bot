require("dotenv").config();
const { ApplicationCommandOptionType, REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commands = [
  {
    name: "weather",
    description: "Get the weather of a location",
    options: [
      {
        name: "city",
        description: "get info about the city",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "degree-type",
        description: "in fahrenheit or celsius format",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "fahrenheit", value: "F" },
          { name: "celsius", value: "C" },
        ],
      },
    ],
  },
];

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash commands were registered successfully!");
  } catch (error) {
    console.error(`❌ There was an error: ${error.message}`);
  }
})();

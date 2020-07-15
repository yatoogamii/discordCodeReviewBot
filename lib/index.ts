// env
require("dotenv").config();
// discord
import { Client, MessageEmbed } from "discord.js";
const client = new Client();
// utils
import { parseMessage } from "./utils/parseMessage";
// linters methods
import { javascriptLint } from "./linters/eslint";

client.once("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("message", async msg => {
  if (msg.content.includes("!review") && !msg.author.bot) {
    // parser message
    const { language, code } = parseMessage(msg.content);

    if (language === "javascript" || language === "js") {
      const results = await javascriptLint(code);
      console.log(results);

      const embedResponse = new MessageEmbed()
        .setColor("WHITE")
        .setTitle(`Review of @${msg.author.username} code`)
        .attachFiles(["public/coding-roads-logo.png"])
        .setAuthor("Coding Roads Bots", "attachment://coding-roads-logo.png", "https://discord.gg/C57Hw4Q")
        .setThumbnail("attachment://coding-roads-logo.png")
        .addFields(
          { name: "\u200B", value: "\u200B", inline: false },
          // error part
          {
            name: `:x:  Error score : **${results.errorCount}**  :x:`,
            value: `number of fixable errors : **${results.fixableErrorCount}**\n`,
            inline: false,
          },
          ...results.errorMessages,
          // warning part
          {
            name: `:warning:  Warning score : **${results.warningCount}**  :warning:`,
            value: `number of fixable warnings : **${results.fixableWarningCount}**\n`,
            inline: false,
          },
          ...results.warningMessages,
          { name: "\u200B", value: "\u200B", inline: false },
          {
            name: `:rocket:  I can fix **${results.fixableErrorCount +
              results.fixableWarningCount}** errors/warnings  :rocket:`,
            value: `React with this emoji:  :computer:  to get fix`,
            inline: false,
          },
          { name: "\u200B", value: "\u200B", inline: false },
        )
        .setTimestamp()
        .setFooter("Linter used : ESLint", "https://codekitapp.com/images/help/free-eslint-icon@2x.png");

      msg.channel.send(embedResponse);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

process.env.NTBA_FIX_319 = 1;
require("dotenv").config();

const fetch = require("node-fetch");
const ogscraper = require("open-graph-scraper");

const DiscordBot = require("discord.js");
const { TOKEN } = process.env;
const bot = new DiscordBot.Client();
bot.login(TOKEN);

function formatIndent(str) {
  const lines = str.replace(/\t/g, "    ").split("\n");
  let ignored = [];
  let minSpaces = Infinity;
  let newLines = [];
  lines.forEach((line, idx) => {
    const leadingSpaces = line.search(/\S/);
    if (leadingSpaces == -1) {
      ignored.push(idx);
    } else if (leadingSpaces < minSpaces) {
      minSpaces = leadingSpaces;
    }
  });

  lines.forEach((line, idx) => {
    if (ignored.includes(idx)) {
      newLines.push(line);
    } else {
      newLines.push(line.substring(minSpaces));
    };
  });

  return newLines.join("\n")
};

bot.on("message", async (msg) => {

  // prevent replying to own messages
  if (msg.author.id == bot.user.id) {
    return;
  };

  const githubMatch = msg.content.match(/https?:\/\/github.com\/([a-zA-Z0-9-_]+\/[A-Za-z0-9_.-]+)\/blob\/(.+)\.(\w+)#L(\d+)-?L?(\d*)/i);
  if (!githubMatch) return;

  const resp = await fetch(`https://raw.githubusercontent.com/${githubMatch[1]}/${githubMatch[2]}.${githubMatch[3]}`);
  const text = await resp.text();
  const lines = text.split("\n");
  let toDisplay;
  console.log(githubMatch)
  if (!githubMatch[5].length) {
    toDisplay = lines[parseInt(githubMatch[4], 10) - 1].trim();
  } else {
    toDisplay = formatIndent(lines.slice(parseInt(githubMatch[4], 10) - 1, parseInt(githubMatch[5], 10)).join("\n"));
  };

  msg.suppressEmbeds();
  msg.channel.send(`\`\`\`${githubMatch[3]}\n${toDisplay}\`\`\``);

})

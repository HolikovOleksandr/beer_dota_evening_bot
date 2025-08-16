import "dotenv/config";
import { BeerDotaBot } from "./bot/BeerDotaBot.js";
import { ExpressServer } from "./server/ExpressServer.js";

const token = process.env.BOT_TOKEN;
const port = Number(process.env.PORT || 3000);
const webhookUrl = process.env.WEBHOOK_URL || "";
const webhookPath = process.env.WEBHOOK_PATH || "/bot";

if (!token) throw new Error("BOT_TOKEN is required");

async function main() {
  const bot = await BeerDotaBot.create(token!);

  if (webhookUrl) {
    const server = new ExpressServer(bot, port);
    await server.start(webhookUrl, webhookPath);
  } else {
    await bot.startPolling();
  }
}

main().catch(console.error);

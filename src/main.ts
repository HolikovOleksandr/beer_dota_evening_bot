import "dotenv/config";
import { BeerDotaBot } from "./bot/BeerDotaBot.js";

async function main() {
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN is required");

  const bot = await BeerDotaBot.create(token);
  await bot.startPolling();
}

main().catch(console.error);

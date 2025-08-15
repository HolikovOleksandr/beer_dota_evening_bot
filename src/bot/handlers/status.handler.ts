import { Context } from "grammy";
import fs from "fs";
import path from "path";

const STATE_FILE = path.resolve("./beerNightState.json");

export async function statusHandler(ctx: Context) {
  if (!fs.existsSync(STATE_FILE)) {
    await ctx.reply("Поки що ніхто не обрав варіанти на сьогодні.");
    return;
  }

  const beerNightState: Record<string, { username?: string; choice: string }> =
    JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));

  if (Object.keys(beerNightState).length === 0) {
    await ctx.reply("Поки що ніхто не обрав варіанти на сьогодні.");
    return;
  }

  let message = "<b>Стан пиводотного вечора на сьогодні:</b>\n\n";

  for (const [userId, data] of Object.entries(beerNightState)) {
    const name = data.username ? `@${data.username}` : userId;
    message += `• ${name}: ${data.choice}\n`;
  }

  await ctx.reply(message, { parse_mode: "HTML" });
}

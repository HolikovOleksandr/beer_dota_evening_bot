import { Context } from "grammy";
import fs from "fs";
import path from "path";
import "dotenv/config";
import beerNightKeyboard from "../keyboards/beer_night.keyboard";

const STATE_FILE = path.resolve(
  process.env.BEER_NIGHT_STATE_FILE || "./beerNightState.json"
);

let beerNightState: Record<string, { username?: string; choice: string }> = {};
if (fs.existsSync(STATE_FILE)) {
  beerNightState = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

export async function beerNightHandler(ctx: Context) {
  await ctx.reply("🍻 Пиводотний вечір?", { reply_markup: beerNightKeyboard });
}

export async function beerNightCallback(ctx: Context) {
  const userId = String(ctx.from?.id);
  const username = ctx.from?.username;
  const choice = ctx.callbackQuery?.data;

  if (!choice) return;

  beerNightState[userId] = { username, choice };
  fs.writeFileSync(STATE_FILE, JSON.stringify(beerNightState, null, 2));

  await ctx.answerCallbackQuery(`Ти обрав: ${choice}`);
  await ctx.reply(`Статус вечора: ${choice}`);
}

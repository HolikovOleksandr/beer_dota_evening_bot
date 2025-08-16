import { Context } from "grammy";
import fs from "fs";
import path from "path";
import "dotenv/config";
import beerNightKeyboard from "../keyboards/beer_night.keyboard";

const STATE_FILE = path.resolve(
  process.env.BEER_NIGHT_STATE_FILE || "./beerNightState.json"
);

interface BeerNightState {
  users: Record<string, { username?: string; choice: string }>;
  message_id?: number;
}

// ===================== ІНІЦІАЛІЗАЦІЯ СТАНУ =====================
let beerNightState: BeerNightState = { users: {} };
try {
  const content = fs.readFileSync(STATE_FILE, "utf-8").trim();
  beerNightState = content ? JSON.parse(content) : { users: {} };
} catch {
  beerNightState = { users: {} };
}

// ===================== ХЕЛПЕР =====================
function formatBeerNightMessage(state: BeerNightState) {
  let message = "<b>💪 Стан пиводотного вечора:</b>\n\n";
  for (const [id, data] of Object.entries(state.users || {})) {
    const name = data.username ? `@${data.username}` : id;
    message += `• ${name}: ${data.choice}\n`;
  }
  return message;
}

// ===================== ФУНКЦІЯ ВІДПРАВКИ / ОНОВЛЕННЯ ПОВІДОМЛЕННЯ =====================
async function sendOrReplaceMessage(ctx: Context, text: string) {
  if (beerNightState.message_id) {
    try {
      await ctx.api.deleteMessage(ctx.chat?.id!, beerNightState.message_id);
    } catch {
      // якщо видалити не вдалося — продовжуємо
    }
  }

  const sent = await ctx.reply(text, {
    reply_markup: beerNightKeyboard,
    parse_mode: "HTML",
  });
  beerNightState.message_id = sent.message_id;

  fs.writeFileSync(STATE_FILE, JSON.stringify(beerNightState, null, 2));
}

// ===================== ХЕНДЛЕР СТАРТУ =====================
export async function beerNightHandler(ctx: Context) {
  await sendOrReplaceMessage(ctx, "🍻 Пиводотний вечір?");
}

// ===================== ХЕНДЛЕР ВИБОРУ =====================
export async function beerNightChoiceHandler(ctx: Context) {
  const userId = String(ctx.from?.id);
  const username = ctx.from?.username;
  const choiceText = ctx.message?.text;
  if (!choiceText) return;

  // безпечна ініціалізація
  if (!beerNightState.users) beerNightState.users = {};

  beerNightState.users[userId] = { username, choice: choiceText };
  fs.writeFileSync(STATE_FILE, JSON.stringify(beerNightState, null, 2));

  const message = formatBeerNightMessage(beerNightState);
  await sendOrReplaceMessage(ctx, message);
}

// ===================== ХЕНДЛЕР СТАТУСУ =====================
export async function statusHandler(ctx: Context) {
  if (!beerNightState.users || Object.keys(beerNightState.users).length === 0) {
    await ctx.reply("🤕 Поки що ніхто не обрав варіанти на сьогодні.");
    return;
  }

  const message = formatBeerNightMessage(beerNightState);
  await sendOrReplaceMessage(ctx, message);
}

// ===================== ГЛОБАЛЬНИЙ ОБРОБНИК ПОМИЛОК =====================
export function setupErrorHandler(bot: any) {
  bot.catch = (err: any) => console.error("❌ BotError", err);
}

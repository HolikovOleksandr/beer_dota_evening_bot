import { Bot, Context } from "grammy";
import "dotenv/config";
import {
  beerNightHandler,
  beerNightChoiceHandler,
  statusHandler,
} from "./handlers/beer_night.handler.js";

export class BeerDotaBot {
  public bot: Bot;

  private constructor(token: string) {
    this.bot = new Bot(token);
  }

  // Фабричний метод для асинхронної ініціалізації
  public static async create(token: string): Promise<BeerDotaBot> {
    const instance = new BeerDotaBot(token);
    await instance.registerHandlers();
    return instance;
  }

  private async registerHandlers() {
    // Встановлюємо команди бота
    await this.bot.api.setMyCommands([
      { command: "start", description: "🍻 Пиводотний вечір?" },
      { command: "status", description: "👀 Переглянути стан вечора" },
    ]);

    // /start — видаляємо командне повідомлення та оновлюємо «живе» повідомлення
    this.bot.command("start", async (ctx) => {
      try {
        await ctx.deleteMessage();
      } catch {}
      await beerNightHandler(ctx);
    });

    // /status — видаляємо команду та показуємо стан
    this.bot.command("status", async (ctx) => {
      try {
        await ctx.deleteMessage();
      } catch {}
      await statusHandler(ctx);
    });

    // Валідні текстові кнопки
    const validChoices = [
      "🍻 Так",
      "😿 Тільки на суху",
      "🤔 Може бути",
      "🚫 Нажаль",
    ];

    // Ловимо усі повідомлення користувача
    this.bot.on("message", async (ctx) => {
      // Завжди намагаємось видалити повідомлення
      try {
        await ctx.deleteMessage();
      } catch {}

      const text = ctx.message?.text;
      // Обробляємо лише валідні кнопки
      if (text && validChoices.includes(text)) {
        await beerNightChoiceHandler(ctx);
      }
    });
  }

  public async startPolling() {
    console.log("🦾 Bot started in long polling mode");
    await this.bot.start();
  }
}

import { Bot } from "grammy";
import {
  beerNightHandler,
  beerNightCallback,
} from "./handlers/beer_night.handler.js";
import { statusHandler } from "./handlers/status.handler.js";

export class BeerDotaBot {
  public bot: Bot;

  constructor(token: string) {
    this.bot = new Bot(token);
    this.registerHandlers();
  }

  private registerHandlers() {
    this.bot.command("start", beerNightHandler);
    this.bot.command("status", statusHandler);

    this.bot.on("message:text", (ctx) => {
      ctx.reply("🍻 Пиводотний вечір?");
    });

    this.bot.callbackQuery(/self|no|dry|maybe/, beerNightCallback);
  }

  public async startPolling() {
    console.log("🦾 Bot started in long polling mode");
    await this.bot.start();
  }
}

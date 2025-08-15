import express, { Express } from "express";
import { webhookCallback } from "grammy";
import { BeerDotaBot } from "../bot/BeerDotaBot.js";

export class ExpressServer {
  private app: Express;
  private port: number;
  private bot: BeerDotaBot;

  constructor(bot: BeerDotaBot, port: number) {
    this.app = express();
    this.port = port;
    this.bot = bot;
  }

  public async start(webhookUrl: string, webhookPath: string) {
    this.app.use(express.json());
    this.app.use(webhookPath, webhookCallback(this.bot.bot, "express"));

    // Health-check
    this.app.get("/", (_req, res) => res.send("OK"));

    // Реєструємо webhook в Telegram
    await this.bot.bot.api.setWebhook(`${webhookUrl}${webhookPath}`);

    this.app.listen(this.port, () => {
      console.log(`Express server listening on port ${this.port}`);
    });
  }
}

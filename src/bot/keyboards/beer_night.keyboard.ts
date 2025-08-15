import { InlineKeyboard } from "grammy";

const beerNightKeyboard = new InlineKeyboard()
  .text("Само собою 🕹️", "yes")
  .row()
  .text("Не сьогодні ❌", "no")
  .row()
  .text("Так, але на суху 😢", "dry")
  .row()
  .text("Можливо 🤔", "maybe");

export default beerNightKeyboard;

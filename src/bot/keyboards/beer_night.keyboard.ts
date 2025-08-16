import { Keyboard } from "grammy";

const beerNightKeyboard = new Keyboard()
  .text("🍻 Так")
  .row()
  .text("😿 Тільки на суху")
  .row()
  .text("🤔 Може бути")
  .row()
  .text("🚫 Нажаль")
  .resized();

export default beerNightKeyboard;

const { Bot } = require('./Bot');
const { botToken } = require('./configure');

const mBot = new Bot(botToken);
const bot = mBot.getBot();

bot.start(async (ctx) => await mBot.start(ctx));

bot.on('message', async (ctx) => await mBot.onMessage(ctx));

bot.launch();

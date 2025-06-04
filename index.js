require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Variabili d'ambiente
const token = process.env.BOT_TOKEN;
const port = process.env.PORT || 3000;
const url = process.env.WEBHOOK_URL; // Es: https://tuo-dominio.com

if (!token || !url) {
  console.error('BOT_TOKEN o WEBHOOK_URL non presenti nelle variabili d\'ambiente');
  process.exit(1);
}

// Inizializza bot in modalità webhook
const bot = new TelegramBot(token, { webHook: { port: port } });

// Imposta il webhook su Telegram
bot.setWebHook(`${url}/bot${token}`);

// Crea server Express
const app = express();

// Endpoint per ricevere gli aggiornamenti da Telegram
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Comandi del bot
bot.onText(/\/start/i, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

bot.onText(/\/help/i, (msg) => {
  bot.sendMessage(msg.chat.id, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
`);
});

bot.onText(/\/info/i, (msg) => {
  bot.sendMessage(msg.chat.id, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.match(/^\/(start|help|info)/i)) return;

  bot.sendMessage(chatId, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server avviato sulla porta ${port}`);
  console.log(`Webhook impostato su ${url}/bot${token}`);
});

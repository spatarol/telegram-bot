const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const TELEGRAM_TOKEN = 'IL_TUO_TOKEN_DEL_BOT'; // Sostituisci con il token del tuo bot
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Middleware per il parsing dei body JSON
app.use(bodyParser.json());

// Impostare il webhook
app.post(`/webhook/${TELEGRAM_TOKEN}`, (req, res) => {
    const message = req.body.message;
    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        // Risposta semplice al messaggio
        sendMessage(chatId, `Hai scritto: ${text}`);
    }

    // Risposta "OK" a Telegram per confermare la ricezione
    res.send('OK');
});

// Funzione per inviare un messaggio tramite Telegram
const sendMessage = (chatId, text) => {
    axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: text,
    }).catch(err => {
        console.error('Errore nell\'invio del messaggio:', err);
    });
};

// Funzione per impostare il webhook
const setWebhook = async () => {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
            url: `https://tuo-dominio-render.app/webhook/${TELEGRAM_TOKEN}`, // Cambia con il tuo URL Render
        });
        console.log('Webhook impostato correttamente:', response.data);
    } catch (error) {
        console.error('Errore nel setting del webhook:', error);
    }
};

// Impostare il webhook all'avvio
setWebhook();

// Avvia il server Express
app.listen(port, () => {
    console.log(`Bot in esecuzione sulla porta ${port}`);
});

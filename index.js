const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

// Render port
const PORT = process.env.PORT || 3000;

// Setup WhatsApp client with session storage
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'bot1' }), // session saved automatically
    puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated, scan with your WhatsApp app!');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    console.log(`Message received: ${msg.body}`);
    if(msg.body.toLowerCase() === 'hi') {
        msg.reply('Hello! I am your WhatsApp bot.');
    }
});

// Initialize client
client.initialize();

// Optional Express server for Render healthcheck
app.get('/', (req, res) => res.send('WhatsApp bot is running!'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

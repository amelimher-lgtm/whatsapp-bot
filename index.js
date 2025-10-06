const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// WhatsApp client with session
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'bot1' }),
    puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

let latestQRCode = null; // store QR code for browser

// QR received
client.on('qr', async qr => {
    // convert QR to data URL
    latestQRCode = await qrcode.toDataURL(qr);
    console.log('QR Code updated for browser scan!');
});

// Client ready
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// Messages
client.on('message', msg => {
    console.log(`Message received: ${msg.body}`);
    if(msg.body.toLowerCase() === 'hi') {
        msg.reply('Hello! I am your WhatsApp bot.');
    }
});

// Initialize client
client.initialize();

// Browser route
app.get('/', (req, res) => {
    if(latestQRCode) {
        res.send(`
            <h1>Scan QR Code to login WhatsApp</h1>
            <img src="${latestQRCode}" alt="QR Code" />
        `);
    } else {
        res.send('<h1>WhatsApp bot is running. Waiting for QR code...</h1>');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

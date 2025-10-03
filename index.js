const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();

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

client.initialize();

const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Initialize client with session storage
const client = new Client({
    authStrategy: new LocalAuth()
});

// Display QR code for WhatsApp login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to connect');
});

// Notify when bot is ready
client.on('ready', () => {
    console.log('Bot is ready and connected to WhatsApp');
    checkStatuses();
});

// Function to simulate sending a verification code
function sendVerificationCode(number) {
    const verificationCode = Math.floor(10000000 + Math.random() * 90000000);
    console.log(`Sending verification code ${verificationCode} to ${number}`);
    client.sendMessage(number + '@c.us', `Your verification code is: ${verificationCode}`);
}

// Listen for "connect" command from user to send verification code
client.on('message', message => {
    if (message.body.toLowerCase() === 'connect') {
        sendVerificationCode(message.from.split('@')[0]);
    }
});

// Check and log statuses from contacts
async function checkStatuses() {
    const contacts = await client.getContacts();
    console.log('Reading status updates from contacts...');
    
    for (let contact of contacts) {
        const status = await contact.getStatus();
        if (status && status.status) {
            console.log(`Status from ${contact.name || contact.number}: ${status.status}`);
        }
    }
}

// Regularly check for new statuses
setInterval(checkStatuses, 60000);  // Checks every 60 seconds

client.initialize();

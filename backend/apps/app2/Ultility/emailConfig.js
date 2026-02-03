const nodemailer = require('nodemailer');

// Laptop
const baseUrl = 'http://192.168.5.92:4001/new/drawingrequest/';
// VM
// const baseUrl = 'http://192.168.4.239:4001/new/drawingrequest/';
const responsorEmail = "worawan@compact-brake.com"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'drp005@compact-brake.com',
        pass: 'kxffcqjxswpewdsw', // app password (no spaces)
    }
});

module.exports = { 
    transporter, 
    baseUrl,
    responsorEmail
};

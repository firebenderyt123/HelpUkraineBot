require('dotenv').config({ path: __dirname + '/../.env' });
const { Database } = require('./Database/Database');

const botToken = process.env.BOT_TOKEN;
const db = new Database();

module.exports = {
    botToken, db
};

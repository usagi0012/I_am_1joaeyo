require('dotenv').config();

const development = {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABAE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
};

module.exports = { development };

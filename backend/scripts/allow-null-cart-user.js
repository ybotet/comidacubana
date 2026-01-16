const { Sequelize } = require('sequelize');
require('dotenv').config();

(async () => {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        database: process.env.DB_NAME || 'restaurante_db',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123',
        logging: console.log,
    });

    try {
        await sequelize.authenticate();
        console.log('Connected to DB. Altering carts.user_id to allow NULL...');
        await sequelize.query('ALTER TABLE carts ALTER COLUMN user_id DROP NOT NULL;');
        console.log('Done.');
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
})();

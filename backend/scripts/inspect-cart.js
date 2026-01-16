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
        logging: false,
    });

    try {
        await sequelize.authenticate();
        const sessionId = process.argv[2] || '739d8622-862e-4974-8491-69fce5dec5eb';
        const [results] = await sequelize.query(`SELECT id, user_id, session_id, items, total_amount FROM carts WHERE session_id = $1 LIMIT 1`, { bind: [sessionId] });
        console.log(JSON.stringify(results, null, 2));
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
})();

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
        const [cols] = await sequelize.query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name='carts'");
        console.log(JSON.stringify(cols, null, 2));
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
})();

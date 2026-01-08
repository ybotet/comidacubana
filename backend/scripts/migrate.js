const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  console.log('Starting database migrations...');

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
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Read and execute SQL migration files
    const migrationsDir = path.join(__dirname, '../migrations');

    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of files) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await sequelize.query(sql);
      }
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();

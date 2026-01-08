const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

async function seedDatabase() {
  console.log('Seeding database...');

  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'restaurante_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to database for seeding.');

    // Aquí irán los modelos y datos iniciales
    // Se completará en Fase 1

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();

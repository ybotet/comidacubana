const { Sequelize } = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Función para conectar y verificar la base de datos
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    return true;
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    return false;
  }
}

// Sincronizar modelos (solo en desarrollo)
async function syncDatabase(force = false) {
  if (config.nodeEnv === 'development' || force) {
    try {
      // Cargar modelos centralizados
      require('./models');
      await sequelize.sync({ force });
      console.log(`✅ Base de datos ${force ? 'reiniciada' : 'sincronizada'}.`);
    } catch (error) {
      console.error('❌ Error sincronizando base de datos:', error);
    }
  }
}

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  Sequelize
};

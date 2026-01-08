const { sequelize } = require('../src/shared/database/config');
const User = require('../src/modules/auth/models/User');
const logger = require('../src/shared/logging/logger');

async function seedDatabase() {
  try {
    logger.info('Iniciando seed de base de datos...');
    
    // Sincronizar modelos
    await sequelize.sync({ force: false });
    logger.info('Modelos sincronizados');
    
    // Crear usuarios de prueba
    const users = [
      {
        email: 'admin@restaurante.com',
        password_hash: 'Admin123!', // Será hasheado por el hook
        first_name: 'Administrador',
        last_name: 'Sistema',
        role: 'admin',
        language: 'es'
      },
      {
        email: 'proveedor@restaurante.com',
        password_hash: 'Proveedor123!',
        first_name: 'Juan',
        last_name: 'Proveedor',
        role: 'provider',
        language: 'es'
      },
      {
        email: 'cliente@ejemplo.com',
        password_hash: 'Cliente123!',
        first_name: 'María',
        last_name: 'García',
        role: 'customer',
        language: 'es'
      },
      {
        email: 'clienteruso@ejemplo.com',
        password_hash: 'Cliente123!',
        first_name: 'Иван',
        last_name: 'Петров',
        role: 'customer',
        language: 'ru'
      }
    ];
    
    // Crear usuarios uno por uno para manejar errores de duplicados
    for (const userData of users) {
      try {
        const [user, created] = await User.findOrCreate({
          where: { email: userData.email },
          defaults: userData
        });
        
        if (created) {
          logger.info(`✅ Usuario creado: ${user.email}`);
        } else {
          logger.info(`⚠️  Usuario ya existe: ${user.email}`);
        }
      } catch (error) {
        logger.error(`❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }
    
    logger.info('✅ Seed de base de datos completado exitosamente');
    
  } catch (error) {
    logger.error('❌ Error en seed de base de datos:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

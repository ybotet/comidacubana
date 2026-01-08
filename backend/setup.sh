#!/bin/bash

echo "Ì∫Ä Setup del Sistema Restaurante"
echo "================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "‚ùå Node.js no encontrado. Por favor instala Node.js 18+"
    exit 1
fi

echo "‚úÖ Node.js encontrado: $(node --version)"

# Verificar Docker (opcional)
if command -v docker &> /dev/null; then
    echo "‚úÖ Docker encontrado: $(docker --version)"
else
    echo "‚ö†Ô∏è  Docker no encontrado. Se usar√° PostgreSQL local si est√° instalado"
fi

# Instalar dependencias backend
echo "Ì≥¶ Instalando dependencias del backend..."
cd backend
npm install

# Copiar archivo de entorno
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Ì≥Ñ Archivo .env creado. Por favor config√∫ralo."
fi

# Crear directorio de logs
mkdir -p logs

echo ""
echo "‚úÖ Setup completado!"
echo ""
echo "Ì≥ù Pasos siguientes:"
echo "1. Configurar variables en backend/.env"
echo "2. Iniciar PostgreSQL (local o con Docker)"
echo "3. Ejecutar migraciones: npm run db:migrate"
echo "4. Ejecutar seeds: npm run db:seed"
echo "5. Iniciar servidor: npm run dev"
echo ""
echo "Ì∞≥ O usar Docker Compose: docker-compose up -d"

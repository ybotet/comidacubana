# 🍲 Comida Cubana - Plataforma de Entrega

Sistema web bilingüe (español/ruso) para restaurante cubano con frontend React/Next.js y backend Node.js/Express.

## 🚀 Inicio Rápido

### Opción 1: Windows (Más Fácil)
```bash
# Doble click en:
start-dev.bat
```

### Opción 2: Terminal
```bash
# Desde la raíz del proyecto
npm install
npm run dev
```

✅ **Resultado**: Frontend en http://localhost:3001 + Backend en http://localhost:3000

---

## 📁 Estructura del Proyecto

- `/backend` - API Node.js/Express (puerto 3000)
- `/frontend` - React/Next.js (puerto 3001)
- `/docs` - Documentación
- `/deployments` - Configuración deploy

## 🛠️ Características

### Frontend (Next.js 14)
- ✅ Interfaz moderna y responsiva
- ✅ Bilingüe (Español/Ruso) con i18next
- ✅ Tema claro/oscuro dinámico
- ✅ Carrito de compras persistente
- ✅ Mobile-first responsive

### Backend (Node.js/Express)
- ✅ API RESTful completa
- ✅ Base de datos PostgreSQL
- ✅ Socket.io para notificaciones
- ✅ Autenticación JWT

## 📝 Scripts Disponibles

Ejecutar desde **la raíz** del proyecto:

```bash
npm run dev           # ⭐ Ejecutar backend + frontend (paralelo)
npm run backend       # Solo backend (puerto 3000)
npm run frontend      # Solo frontend (puerto 3001)
npm run build         # Compilar ambos para producción
```

## 🔗 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend | 3000 | http://localhost:3000 |
| Frontend | 3001 | http://localhost:3001 |
| API | 3000/api | http://localhost:3000/api |

## 📚 Stack Tecnológico

- **Backend:** Node.js, Express, PostgreSQL, Socket.io
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, i18next
- **DevOps:** Docker, Docker Compose

## 📄 Licencia

MIT

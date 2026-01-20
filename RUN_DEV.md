# 🚀 EJECUTAR FRONTEND Y BACKEND JUNTOS

## 🎯 Opción 1: Desde la raíz del proyecto (RECOMENDADO)

```bash
# Desde c:\Users\ybotet\Documentos\Programación\Adrian\comidacubana

# Instalar dependencias (primera vez)
npm install

# Ejecutar ambos simultáneamente
npm run dev
```

**Salida esperada:**
```
> comida-cubana@1.0.0 dev
> npm-run-all --parallel backend frontend

[backend] npm WARN lifecycle The node_modules/.bin/nodemon is not executable
[backend] > restaurante-backend@1.0.0 dev
[backend] > nodemon src/server.js
[backend] [nodemon] 3.0.1
[backend] [nodemon] to restart at any time, type `rs`
[backend] [nodemon] watching path(s): ...
[backend] Server running on http://localhost:3000

[frontend] npm WARN lifecycle The node_modules/.bin/next is not executable
[frontend] > comida-cubana-frontend@0.1.0 dev
[frontend] > next dev -p 3001
[frontend] 
[frontend] ▲ Next.js 14.2.3
[frontend] - Local: http://localhost:3001
```

---

## 🎯 Opción 2: Desde carpetas individuales

### Backend
```bash
cd backend
npm install
npm run dev
# Salida: Server running on http://localhost:3000
```

### Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
# Salida: Local: http://localhost:3001
```

---

## 📝 Scripts Disponibles

### Desde la raíz
```bash
npm run dev          # Ejecutar ambos (paralelo) ⭐
npm run backend      # Solo backend en puerto 3000
npm run frontend     # Solo frontend en puerto 3001
npm run build        # Compilar ambos
npm run start        # Iniciar versión compilada
npm run lint         # Verificar código
```

### Desde frontend
```bash
npm run dev          # Ejecutar en puerto 3001
npm run build        # Compilar
npm run start        # Producción en puerto 3001
```

### Desde backend
```bash
npm run dev          # Ejecutar en puerto 3000
npm run start        # Producción
npm run db:seed      # Llenar base de datos
```

---

## ✅ Verificación

Una vez ejecutado `npm run dev` desde la raíz:

| Componente | URL | Estado |
|-----------|-----|--------|
| Frontend | http://localhost:3001 | ✅ Debe aparecer |
| Backend API | http://localhost:3000/api | ✅ Debe responder |

---

## 🐛 Troubleshooting

### "npm-run-all no encontrado"
```bash
# Desde la raíz
npm install npm-run-all --save-dev
```

### "nodemon: command not found"
```bash
# Desde backend
npm install
```

### Port 3000 o 3001 ya ocupado
```bash
# Ver qué proceso está usando el puerto
lsof -i :3000
lsof -i :3001

# Matar el proceso
kill -9 <PID>
```

---

## 🎓 Estructura de Puertos

```
localhost:3000    → Backend API
localhost:3001    → Frontend Next.js

API calls: 
Frontend (3001) → Backend API (3000)
```

---

## 💡 Recomendaciones

1. **Primera vez**: Ejecuta desde la raíz con `npm run dev`
2. **Desarrollo**: Mantén ambas terminales abiertas
3. **Debugging**: Abre DevTools (F12) para ver errores
4. **API**: Verifica `http://localhost:3000/api` en Postman

---

## 🚀 Próximos Pasos

1. ✅ Ejecuta: `npm run dev`
2. ✅ Abre: http://localhost:3001
3. ✅ Prueba el frontend
4. ✅ Verifica API en: http://localhost:3000/api

¡Listo! 🎉

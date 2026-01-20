# 🚀 CÓMO INICIAR LA APLICACIÓN

## ⚡ Opción 1: Lo Más Rápido (Windows)

1. Haz doble click en: **`start-dev.bat`**
2. Espera a que aparezca:
   ```
   ✔ Frontend ready - localhost:3001
   ✔ Backend running on port 3000
   ```
3. Abre en navegador: **http://localhost:3001**

---

## 🖥️ Opción 2: Desde Terminal

### Primer uso (instalar dependencias)
```bash
npm install
```

### Ejecutar ambos servicios
```bash
npm run dev
```

**Resultado esperado:**
```
Backend: http://localhost:3000
Frontend: http://localhost:3001
```

---

## 📱 Opción 3: Ejecutar por Separado

### En terminal 1 (Backend)
```bash
npm run backend
```
Aparecerá:
```
> Server running on port 3000
```

### En terminal 2 (Frontend)
```bash
npm run frontend
```
Aparecerá:
```
▲ Next.js 14.x
✓ Ready in XXXms
- Local: http://localhost:3001
```

---

## ✅ Verificación

Después de ejecutar, comprueba que:

1. **Backend activo**: Entra a http://localhost:3000/api
   - Deberías ver un JSON de respuesta

2. **Frontend cargado**: Entra a http://localhost:3001
   - Deberías ver la página principal de "Comida Cubana"

3. **Cambiar idioma**: 🇪🇸 / 🇷🇺
   - Selecciona el idioma en la esquina arriba

4. **Cambiar tema**: 🌙 / ☀️
   - Prueba el tema oscuro

---

## 🛠️ Todos los Scripts Disponibles

Ejecutar desde la **raíz** del proyecto:

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Inicia Frontend + Backend juntos ⭐ |
| `npm run frontend` | Solo Frontend (3001) |
| `npm run backend` | Solo Backend (3000) |
| `npm run build` | Compila para producción |
| `npm run start` | Ejecuta versión compilada |

---

## 🐛 Si Algo Falla

### ❌ "Port 3001 is already in use"
Algo está usando el puerto. Soluciona así:

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <NUMERO> /F
```

**Mac/Linux:**
```bash
lsof -i :3001
kill -9 <NUMERO>
```

### ❌ "npm: command not found"
Node.js no está instalado. Descárgalo en:
https://nodejs.org/ (versión 18 o superior)

### ❌ "npm-run-all not found"
Instálalo manualmente:
```bash
npm install npm-run-all --save-dev
```

### ❌ "Module not found"
Instala dependencias:
```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

---

## 📁 Estructura de Carpetas

```
comida-cubana/
├── 📄 package.json              ← Scripts raíz
├── 🦇 start-dev.bat             ← Click para iniciar (Windows)
├── 📖 INICIO.md                 ← ESTE ARCHIVO
├── 📖 README.md                 ← Documentación general
│
├── 📁 backend/                  ← API (puerto 3000)
│   ├── 📄 package.json
│   ├── 📄 Dockerfile
│   └── 📁 src/
│
└── 📁 frontend/                 ← Web (puerto 3001)
    ├── 📄 package.json
    ├── 📄 next.config.js
    └── 📁 src/
        ├── 📁 app/              ← Páginas
        ├── 📁 components/       ← Componentes
        ├── 📁 contexts/         ← Estados globales
        └── 📁 locales/          ← Idiomas (ES/RU)
```

---

## 🎯 Próximos Pasos después de Iniciar

1. ✅ Abre: http://localhost:3001
2. ✅ Explora las páginas
3. ✅ Cambia idioma y tema
4. ✅ Prueba agregar al carrito
5. ✅ Abre la consola (F12) para ver logs

---

## 📞 Notas Importantes

- **Frontend puerto**: 3001 (por eso es http://localhost:3001)
- **Backend puerto**: 3000 (la API escucha aquí)
- **Hot reload**: Los cambios en el código se ven al guardar
- **Terminar**: Presiona `CTRL + C` en la terminal

---

## 💡 Consejos de Desarrollo

1. **Consola del navegador**: Abre F12 para ver errores
2. **Network tab**: Mira las peticiones al backend
3. **React DevTools**: Instala la extensión para depurar
4. **Log de backend**: Ve todos los logs en la terminal

---

**¿Todo listo?** 🎉

```bash
npm run dev
```

Luego abre: http://localhost:3001

¡Que disfrutes! 🍲

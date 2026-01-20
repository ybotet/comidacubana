# 🚀 Instalación y Primeros Pasos

## ✅ Requisitos Previos

- **Node.js** 18.17 o superior
- **npm** 9.0 o superior (o yarn/pnpm)
- **Git** (opcional pero recomendado)
- **Docker** (opcional)

Verifica tus versiones:
```bash
node --version    # v18.17.0 o superior
npm --version     # 9.0 o superior
```

## 📥 Instalación

### 1️⃣ Clonar o Descargar el Proyecto

```bash
# Si usas git
git clone <url-del-repositorio>
cd comidacubana/frontend

# O si descargaste como ZIP
cd comidacubana/frontend
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará todas las librerías necesarias en `node_modules/`

### 3️⃣ Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Copiar desde .env.example
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> ⚠️ **Nota**: Las variables que comienzan con `NEXT_PUBLIC_` se exponen al navegador

## 🎯 Iniciar Desarrollo

### Opción 1: Localmente (Recomendado)

```bash
npm run dev
```

Output esperado:
```
> comida-cubana-frontend@0.1.0 dev
> next dev

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Abre en tu navegador: **http://localhost:3000**

### Opción 2: Con Docker

```bash
# Build y run
docker-compose up

# Solo build
docker build -f Dockerfile.dev -t comida-cubana-frontend:dev .

# Solo run
docker run -p 3000:3000 comida-cubana-frontend:dev
```

## 🔍 Verificar que Todo Funciona

1. **Abre http://localhost:3000** en tu navegador
2. Deberías ver:
   - Header con logo "Comida Cubana"
   - Selector de idioma (ES/RU)
   - Botón de tema claro/oscuro
   - Hero section con menú destacado
   - Footer con contacto

3. **Prueba las funciones**:
   - [ ] Cambiar idioma (ES ↔ RU)
   - [ ] Cambiar tema (claro ↔ oscuro)
   - [ ] Navegar por links
   - [ ] Ver responsive en móvil (F12)

## 📖 Primeros Pasos de Desarrollo

### 1. Explorar la Estructura

```bash
# Ver archivos principales
ls -la src/
ls -la src/app/
ls -la src/components/
```

### 2. Editar Página de Inicio

Abrir `src/app/page.tsx` y hacer cambios. La página se refresca automáticamente.

### 3. Agregar Traducción

1. Editar `src/locales/es/common.json`
2. Agregar: `"miTexto": "Hola"`
3. En componente: `const { t } = useTranslation(); t('common.miTexto')`

### 4. Cambiar Colores

En `tailwind.config.ts`, modificar tema:
```ts
colors: {
  primary: { 500: '#FF0000' }, // Rojo
  secondary: { 500: '#00FF00' }, // Verde
}
```

## 🐛 Troubleshooting

### Error: "Port 3000 is already in use"

```bash
# Opción 1: Usar otro puerto
npm run dev -- -p 3001

# Opción 2: Liberar el puerto (Linux/Mac)
lsof -i :3000
kill -9 <PID>

# Opción 2: Liberar el puerto (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Module not found"

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### i18n no funciona

- Verificar que `LanguageProvider` esté en `layout.tsx`
- Verificar archivos JSON en `src/locales/`
- Recargar página (Ctrl+Shift+R)

### Estilos Tailwind no aplican

```bash
# Limpiar cache de Next.js
rm -rf .next
npm run dev
```

## 📚 Próximos Pasos

1. **Conectar Backend**: 
   - Asegúrate que backend corre en `http://localhost:3001`
   - Verifica que `/api/dishes` devuelve datos

2. **Implementar Autenticación**:
   - Ver `src/app/auth/login/page.tsx`
   - Implementar JWT tokens

3. **Agregar Más Páginas**:
   - Copiar estructura de `src/app/menu/page.tsx`
   - Adaptar según necesidad

4. **Testing**:
   - Instalar Jest: `npm install -D jest`
   - Crear archivo `.test.ts`

5. **Deploy**:
   - Vercel: `npm install -g vercel && vercel`
   - Docker: `docker build -t app . && docker run -p 3000:3000 app`

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React i18next](https://react.i18next.com)
- [Lucide Icons](https://lucide.dev)

## 💡 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Compilar para producción
npm start                # Correr versión compilada

# Verificación
npm run lint             # Ejecutar ESLint
npm run type-check       # TypeScript type checking

# Limpiar
npm run clean            # Limpiar archivos generados
npm cache clean --force  # Limpiar cache npm
```

## 📱 Testing Responsivo

### En Chrome DevTools:
1. Presionar `F12`
2. Click en ícono de dispositivo (arriba izquierda)
3. Seleccionar dispositivo (iPhone, iPad, etc.)
4. Probar todas las páginas

### Breakpoints principales:
- 320px (móvil pequeño)
- 768px (tablet)
- 1024px (desktop)

## 🎓 Estructura MVC Conceptual

```
Route (página)
    ↓
Layout (providers)
    ↓
Page Component
    ↓
Sub-components (DishCard, etc)
    ↓
Hooks (useCart, useTheme)
    ↓
Contexts (CartContext, etc)
    ↓
API Service
    ↓
Backend API
```

## ✨ Mejores Prácticas

✅ **Hacer:**
- Usar `'use client'` en componentes interactivos
- Importar tipos TypeScript
- Agregar traducciones en ambos idiomas
- Probar en móvil
- Validar inputs del usuario

❌ **Evitar:**
- Código sin tipos TypeScript
- Componentes sin traducción
- Cambios directos al DOM
- Variables globales sin Context
- Ignorar errores de la consola

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en terminal
2. Revisar console del navegador (F12)
3. Buscar en documentación oficial
4. Contactar al equipo de desarrollo

---

¡Listo para empezar! 🎉 Cualquier duda en el proceso, no dudes en contactar.

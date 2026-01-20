# Estructura del Frontend - Comida Cubana

## 📁 Árbol de Directorios

```
frontend/
├── .env.example                    # Ejemplo de variables de entorno
├── .eslintrc.yml                   # Configuración ESLint
├── .gitignore                      # Archivos ignorados por Git
├── Dockerfile                      # Imagen Docker producción
├── Dockerfile.dev                  # Imagen Docker desarrollo
├── docker-compose.yml              # Configuración Docker Compose
├── eslint.config.mjs               # Config ESLint adicional
├── next.config.js                  # Configuración Next.js
├── next-env.d.ts                   # Tipos TypeScript Next.js
├── package.json                    # Dependencias y scripts
├── postcss.config.js               # Configuración PostCSS
├── tailwind.config.ts              # Configuración Tailwind CSS
├── tsconfig.json                   # Configuración TypeScript
├── README.md                       # Documentación principal
├── QUICK_START.md                  # Guía de inicio rápido
│
├── public/                         # Archivos estáticos públicos
│   └── (favicon, manifests, etc)
│
└── src/
    ├── app/                        # Next.js App Router
    │   ├── layout.tsx              # Layout raíz (providers)
    │   ├── page.tsx                # Página de inicio
    │   ├── globals.css             # Estilos globales
    │   ├── not-found.tsx           # Página 404
    │   │
    │   ├── menu/
    │   │   └── page.tsx            # Página de menú
    │   │
    │   ├── cart/
    │   │   └── page.tsx            # Página de carrito
    │   │
    │   ├── orders/
    │   │   └── page.tsx            # Página de pedidos
    │   │
    │   ├── auth/login/
    │   │   └── page.tsx            # Página de autenticación
    │   │
    │   ├── about/
    │   │   └── page.tsx            # Acerca de nosotros
    │   │
    │   ├── contact/
    │   │   └── page.tsx            # Página de contacto
    │   │
    │   ├── privacy/
    │   │   └── page.tsx            # Política de privacidad
    │   │
    │   └── terms/
    │       └── page.tsx            # Términos y condiciones
    │
    ├── components/                 # Componentes reutilizables
    │   ├── Header.tsx              # Encabezado principal
    │   ├── Footer.tsx              # Pie de página
    │   ├── DishCard.tsx            # Tarjeta de plato
    │   ├── ThemeToggle.tsx         # Botón tema claro/oscuro
    │   ├── LanguageSelector.tsx    # Selector de idioma
    │   └── LoadingSpinner.tsx      # Spinner de carga
    │
    ├── contexts/                   # Context API
    │   ├── ThemeContext.tsx        # Contexto de tema
    │   ├── LanguageContext.tsx     # Contexto de idioma
    │   └── CartContext.tsx         # Contexto de carrito
    │
    ├── hooks/                      # Custom React Hooks
    │   ├── useLocalStorage.ts      # Hook localStorage
    │   └── useFetch.ts             # Hook para fetch
    │
    ├── services/                   # Servicios de API
    │   └── api.service.ts          # Cliente API
    │
    ├── locales/                    # Archivos de traducción
    │   ├── es/
    │   │   └── common.json         # Traducciones español
    │   └── ru/
    │       └── common.json         # Traducciones ruso
    │
    └── i18n.ts                     # Configuración i18next
```

## 📦 Dependencias Principales

```json
{
  "next": "14.2.3",           // Framework React
  "react": "18.3.1",          // Librería UI
  "tailwindcss": "3.4.1",     // Estilos CSS
  "i18next": "23.7.6",        // Internacionalización
  "react-i18next": "14.0.5",  // React i18n
  "axios": "1.6.5",           // Cliente HTTP
  "lucide-react": "0.334.0"   // Iconos
}
```

## 🎯 Páginas Creadas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Inicio | `/` | Hero, características, platos destacados |
| Menú | `/menu` | Grid de platos con filtros |
| Carrito | `/cart` | Visualización y gestión del carrito |
| Pedidos | `/orders` | Historial de pedidos |
| Login/Registro | `/auth/login` | Autenticación de usuario |
| Acerca de | `/about` | Información de la empresa |
| Contacto | `/contact` | Formulario de contacto |
| Privacidad | `/privacy` | Política de privacidad |
| Términos | `/terms` | Términos y condiciones |

## 🎨 Componentes Creados

| Componente | Tipo | Responsabilidad |
|-----------|------|-----------------|
| Header | Layout | Navegación principal, logo, carrito |
| Footer | Layout | Links, contacto, redes sociales |
| DishCard | Cards | Mostrar plato individual |
| ThemeToggle | Buttons | Cambiar tema claro/oscuro |
| LanguageSelector | Buttons | Cambiar idioma ES/RU |
| LoadingSpinner | Loading | Indicador de carga |

## 🔐 Contextos (State Management)

| Contexto | Función |
|----------|---------|
| ThemeContext | Gestionar tema claro/oscuro |
| LanguageContext | Gestionar idioma actual |
| CartContext | Gestionar items del carrito |

## 🌍 Soporte de Idiomas

- **Español (ES)** 🇪🇸
- **Ruso (RU)** 🇷🇺

Todos los textos están en `src/locales/`

## 📱 Responsive Breakpoints

- `sm:` - 640px (tablets pequeñas)
- `md:` - 768px (tablets)
- `lg:` - 1024px (desktops)
- `xl:` - 1280px (desktops grandes)

## 🎨 Colores Principales

| Color | Hex | Uso |
|-------|-----|-----|
| primary | #0ea5e9 (azul) | CTA, highlights |
| secondary | #f97316 (naranja) | Acentos |
| white | #ffffff | Fondo claro |
| gray | #1f2937 | Texto, bordes |
| dark | #0f172a | Fondo oscuro |

## 🚀 Scripts Disponibles

```bash
npm run dev           # Desarrollo
npm run build         # Build producción
npm start             # Correr producción
npm run lint          # Linting
npm run type-check    # Type checking
```

## 📊 Características Implementadas

✅ **Funcionales:**
- Catálogo de platos
- Carrito de compras persistente
- Sistema de pedidos
- Rastreo de pedidos
- Autenticación básica
- Formulario de contacto

✅ **UI/UX:**
- Tema claro/oscuro
- Idioma ES/RU
- Diseño responsive
- Mobile-first
- Iconos Lucide
- Loading states
- Error handling

✅ **Técnico:**
- TypeScript
- Next.js 14 App Router
- Tailwind CSS
- Context API
- i18next
- Axios
- Docker support

## 🔄 Flujo de Datos

```
Usuario
  ↓
Header (navegación)
  ↓
Páginas (menu, cart, orders)
  ↓
Componentes (DishCard, etc)
  ↓
Contextos (Theme, Language, Cart)
  ↓
API Service (conexión backend)
  ↓
Backend Node.js/Express
```

## 📈 Próximas Mejoras (Sugeridas)

- [ ] Autenticación JWT con token persistence
- [ ] Sistema de reseñas y ratings
- [ ] Wishlist/Favoritos
- [ ] Búsqueda de platos
- [ ] Notificaciones push
- [ ] Pago online integrado
- [ ] Analytics
- [ ] Progressive Web App (PWA)
- [ ] Multi-moneda
- [ ] Tests (Jest/Vitest)

## 🔗 Integración Backend

El frontend está listo para conectarse con tu backend en:
- **URL Base**: `http://localhost:3000/api`
- **Configurable en**: `.env.local`

Endpoints esperados:
- `POST /auth/login`
- `POST /auth/register`
- `GET /dishes`
- `GET /orders`
- `POST /orders`
- etc.

Ver [apiService](src/services/api.service.ts) para métodos disponibles.

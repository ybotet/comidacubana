# Frontend - Comida Cubana

Aplicación web moderna para restaurante cubano con soporte bilingüe y diseño responsive.

## Características

- **Bilingüe**: Español 🇪🇸 y Ruso 🇷🇺
- **Modo Claro/Oscuro**: Tema adaptable según preferencias del usuario
- **Responsive**: Diseño mobile-first optimizado para todos los dispositivos
- **Rápido**: Construido con Next.js 14 para máximo rendimiento
- **Carrito de Compras**: Gestión completa de pedidos en cliente
- **Rastreo de Pedidos**: Seguimiento en tiempo real

## Stack Tecnológico

- **Framework**: Next.js 14
- **UI**: React 18
- **Estilos**: Tailwind CSS 3
- **Internacionalización**: i18next + react-i18next
- **Iconos**: Lucide React
- **Cliente HTTP**: Axios

## Estructura del Proyecto

```
src/
├── app/                   # App Router (Next.js 14)
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página de inicio
│   ├── globals.css       # Estilos globales
│   ├── menu/             # Menú de platos
│   ├── cart/             # Carrito de compras
│   ├── orders/           # Mis pedidos
│   ├── auth/login/       # Autenticación
│   └── about/            # Acerca de
├── components/           # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── DishCard.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageSelector.tsx
│   └── LoadingSpinner.tsx
├── contexts/             # Context API
│   ├── ThemeContext.tsx
│   ├── LanguageContext.tsx
│   └── CartContext.tsx
├── locales/              # Archivos de traducción
│   ├── es/common.json
│   └── ru/common.json
└── i18n.ts              # Configuración i18next
```

## Instalación

### Requisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
Crear archivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

4. **Abrir en navegador**:
```
http://localhost:3000
```

## Disponibles

- **Desarrollo**: `npm run dev`
- **Build**: `npm run build`
- **Producción**: `npm start`
- **Linter**: `npm run lint`
- **Type Check**: `npm run type-check`

## Características por Página

### 🏠 Inicio (`/`)
- Hero section
- Características principales
- Platos destacados
- Call-to-action

### 🍽️ Menú (`/menu`)
- Grid de platos responsivo
- Filtrado por categoría
- Botón "Agregar al carrito"
- Información nutricional

### 🛒 Carrito (`/cart`)
- Visualización de artículos
- Control de cantidad
- Total con detalles
- Proceder a checkout

### 📦 Mis Pedidos (`/orders`)
- Historial de pedidos
- Estado del pedido
- Rastreo en tiempo real
- Información de entrega

### 🔐 Autenticación (`/auth/login`)
- Login
- Registro
- Validación de formularios

### ℹ️ Acerca de (`/about`)
- Misión y visión
- Valores de la empresa
- Información del equipo

## Internacionalización

Los idiomas se gestionan con `react-i18next`. Para agregar nuevas traducciones:

1. Editar `src/locales/es/common.json` o `src/locales/ru/common.json`
2. Agregar nuevas claves
3. Usar en componentes:
```tsx
const { t } = useTranslation();
<h1>{t('common.appName')}</h1>
```

## Tema Claro/Oscuro

El tema se almacena en localStorage y se sincroniza con la preferencia del sistema:

```tsx
const { isDark, toggleTheme } = useTheme();
```

## Carrito de Compras

Gestión de estado con Context API:

```tsx
const { items, addItem, removeItem, updateQuantity, total } = useCart();
```

## Diseño Responsive

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

Se utiliza grid de Tailwind CSS con breakpoints:
- `sm:` (640px)
- `md:` (768px)
- `lg:` (1024px)
- `xl:` (1280px)

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL de la API backend | `http://localhost:3001/api` |

## Optimizaciones de Rendimiento

- ✅ Code splitting automático
- ✅ Lazy loading de imágenes
- ✅ CSS-in-JS con Tailwind
- ✅ Componentes server-side donde es posible
- ✅ Caché de cliente

## Accesibilidad

- Contraste de colores WCAG AA
- Navegación por teclado
- Labels accesibles
- Atributos ARIA donde sea necesario

## Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT

## Contacto

Para preguntas o sugerencias sobre el frontend, contacta al equipo de desarrollo.


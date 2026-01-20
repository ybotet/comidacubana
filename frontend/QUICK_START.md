# Quick Start Guide - Frontend

## ⚡ Inicio Rápido

### 1. Requisitos
- Node.js 18 o superior
- npm o yarn

### 2. Instalación

```bash
cd frontend
npm install
```

### 3. Variables de Entorno

Crear `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## 📂 Estructura de Carpetas

```
src/
├── app/              # Next.js App Router
├── components/       # Componentes reutilizables
├── contexts/         # Context API
├── hooks/            # Custom hooks
├── locales/          # Traducciones (i18n)
├── services/         # Servicios de API
└── i18n.ts          # Config i18next
```

## 🎨 Estilos

- **Framework CSS**: Tailwind CSS 3
- **Modo Oscuro**: Automático con `dark:` prefix
- **Colores Principales**: `primary-*` y `secondary-*`

### Ejemplo de Estilo:
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenido responsive
</div>
```

## 🌍 Internacionalización

Usar `react-i18next`:

```tsx
import { useTranslation } from 'react-i18next';

export default function Component() {
  const { t } = useTranslation();
  return <h1>{t('common.appName')}</h1>;
}
```

Para agregar nuevos textos:
1. Editar `src/locales/es/common.json`
2. Editar `src/locales/ru/common.json`

## 🌓 Tema Oscuro/Claro

Usar `useTheme`:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

export default function Component() {
  const { isDark, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}
```

## 🛒 Carrito de Compras

Usar `useCart`:

```tsx
import { useCart } from '@/contexts/CartContext';

export default function Component() {
  const { items, addItem, total } = useCart();
  
  addItem({
    id: '1',
    dishId: '1',
    name: 'Ropa Vieja',
    price: 12.99,
    quantity: 1,
  });
}
```

## 🔌 API

Usar `apiService`:

```tsx
import { apiService } from '@/services/api.service';

// Obtener platos
const dishes = await apiService.getDishes();

// Crear pedido
const order = await apiService.createOrder(items, address, phone);
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Safe area insets para notch (iPhones)

```tsx
<div className="p-4 sm:p-6 md:p-8">
  Responsive padding
</div>
```

## 🧪 Testing

```bash
npm run build     # Build production
npm run type-check # Type checking
npm run lint      # ESLint
```

## 🐳 Docker

```bash
# Desarrollo
docker-compose up

# Producción
docker build -t comida-cubana-frontend .
docker run -p 3000:3000 comida-cubana-frontend
```

## 📝 Agregar Nueva Página

1. Crear archivo en `src/app/[ruta]/page.tsx`
2. Usar `'use client'` para componentes interactivos
3. Importar contextos y hooks necesarios
4. Agregar link en Header si corresponde

## 🎯 Checklist de Desarrollo

- [ ] Crear componente
- [ ] Agregar traducciones (ES + RU)
- [ ] Probar modo oscuro
- [ ] Probar en móvil (DevTools)
- [ ] Probar accesibilidad
- [ ] Agregar tests (si aplica)

## 🚀 Desplegar

### Vercel (Recomendado)
```bash
vercel deploy
```

### Docker
```bash
docker build -t comida-cubana-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=... comida-cubana-frontend
```

## 🐛 Debugging

```bash
# Logs en console
npm run dev

# DevTools de Next.js
http://localhost:3000/__nextjs_original-stack-frame
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React i18next](https://react.i18next.com)
- [Lucide React](https://lucide.dev)

## 💡 Tips

1. Usar `<Image>` de Next.js para optimizar imágenes
2. Lazy load componentes pesados con `dynamic()`
3. Usar `useLocalStorage` para persistencia
4. Validar en cliente Y servidor
5. Implementar error boundaries

## 🆘 Troubleshooting

### Port 3000 ya en uso
```bash
lsof -i :3000
kill -9 <PID>
```

### i18n no funciona
- Verificar que `LanguageProvider` esté en `layout.tsx`
- Verificar archivos de traducción en `src/locales/`

### Estilo no aplica
- Verificar que el archivo esté en `content:` de `tailwind.config.ts`
- Limpiar `.next/`

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

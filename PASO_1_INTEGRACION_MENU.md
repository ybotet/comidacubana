# 🔗 PASO 1: Integración Backend - Menú Conectado

## ✅ Lo que se Hizo

### 1. **Página de Menú Conectada al Backend**
   - ✅ Carga de platos desde `/api/dishes`
   - ✅ Carga de categorías desde `/api/dishes/categories`
   - ✅ Filtrado por categoría
   - ✅ Manejo de errores con datos de fallback
   - ✅ Loading spinner durante la carga

### 2. **Actualización de api.service.ts**
   - ✅ Exportación como default + named export
   - ✅ Base URL: `http://localhost:3000/api`
   - ✅ Manejo de timeout y CORS
   - ✅ Interceptores de error

### 3. **Endpoints Utilizados**
   - `GET /api/dishes` - Lista todos los platos
   - `GET /api/dishes/categories` - Lista categorías

---

## 🚀 Cómo Probar

### 1. Asegurate que el Backend esté corriendo
```bash
npm run backend
```

Deberías ver:
```
✓ Server running on port 3000
```

### 2. Ejecuta el Frontend
```bash
npm run frontend
```

O ambos:
```bash
npm run dev
```

### 3. Navega a Menú
```
http://localhost:3001/menu
```

### 4. Verificar la Consola
Abre `F12` → `Console` y deberías ver:
- ✅ Peticiones GET a `/api/dishes`
- ✅ Peticiones GET a `/api/dishes/categories`
- ✅ Respuestas con datos (o error si backend no tiene datos)

---

## 📊 Estructura de Respuesta Esperada

### GET /api/dishes
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Ropa Vieja",
      "description": "Carne desmenuzada en salsa de tomate",
      "price": 12.99,
      "category": "Platos Principales",
      "image": "..."
    }
  ]
}
```

### GET /api/dishes/categories
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Platos Principales"
    }
  ]
}
```

---

## 🔄 Flujo de Datos

```
Frontend (Menú Page)
    ↓
    ├→ useEffect() on mount
    ↓
    ├→ apiService.getCategories()
    ↓
    ├→ GET http://localhost:3000/api/dishes/categories
    ↓
Backend
    ├→ Consulta BD
    ├→ Retorna datos JSON
    ↓
Frontend recibe data
    ├→ Actualiza state: setCategories()
    ├→ Renderiza botones de filtro
    ↓
apiService.getDishes()
    ├→ GET http://localhost:3000/api/dishes
    ↓
Backend
    ├→ Consulta BD
    ├→ Retorna array de platos
    ↓
Frontend recibe platos
    ├→ Actualiza state: setDishes()
    ├→ Renderiza DishCard components
```

---

## 🔧 Archivos Modificados

1. **frontend/src/app/menu/page.tsx**
   - Integración con `apiService.getCategories()`
   - Integración con `apiService.getDishes()`
   - Manejo de errores
   - Datos de fallback

2. **frontend/src/services/api.service.ts**
   - Exportación como `default` + `named export`

---

## ✨ Características

- ✅ Carga real desde backend
- ✅ Fallback automático a datos mock si falla
- ✅ Loading spinner durante carga
- ✅ Mensaje de error informativo
- ✅ Filtrado por categoría funcional
- ✅ Responsive design

---

## 🆘 Troubleshooting

### ❌ "No se pudieron cargar los platos"
- Verifica que backend esté corriendo: `npm run backend`
- Verifica que BD esté conectada
- Abre DevTools → Network para ver el error

### ❌ Categorías pero sin platos
- Backend no tiene datos en la BD
- Ejecuta scripts de seed: `npm run seed --prefix backend`

### ❌ CORS error
- Verifica que backend tenga CORS habilitado
- Revisa app.js líneas 45-52

---

## 📝 Próximo Paso

Cuando esté listo, implementaremos:
- Página de Órdenes con datos reales
- Integración de autenticación
- Carrito persistente en backend

¿El menú está funcionando? ✅

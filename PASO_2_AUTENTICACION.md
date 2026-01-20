# 🔐 PASO 2: Autenticación Backend - Login & Register

## ✅ Lo que se Hizo

### 1. **Página de Autenticación Conectada**
   - ✅ Login con POST a `/api/auth/login`
   - ✅ Register con POST a `/api/auth/register`
   - ✅ Manejo de errores con mensajes claros
   - ✅ Estado de carga durante petición
   - ✅ Validación de campos
   - ✅ Guardado de token en localStorage
   - ✅ Redirect automático al menú tras login exitoso

### 2. **Seguridad Implementada**
   - ✅ Botones deshabilitados durante carga
   - ✅ Campos de entrada deshabilitados durante petición
   - ✅ Mensajes de error específicos
   - ✅ Limpieza de error al cambiar entre login/register
   - ✅ Token almacenado en localStorage

### 3. **Endpoints Utilizados**
   - `POST /api/auth/login` - Autenticación
   - `POST /api/auth/register` - Registro de usuario

---

## 🚀 Cómo Probar

### 1. Asegurate que Backend esté corriendo
```bash
npm run backend
```

### 2. Ejecuta Frontend
```bash
npm run frontend
```

### 3. Navega a Login
```
http://localhost:3001/auth/login
```

### 4. Prueba Login
- Email: `test@example.com`
- Password: `password123`

Deberías ver:
- ✅ Petición POST al backend
- ✅ Mensaje de error o redirección a /menu

### 5. Prueba Register
- Completa todos los campos
- El backend debería registrar el usuario
- Deberías ser redirigido a /menu

---

## 📊 Estructura de Respuesta Esperada

### POST /api/auth/login
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "1",
      "name": "Usuario",
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

### POST /api/auth/register
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "2",
      "name": "Nuevo Usuario",
      "email": "new@example.com",
      "phone": "+9876543210"
    }
  }
}
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario entra a /auth/login
2. Selecciona Login o Register
3. Completa el formulario
4. Presiona botón "Login" o "Register"
5. Frontend valida campos
   ├─ Si error → muestra mensaje de error
   └─ Si ok → continúa

6. Frontend envía POST a /api/auth/login o /api/auth/register
   └─ Incluye email, password, etc.

7. Backend verifica credentials
   ├─ Si error → retorna mensaje de error
   └─ Si ok → genera JWT token

8. Frontend recibe token
   ├─ Guarda en localStorage
   ├─ Guarda datos de usuario
   └─ Redirige a /menu

9. Usuario ve página de menú
```

---

## 💾 Almacenamiento

**localStorage:**
```javascript
localStorage.getItem('token')      // JWT token
localStorage.getItem('user')       // JSON del usuario
```

**Estructura del usuario:**
```json
{
  "id": "1",
  "name": "Nombre del Usuario",
  "email": "email@example.com",
  "phone": "+1234567890"
}
```

---

## 🔧 Archivos Modificados

1. **frontend/src/app/auth/login/page.tsx**
   - Integración con `apiService.login()`
   - Integración con `apiService.register()`
   - Manejo de estado (`isLoading`, `error`)
   - Guardado de token
   - Redirección con `useRouter`

---

## ✨ Características Implementadas

- ✅ Login funcional
- ✅ Register funcional
- ✅ Validación de campos
- ✅ Manejo de errores
- ✅ Estado de carga
- ✅ Token en localStorage
- ✅ Redirect automático
- ✅ UI deshabilitada durante petición

---

## 🆘 Troubleshooting

### ❌ "Error al iniciar sesión"
- Verifica credenciales
- Comprueba que el backend esté corriendo
- Abre DevTools → Network para ver el error

### ❌ "Error al registrarse"
- Completa TODOS los campos
- Email podría estar ya registrado
- Verifica que el backend esté disponible

### ❌ No se redirige a /menu
- Verifica que respuesta tenga `data.token`
- Checa la consola para errores

### ❌ Token no se guarda
- Abre DevTools → Application → localStorage
- Verifica que esté el token y user

---

## ⏭️ Próximo Paso

Cuando esté listo, implementaremos:
- Página de Órdenes con órdenes reales
- Integración del carrito con backend
- Historial de órdenes del usuario

¿La autenticación funciona? ✅

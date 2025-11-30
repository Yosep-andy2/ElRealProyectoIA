# Guía de Pruebas Manual - SIACTA

## Estado de los Servidores

**Backend**: ✅ Corriendo en `http://localhost:8000`
**Frontend**: ✅ Corriendo en `http://localhost:5173`

---

## Flujo de Prueba Completo

### 1. Registro de Usuario

1. Abre tu navegador en `http://localhost:5173`
2. Deberías ser redirigido a `/login`
3. Haz clic en **"Regístrate gratis"**
4. Completa el formulario:
   - **Email**: `test@example.com`
   - **Contraseña**: `password123`
   - **Confirmar Contraseña**: `password123`
5. Haz clic en **"Registrarse"**
6. **Resultado esperado**: Mensaje de éxito y redirección a `/login`

### 2. Inicio de Sesión

1. En la página de login, ingresa:
   - **Email**: `test@example.com`
   - **Contraseña**: `password123`
2. Haz clic en **"Iniciar sesión"**
3. **Resultado esperado**: Redirección al Dashboard

### 3. Dashboard

1. Deberías ver:
   - Navbar con tu email
   - Sidebar con opciones (Dashboard, Biblioteca)
   - Área de carga de documentos (drag & drop)
   - Mensaje de bienvenida si no hay documentos

### 4. Subir Documento

1. Arrastra un archivo PDF o haz clic en "Seleccionar archivo"
2. Selecciona un PDF de prueba
3. **Resultado esperado**:
   - Barra de progreso
   - Toast de éxito
   - El documento aparece en la lista con estado "Procesando"
   - Después de unos segundos, cambia a "Procesado"

### 5. Ver Documento

1. Haz clic en una tarjeta de documento
2. **Resultado esperado**:
   - Visor de PDF a la izquierda
   - Resumen del documento (corto y largo)
   - Interfaz de chat a la derecha

### 6. Chat con Documento

1. En la interfaz de chat, escribe: `¿De qué trata este documento?`
2. Presiona Enter o haz clic en el botón de enviar
3. **Resultado esperado**:
   - Tu mensaje aparece a la derecha (azul)
   - Indicador de carga
   - Respuesta de la IA aparece a la izquierda (gris)
   - **Nota**: Como estamos en modo mock, la respuesta será genérica

### 7. Historial de Chat

1. Recarga la página (F5)
2. **Resultado esperado**:
   - El chat anterior sigue visible
   - Los mensajes se cargan desde la base de datos

### 8. Biblioteca

1. Haz clic en **"Biblioteca"** en el sidebar
2. **Resultado esperado**:
   - Lista de todos tus documentos en formato de tarjetas
   - Barra de búsqueda funcional
   - Botón de eliminar en cada tarjeta

### 9. Eliminar Documento

1. En la biblioteca, haz clic en el icono de papelera (🗑️) en una tarjeta
2. **Resultado esperado**:
   - Modal de confirmación: "¿Eliminar documento?"
3. Haz clic en **"Eliminar"**
4. **Resultado esperado**:
   - Toast de éxito
   - El documento desaparece de la lista

### 10. Multi-tenancy (Prueba Avanzada)

1. Abre una ventana de incógnito
2. Registra otro usuario: `user2@example.com` / `password123`
3. Sube un documento como `user2`
4. Vuelve a la ventana original (como `test@example.com`)
5. **Resultado esperado**:
   - No deberías ver el documento de `user2`
   - Solo ves tus propios documentos

### 11. Cerrar Sesión

1. Haz clic en tu email en el navbar (si hay botón de logout)
2. O simplemente cierra el navegador y vuelve a abrir
3. **Resultado esperado**:
   - Deberías ser redirigido a `/login`

---

## Problemas Comunes

### Frontend no carga
- Verifica que `npm run dev` esté corriendo
- Revisa la consola del navegador (F12) para errores

### Backend no responde
- Verifica que `uvicorn` esté corriendo en puerto 8000
- Prueba `http://localhost:8000/docs` para ver la documentación de la API

### Error 404 en endpoints
- Asegúrate de que la base de datos esté inicializada (`python init_db.py`)
- Verifica que el token JWT sea válido (puede expirar)

### Chat no funciona
- Verifica que el documento esté en estado "Procesado"
- Revisa la consola del navegador para errores de red

---

## Endpoints de API (Para Debugging)

Puedes probar los endpoints directamente en `http://localhost:8000/docs`:

- **POST** `/api/v1/auth/register` - Registro
- **POST** `/api/v1/auth/login` - Login
- **GET** `/api/v1/auth/me` - Usuario actual
- **POST** `/api/v1/documents/upload` - Subir documento
- **GET** `/api/v1/documents/` - Listar documentos
- **GET** `/api/v1/documents/{id}` - Obtener documento
- **DELETE** `/api/v1/documents/{id}` - Eliminar documento
- **POST** `/api/v1/documents/{id}/chat` - Enviar mensaje
- **GET** `/api/v1/documents/{id}/chat/history` - Historial de chat

---

## Notas Importantes

- **IA Mock**: Las respuestas del chat son genéricas porque estamos usando un servicio mock
- **Vector Store Mock**: La búsqueda semántica es simulada (búsqueda simple por palabras)
- **SQLite**: Estamos usando SQLite local, los datos se guardan en `backend/sql_app.db`
- **Tokens**: Los tokens JWT expiran en 7 días

---

## Próximos Pasos

Una vez que hayas verificado que todo funciona:

1. **Integrar OpenAI Real**: Para respuestas de IA reales
2. **ChromaDB**: Para búsqueda semántica real
3. **Docker**: Desplegar con `docker-compose up --build`

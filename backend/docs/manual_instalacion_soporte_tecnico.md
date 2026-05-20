# Manual de Instalación

## Sistema de Gestión de Solicitudes de Soporte Técnico  
**Versión 1.0**

---

# Requisitos previos

Antes de instalar el sistema, asegúrese de contar con las siguientes herramientas:

- **Node.js** v18 o superior (incluye npm)
- **MySQL** 8.0 o superior
- **DBeaver** (opcional, para gestionar la base de datos)
- **Visual Studio Code** (recomendado, con extensión Live Server)

---

# 1. Clonar o copiar el proyecto

Extraiga el archivo comprimido del proyecto o clónelo desde el repositorio:

```bash
git clone <url-del-repositorio>
cd soporte-tecnico-system
```

---

# 2. Configurar la base de datos MySQL

## 2.1 Iniciar el servicio MySQL

### Si usa XAMPP
Abra el Panel de Control y pulse **Start** en MySQL.

### Si instaló MySQL independientemente
Verifique que el servicio `MySQL80` esté en ejecución:

1. Presione `Win + R`
2. Escriba:

```text
services.msc
```

3. Busque el servicio **MySQL80**
4. Verifique que esté en estado **Running**

---

## 2.2 Ejecutar el script de creación

Conéctese a MySQL usando DBeaver, MySQL Workbench o la terminal:

```bash
mysql -u root -p < database/schema.sql
```

El script crea:

- La base de datos `soporte_tecnico`
- Todas las tablas necesarias
- Datos de prueba:
  - usuarios
  - categorías
  - clientes

---

## 2.3 Verificar la base de datos

En DBeaver, refresque la conexión y compruebe que aparecen las siguientes tablas:

- `usuarios`
- `clientes`
- `categorias`
- `solicitudes`
- `historial_estados`

---

# 3. Configurar el Backend

## 3.1 Abrir la carpeta backend

```bash
cd backend
```

---

## 3.2 Instalar dependencias

```bash
npm install
```

---

## 3.3 Crear archivo de entorno

Cree un archivo `.env` basado en la plantilla `.env.example`:

```bash
cp .env.example .env
```

Edite el archivo `.env` con sus credenciales reales de MySQL:

```ini
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=su_contraseña
DB_NAME=soporte_tecnico
JWT_SECRET=clave-secreta-super-segura
JWT_EXPIRES_IN=8h
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

---

## 3.4 Iniciar el servidor

```bash
npm run dev
```

Si todo está correcto, verá en consola:

```text
 Servidor corriendo en http://localhost:3000
✓ Conexión a MySQL establecida correctamente
```

### Para producción

```bash
npm start
```

---

# 4. Configurar el Frontend

## 4.1 Abrir con Live Server

1. Abra Visual Studio Code
2. Vaya a:

```text
File → Open Folder…
```

3. Seleccione la carpeta `frontend`
4. Haga clic derecho sobre:

```text
pages/login.html
```

5. Seleccione:

```text
Open with Live Server
```

Se abrirá automáticamente el navegador en:

```text
http://localhost:5500/pages/login.html
```

---

### Alternativa usando terminal

```bash
cd frontend
npx http-server -p 5500
```

---

## 4.2 Verificar comunicación

Asegúrese de que el frontend acceda correctamente al backend en:

```text
http://localhost:3000
```

Si necesita cambiar la URL del backend, edite:

```text
frontend/js/api/authApi.js
```

o el archivo/script global donde se defina `API_URL`.

---

# 5. Credenciales de prueba

| Rol            | Email                    | Contraseña |
|-----------------|--------------------------|-------------|
| Administrador   | admin@soporte.com        | admin123 |
| Técnico         | tecnico@soporte.com      | admin123 |
| Supervisor      | supervisor@soporte.com   | admin123 |
| Cliente         | cliente@demo.com         | admin123 |

---

# 6. Solución de problemas

## Error: `EADDRINUSE address already in use :::3000`

El puerto 3000 está ocupado.

### Verificar el proceso

```powershell
netstat -ano | findstr :3000
```

### Finalizar el proceso

```powershell
taskkill /PID <PID> /F
```

También puede cambiar el puerto en el archivo `.env`.

---

## Error: `connect ECONNREFUSED 127.0.0.1:3306`

MySQL no está corriendo.

### Solución
Inicie el servicio MySQL desde XAMPP o desde `services.msc`.

---

## Error: `Unknown database 'soporte_tecnico'`

No se ha ejecutado el script SQL.

### Solución
Realice nuevamente el paso **2.2**.

---

## Error en frontend: `authApi is not defined`

Los archivos JavaScript no están cargando correctamente.

### Solución

Verifique que los siguientes archivos se estén importando correctamente en `login.html`:

- `auth.js`
- `authApi.js`

Si el problema persiste, puede incrustar los scripts directamente en el HTML.

---

# Fin del documento

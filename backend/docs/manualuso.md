
---

##  Manual Básico de Uso (`docs/USER_MANUAL.md`)

# Manual Básico de Uso

Sistema de Gestión de Solicitudes de Soporte Técnico

## 1. Inicio de sesión

1. Abra `http://localhost:5500/pages/login.html`.
2. Ingrese su **email** y **contraseña**.
3. Haga clic en **Iniciar Sesión**.

Ejemplo (administrador):  
**Email:** admin@soporte.com  
**Contraseña:** admin123

## 2. Navegación

Tras iniciar sesión, verá una barra de navegación superior con opciones según su rol:

- **Cliente:** Dashboard | Mis Solicitudes | Nueva Solicitud
- **Técnico:** Dashboard | Solicitudes | Clientes
- **Supervisor:** Dashboard | Solicitudes | Clientes | Usuarios
- **Administrador:** Dashboard | Solicitudes | Clientes | Usuarios | Categorías

La opción **Mi Perfil** está disponible para todos los roles haciendo clic en el email del usuario.

## 3. Dashboard

Muestra un resumen de las solicitudes según el rol:

- **Administrador / Supervisor:** estadísticas generales (pendientes, en proceso, resueltas, canceladas) y últimas solicitudes.
- **Técnico / Cliente:** listado de sus propias solicitudes recientes.

## 4. Gestión de Solicitudes

### 4.1 Crear una solicitud (Cliente, Admin, Supervisor)

1. Vaya a **Nueva Solicitud**.
2. Diligencie:
   - **Título** (mínimo 5 caracteres)
   - **Descripción** detallada (mínimo 10 caracteres)
   - **Categoría** (Red, Hardware, Software…)
   - **Prioridad** (Baja, Media, Alta, Crítica)
3. Si es administrador o supervisor, puede seleccionar un **cliente** específico.
4. Haga clic en **Enviar Solicitud**.

La solicitud quedará en estado **Pendiente**.

### 4.2 Ver solicitudes

- Acceda a **Solicitudes** en el menú.
- Use los filtros superiores para buscar por estado, prioridad, categoría o texto.
- Haga clic en **Ver** para abrir el detalle completo.

### 4.3 Cambiar estado de una solicitud

1. En la tabla de solicitudes, haga clic en **Cambiar**.
2. Seleccione el nuevo estado:
   - **En Proceso** (cuando se asigna un técnico)
   - **Resuelto** (requiere comentario de resolución, mín. 10 caracteres)
   - **Cancelado** (requiere motivo, mín. 5 caracteres)
3. Escriba un comentario si aplica.
4. Confirme la acción.

Solo los roles autorizados pueden realizar cada transición (ver reglas abajo).

### 4.4 Asignar un técnico (Supervisor / Admin)

1. En una solicitud **pendiente**, haga clic en **Asignar**.
2. Seleccione el técnico de la lista.
3. La solicitud pasa a estado **En Proceso** automáticamente.

## 5. Gestión de Clientes (Técnico, Supervisor, Admin)

- **Ver clientes:** menú **Clientes**. Use el buscador para filtrar por nombre, empresa o email.
- **Nuevo cliente:** botón **+ Nuevo Cliente**. Llene nombre, empresa, email, teléfono y dirección.
- **Editar:** clic en **Editar**.
- **Eliminar:** clic en **Eliminar** (solo si no tiene solicitudes asociadas).

## 6. Gestión de Usuarios (Supervisor, Admin)

- Acceda desde **Usuarios** en el menú.
- Puede **filtrar** por rol y buscar por nombre/email.
- **Crear usuario:** botón **+ Nuevo Usuario**. Ingrese nombre, email, contraseña y rol.
- **Editar:** permite cambiar nombre y rol (solo admin puede cambiar roles).
- **Eliminar:** solo si el usuario no tiene solicitudes activas.

## 7. Gestión de Categorías (Admin)

- Acceda desde **Categorías**.
- **Crear:** ingrese nombre y descripción.
- **Editar:** modifique nombre, descripción o active/desactive la categoría.
- Las categorías inactivas no aparecerán al crear nuevas solicitudes, pero se mantienen en el historial.

## 8. Mi Perfil

- Haga clic en su email en la barra superior.
- Puede ver su información y **subir una foto de perfil** (JPG/PNG, máximo 5 MB).
- La foto se actualizará en tiempo real.

## 9. Cerrar sesión

Haga clic en el botón rojo **Cerrar Sesión** en la barra superior. Será redirigido al login.

## 10. Reglas de transición de estados

| Estado actual | Estados permitidos | Roles autorizados |
|---------------|-------------------|-------------------|
| Pendiente     | En Proceso        | Supervisor, Admin |
| Pendiente     | Cancelado         | Cliente (propia)  |
| En Proceso    | Resuelto          | Técnico asignado  |
| En Proceso    | Cancelado         | Técnico, Supervisor, Admin |
| Resuelto      | (ninguno)         | —                 |
| Cancelado     | (ninguno)         | —                 |

**Resuelto** y **Cancelado** son estados finales y no pueden modificarse.

---

## Roles y permisos

| Funcionalidad               | Cliente | Técnico | Supervisor | Admin |
|----------------------------|---------|---------|------------|-------|
| Ver mis solicitudes        | ✓       | ✓       | ✓          | ✓     |
| Crear solicitud            | ✓       | —       | ✓          | ✓     |
| Cambiar estado de solicitud | solo cancelar propias | solo asignadas | ✓          | ✓     |
| Asignar técnico            | —       | —       | ✓          | ✓     |
| Ver todos los clientes     | —       | ✓       | ✓          | ✓     |
| Crear / editar clientes    | —       | —       | ✓          | ✓     |
| Eliminar clientes          | —       | —       | —          | ✓     |
| Ver usuarios               | —       | —       | ✓          | ✓     |
| Crear / editar usuarios    | —       | —       | —          | ✓     |
| Eliminar usuarios          | —       | —       | —          | ✓     |
| Gestionar categorías       | —       | —       | —          | ✓     |
| Subir foto de perfil       | ✓       | ✓       | ✓          | ✓     |

---

 Última actualización: Mayo 2026
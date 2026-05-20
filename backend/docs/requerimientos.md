NMO# Requirements Document

## Introduction

Sistema web de gestión de solicitudes de soporte técnico empresarial que permite registrar clientes, crear casos de soporte, asignarlos a técnicos y realizar seguimiento completo del estado de cada solicitud. El sistema implementa control de acceso basado en roles (RBAC) con cuatro niveles: Cliente, Técnico, Supervisor y Administrador.

**Stack Tecnológico:**
- Backend: Node.js + Express
- Base de datos: MySQL
- Frontend: HTML, CSS, JavaScript vanilla
- Autenticación: JWT

## Glossary

- **Sistema**: El sistema completo de gestión de solicitudes de soporte técnico
- **Usuario**: Persona registrada en el sistema con credenciales de acceso
- **Cliente**: Usuario que reporta problemas y solicita soporte
- **Técnico**: Usuario que atiende y resuelve solicitudes de soporte
- **Supervisor**: Usuario que supervisa técnicos y gestiona asignaciones
- **Administrador**: Usuario con acceso completo al sistema
- **Solicitud**: Caso de soporte técnico reportado por un cliente
- **Categoría**: Clasificación del tipo de problema (red, hardware, software, etc.)
- **Estado**: Situación actual de una solicitud (pendiente, en proceso, resuelto, cancelado)
- **Prioridad**: Nivel de urgencia de una solicitud
- **Token_JWT**: Token de autenticación JSON Web Token
- **Rol**: Conjunto de permisos asignados a un usuario
- **Backend**: Servidor Node.js con Express que procesa la lógica de negocio
- **Frontend**: Interfaz de usuario en HTML/CSS/JavaScript
- **Pool_Conexiones**: Conjunto reutilizable de conexiones a MySQL
- **Middleware**: Función interceptora en Express para validación y control
- **Repository**: Capa de acceso a datos que ejecuta consultas SQL
- **Service**: Capa de lógica de negocio
- **Controller**: Capa que maneja peticiones HTTP
- **Foto_Perfil**: Imagen del usuario almacenada en el servidor

## Requirements

### Requirement 1: Autenticación de Usuarios

**User Story:** Como usuario del sistema, quiero iniciar sesión con mis credenciales, para que pueda acceder a las funcionalidades según mi rol.

#### Acceptance Criteria

1. WHEN un usuario envía credenciales válidas, THE Backend SHALL generar un Token_JWT con información del rol
2. WHEN un usuario envía credenciales inválidas, THE Backend SHALL retornar un error 401 con mensaje descriptivo
3. THE Token_JWT SHALL expirar después de 8 horas de inactividad
4. WHEN un usuario cierra sesión, THE Frontend SHALL eliminar el Token_JWT del almacenamiento local
5. THE Backend SHALL hashear contraseñas usando bcrypt con factor de costo 10

### Requirement 2: Control de Acceso Basado en Roles

**User Story:** Como administrador del sistema, quiero que cada rol tenga permisos específicos, para que los usuarios solo accedan a funcionalidades autorizadas.

#### Acceptance Criteria

1. THE Sistema SHALL definir cuatro roles: Cliente, Técnico, Supervisor, Administrador
2. WHEN un Cliente inicia sesión, THE Sistema SHALL permitir crear solicitudes y ver su historial
3. WHEN un Técnico inicia sesión, THE Sistema SHALL permitir ver solicitudes asignadas y actualizar estados
4. WHEN un Supervisor inicia sesión, THE Sistema SHALL permitir asignar solicitudes a técnicos y ver reportes
5. WHEN un Administrador inicia sesión, THE Sistema SHALL permitir acceso completo a todos los módulos
6. WHEN un usuario intenta acceder a una ruta no autorizada, THE Backend SHALL retornar error 403
7. THE Frontend SHALL mostrar menú dinámico según el rol del usuario autenticado

### Requirement 3: Gestión de Usuarios

**User Story:** Como administrador, quiero administrar usuarios del sistema, para que pueda registrar, modificar y eliminar cuentas de acceso.

#### Acceptance Criteria

1. THE Sistema SHALL permitir crear usuarios con campos: nombre, email, contraseña, rol, foto_perfil
2. WHEN se registra un usuario, THE Backend SHALL validar que el email sea único en la base de datos
3. WHEN se registra un usuario, THE Backend SHALL validar formato de email usando expresión regular
4. THE Sistema SHALL permitir actualizar datos de usuario excepto el email
5. THE Sistema SHALL permitir eliminar usuarios sin solicitudes activas asociadas
6. WHEN se elimina un usuario con solicitudes activas, THE Backend SHALL retornar error 400 con mensaje descriptivo
7. THE Sistema SHALL permitir consultar lista de usuarios con filtros por rol y estado

### Requirement 4: Gestión de Foto de Perfil

**User Story:** Como usuario, quiero subir una foto de perfil, para que mi cuenta tenga una imagen identificativa.

#### Acceptance Criteria

1. THE Sistema SHALL permitir cargar archivos de imagen en formatos JPG, JPEG y PNG
2. WHEN un usuario sube una foto, THE Backend SHALL validar que el tamaño no exceda 5 MB
3. WHEN un usuario sube un archivo inválido, THE Backend SHALL retornar error 400 con mensaje descriptivo
4. THE Backend SHALL almacenar fotos en directorio uploads/profiles con nombre único generado
5. WHEN se actualiza una foto de perfil, THE Backend SHALL eliminar la foto anterior del servidor
6. THE Sistema SHALL retornar URL de la foto para visualización en el Frontend
7. WHERE un usuario no tiene foto, THE Frontend SHALL mostrar imagen por defecto

### Requirement 5: Gestión de Clientes/Solicitantes

**User Story:** Como administrador o supervisor, quiero administrar información de clientes, para que pueda mantener registro de personas y empresas que solicitan soporte.

#### Acceptance Criteria

1. THE Sistema SHALL permitir crear clientes con campos: nombre, empresa, email, teléfono, dirección
2. THE Sistema SHALL permitir actualizar información de clientes existentes
3. THE Sistema SHALL permitir eliminar clientes sin solicitudes asociadas
4. WHEN se elimina un cliente con solicitudes, THE Backend SHALL retornar error 400 con mensaje descriptivo
5. THE Sistema SHALL permitir consultar lista de clientes con búsqueda por nombre o empresa
6. THE Sistema SHALL mostrar historial de solicitudes por cliente ordenado por fecha descendente

### Requirement 6: Gestión de Categorías de Soporte

**User Story:** Como administrador, quiero administrar categorías de problemas, para que las solicitudes se clasifiquen correctamente.

#### Acceptance Criteria

1. THE Sistema SHALL permitir crear categorías con campos: nombre, descripción, estado activo/inactivo
2. THE Sistema SHALL incluir categorías predefinidas: Red, Hardware, Software, Impresoras, Acceso a Sistemas, Correo Electrónico
3. THE Sistema SHALL permitir actualizar nombre y descripción de categorías
4. THE Sistema SHALL permitir desactivar categorías en lugar de eliminarlas
5. WHEN se desactiva una categoría, THE Sistema SHALL mantener solicitudes existentes con esa categoría
6. THE Sistema SHALL permitir consultar solo categorías activas para nuevas solicitudes

### Requirement 7: Creación de Solicitudes de Soporte

**User Story:** Como cliente, quiero crear solicitudes de soporte, para que pueda reportar problemas técnicos que necesito resolver.

#### Acceptance Criteria

1. THE Sistema SHALL permitir crear solicitudes con campos: título, descripción, categoría, prioridad
2. WHEN se crea una solicitud, THE Sistema SHALL asignar estado inicial "pendiente"
3. WHEN se crea una solicitud, THE Sistema SHALL registrar fecha y hora de creación
4. WHEN se crea una solicitud, THE Sistema SHALL asociarla al cliente autenticado
5. THE Sistema SHALL validar que descripción tenga mínimo 10 caracteres
6. THE Sistema SHALL validar que título tenga mínimo 5 caracteres
7. THE Sistema SHALL permitir seleccionar prioridad: Baja, Media, Alta, Crítica

### Requirement 8: Asignación de Solicitudes

**User Story:** Como supervisor, quiero asignar solicitudes a técnicos, para que los casos se distribuyan equitativamente.

#### Acceptance Criteria

1. WHERE el usuario es Supervisor o Administrador, THE Sistema SHALL permitir asignar solicitudes a técnicos
2. WHEN se asigna una solicitud, THE Sistema SHALL cambiar estado a "en proceso"
3. WHEN se asigna una solicitud, THE Sistema SHALL registrar fecha y hora de asignación
4. THE Sistema SHALL permitir reasignar solicitudes a otro técnico
5. THE Sistema SHALL mostrar carga de trabajo actual de cada técnico (solicitudes activas)
6. THE Sistema SHALL permitir filtrar técnicos disponibles por categoría de especialización

### Requirement 9: Actualización de Estado de Solicitudes

**User Story:** Como técnico, quiero actualizar el estado de mis solicitudes asignadas, para que se refleje el progreso de resolución.

#### Acceptance Criteria

1. WHEN un Técnico actualiza una solicitud asignada, THE Sistema SHALL permitir cambiar estado a: en proceso, resuelto, cancelado
2. WHEN se marca una solicitud como resuelta, THE Sistema SHALL requerir comentario de resolución mínimo 10 caracteres
3. WHEN se marca una solicitud como cancelada, THE Sistema SHALL requerir motivo de cancelación
4. WHEN se actualiza el estado, THE Sistema SHALL registrar fecha y hora del cambio
5. THE Sistema SHALL mantener historial de cambios de estado con usuario responsable
6. WHERE el usuario es Cliente, THE Sistema SHALL permitir solo cancelar sus propias solicitudes pendientes

### Requirement 10: Consulta y Filtrado de Solicitudes

**User Story:** Como usuario del sistema, quiero consultar solicitudes con filtros, para que pueda encontrar casos específicos rápidamente.

#### Acceptance Criteria

1. THE Sistema SHALL permitir filtrar solicitudes por estado, prioridad, categoría y fecha
2. WHERE el usuario es Cliente, THE Sistema SHALL mostrar solo sus propias solicitudes
3. WHERE el usuario es Técnico, THE Sistema SHALL mostrar solicitudes asignadas y pendientes
4. WHERE el usuario es Supervisor o Administrador, THE Sistema SHALL mostrar todas las solicitudes
5. THE Sistema SHALL permitir búsqueda por texto en título y descripción
6. THE Sistema SHALL ordenar resultados por fecha de creación descendente por defecto
7. THE Sistema SHALL paginar resultados mostrando 20 solicitudes por página

### Requirement 11: Historial de Atención por Cliente

**User Story:** Como supervisor, quiero ver el historial completo de solicitudes de un cliente, para que pueda analizar patrones de problemas recurrentes.

#### Acceptance Criteria

1. THE Sistema SHALL mostrar todas las solicitudes de un cliente ordenadas por fecha
2. THE Sistema SHALL mostrar estadísticas: total de solicitudes, resueltas, pendientes, tiempo promedio de resolución
3. THE Sistema SHALL permitir filtrar historial por rango de fechas
4. THE Sistema SHALL mostrar técnico asignado y estado actual de cada solicitud
5. THE Sistema SHALL calcular tiempo de resolución como diferencia entre fecha de creación y fecha de resolución

### Requirement 12: Protección de Rutas Backend

**User Story:** Como desarrollador del sistema, quiero proteger rutas del backend, para que solo usuarios autenticados y autorizados accedan a los endpoints.

#### Acceptance Criteria

1. THE Backend SHALL validar Token_JWT en todas las rutas protegidas usando Middleware
2. WHEN un Token_JWT es inválido o expirado, THE Backend SHALL retornar error 401
3. WHEN un usuario no tiene permisos para una ruta, THE Backend SHALL retornar error 403
4. THE Middleware SHALL extraer información del usuario del Token_JWT y agregarla al objeto request
5. THE Backend SHALL permitir acceso sin autenticación solo a rutas de login y registro

### Requirement 13: Validación de Datos

**User Story:** Como desarrollador del sistema, quiero validar datos en cliente y servidor, para que se prevenga ingreso de información incorrecta.

#### Acceptance Criteria

1. THE Frontend SHALL validar campos requeridos antes de enviar formularios
2. THE Frontend SHALL validar formato de email usando expresión regular
3. THE Frontend SHALL validar longitud mínima y máxima de campos de texto
4. THE Backend SHALL validar todos los datos recibidos independientemente de validación del Frontend
5. WHEN la validación falla, THE Backend SHALL retornar error 400 con lista de campos inválidos
6. THE Backend SHALL sanitizar entradas para prevenir inyección SQL usando consultas parametrizadas

### Requirement 14: Manejo de Errores

**User Story:** Como desarrollador del sistema, quiero manejar errores de forma centralizada, para que el sistema responda consistentemente ante fallos.

#### Acceptance Criteria

1. THE Backend SHALL implementar Middleware global de manejo de errores
2. WHEN ocurre un error no controlado, THE Backend SHALL retornar error 500 con mensaje genérico
3. THE Backend SHALL registrar errores en consola con stack trace completo
4. THE Backend SHALL retornar respuestas JSON estandarizadas con estructura: success, message, data, error
5. WHEN ocurre error de base de datos, THE Backend SHALL retornar mensaje descriptivo sin exponer detalles técnicos

### Requirement 15: Gestión de Conexiones a Base de Datos

**User Story:** Como desarrollador del sistema, quiero gestionar conexiones a MySQL eficientemente, para que el sistema maneje múltiples peticiones concurrentes.

#### Acceptance Criteria

1. THE Backend SHALL utilizar Pool_Conexiones con mínimo 5 y máximo 20 conexiones simultáneas
2. WHEN se ejecuta una consulta, THE Backend SHALL obtener conexión del pool y liberarla después
3. WHEN el pool está lleno, THE Backend SHALL encolar peticiones con timeout de 10 segundos
4. THE Backend SHALL usar consultas parametrizadas en todas las operaciones de base de datos
5. WHEN ocurre error de conexión, THE Backend SHALL reintentar 3 veces antes de fallar

### Requirement 16: Estructura de Código Backend

**User Story:** Como desarrollador del sistema, quiero una arquitectura limpia y mantenible, para que el código sea fácil de entender y modificar.

#### Acceptance Criteria

1. THE Backend SHALL organizar código en capas: routes, controllers, services, repositories, middlewares, utils
2. THE Repository SHALL contener solo lógica de acceso a datos
3. THE Service SHALL contener lógica de negocio sin dependencia de Express
4. THE Controller SHALL manejar peticiones HTTP y delegar a Service
5. THE Backend SHALL aplicar principios SOLID documentados con comentarios en código
6. THE Backend SHALL aplicar Clean Code: funciones cortas (máximo 20 líneas), nombres descriptivos, sin duplicación

### Requirement 17: Configuración con Variables de Entorno

**User Story:** Como desarrollador del sistema, quiero configurar datos sensibles mediante variables de entorno, para que no se expongan credenciales en el código.

#### Acceptance Criteria

1. THE Backend SHALL cargar configuración desde archivo .env usando dotenv
2. THE Sistema SHALL incluir archivo .env.example con todas las variables requeridas sin valores reales
3. THE Backend SHALL validar que variables críticas estén definidas al iniciar
4. THE Backend SHALL usar variables de entorno para: puerto, host de base de datos, usuario, contraseña, secreto JWT
5. THE archivo .env SHALL estar incluido en .gitignore

### Requirement 18: Frontend Modular

**User Story:** Como desarrollador del sistema, quiero un frontend organizado y modular, para que sea fácil mantener y extender la interfaz.

#### Acceptance Criteria

1. THE Frontend SHALL organizar código en archivos separados por funcionalidad
2. THE Frontend SHALL usar fetch API para comunicación con Backend
3. THE Frontend SHALL almacenar Token_JWT en localStorage después de login exitoso
4. THE Frontend SHALL incluir Token_JWT en header Authorization de todas las peticiones protegidas
5. WHEN el Backend retorna error 401, THE Frontend SHALL redirigir a página de login
6. THE Frontend SHALL validar existencia de Token_JWT antes de cargar páginas protegidas

### Requirement 19: Respuestas JSON Estandarizadas

**User Story:** Como desarrollador del Frontend, quiero respuestas consistentes del Backend, para que pueda procesar resultados de forma uniforme.

#### Acceptance Criteria

1. THE Backend SHALL retornar respuestas con estructura: {success: boolean, message: string, data: object}
2. WHEN una operación es exitosa, THE Backend SHALL establecer success en true y código HTTP 200 o 201
3. WHEN una operación falla, THE Backend SHALL establecer success en false y código HTTP apropiado
4. THE Backend SHALL incluir mensaje descriptivo en español en campo message
5. THE Backend SHALL incluir datos de respuesta en campo data cuando aplique

### Requirement 20: Script de Base de Datos

**User Story:** Como administrador del sistema, quiero un script SQL ejecutable, para que pueda crear la estructura de base de datos fácilmente.

#### Acceptance Criteria

1. THE Sistema SHALL incluir archivo schema.sql con todas las tablas necesarias
2. THE script SQL SHALL crear base de datos si no existe
3. THE script SQL SHALL crear tablas: usuarios, clientes, categorias, solicitudes, historial_estados
4. THE script SQL SHALL definir claves primarias, foráneas e índices apropiados
5. THE script SQL SHALL insertar datos iniciales: roles, categorías predefinidas, usuario administrador
6. THE script SQL SHALL ser ejecutable desde DBeaver sin errores

### Requirement 21: Documentación del Sistema

**User Story:** Como usuario nuevo del sistema, quiero documentación clara, para que pueda instalar, configurar y usar el sistema correctamente.

#### Acceptance Criteria

1. THE Sistema SHALL incluir README.md con instrucciones de instalación paso a paso
2. THE Sistema SHALL incluir guía de conexión a MySQL usando DBeaver
3. THE Sistema SHALL incluir manual de usuario básico con capturas de pantalla
4. THE Sistema SHALL incluir explicación de estructura de carpetas
5. THE Sistema SHALL incluir ejemplos de uso de cada endpoint en formato de colección Postman o similar

### Requirement 22: Búsqueda y Filtrado de Registros

**User Story:** Como usuario del sistema, quiero buscar y filtrar registros, para que pueda encontrar información específica rápidamente.

#### Acceptance Criteria

1. THE Sistema SHALL permitir búsqueda por texto en usuarios, clientes y solicitudes
2. THE Sistema SHALL implementar búsqueda case-insensitive
3. THE Sistema SHALL permitir combinar múltiples filtros simultáneamente
4. WHEN no hay resultados, THE Sistema SHALL mostrar mensaje "No se encontraron resultados"
5. THE Sistema SHALL mantener filtros aplicados al navegar entre páginas de resultados

### Requirement 23: Validación de Tipos de Archivo

**User Story:** Como administrador del sistema, quiero que solo se permitan tipos de archivo seguros, para que se prevenga carga de archivos maliciosos.

#### Acceptance Criteria

1. WHEN un usuario sube un archivo, THE Backend SHALL validar extensión contra lista permitida
2. WHEN un usuario sube un archivo, THE Backend SHALL validar MIME type del archivo
3. WHEN un archivo no cumple validaciones, THE Backend SHALL retornar error 400 con mensaje específico
4. THE Backend SHALL usar librería multer para manejo de archivos multipart
5. THE Backend SHALL generar nombres únicos para archivos usando timestamp y UUID

### Requirement 24: Menú Dinámico por Rol

**User Story:** Como usuario del sistema, quiero ver solo las opciones de menú relevantes a mi rol, para que la interfaz sea clara y no confusa.

#### Acceptance Criteria

1. WHEN un Cliente inicia sesión, THE Frontend SHALL mostrar menú: Mis Solicitudes, Nueva Solicitud, Mi Perfil
2. WHEN un Técnico inicia sesión, THE Frontend SHALL mostrar menú: Solicitudes Asignadas, Todas las Solicitudes, Mi Perfil
3. WHEN un Supervisor inicia sesión, THE Frontend SHALL mostrar menú: Dashboard, Solicitudes, Clientes, Asignaciones, Mi Perfil
4. WHEN un Administrador inicia sesión, THE Frontend SHALL mostrar menú completo con todas las opciones
5. THE Frontend SHALL ocultar opciones de menú no autorizadas usando información del Token_JWT

### Requirement 25: Tiempo de Respuesta del Sistema

**User Story:** Como usuario del sistema, quiero que las operaciones respondan rápidamente, para que pueda trabajar eficientemente.

#### Acceptance Criteria

1. WHEN se consulta lista de solicitudes, THE Backend SHALL responder en menos de 500 milisegundos
2. WHEN se crea una solicitud, THE Backend SHALL responder en menos de 300 milisegundos
3. WHEN se sube una foto de perfil, THE Backend SHALL procesar en menos de 2 segundos
4. THE Backend SHALL implementar índices en columnas de búsqueda frecuente
5. THE Backend SHALL limitar resultados de consultas a máximo 1000 registros por petición

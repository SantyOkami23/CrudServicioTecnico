-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema de Gestión de Solicitudes de Soporte Técnico
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS soporte_tecnico
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE soporte_tecnico;

-- ============================================
-- Tabla: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'tecnico', 'supervisor', 'administrador') NOT NULL DEFAULT 'cliente',
  foto_perfil VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: clientes
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100) NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NULL,
  direccion TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_empresa (empresa),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: categorias
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: solicitudes
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  cliente_id INT NOT NULL,
  categoria_id INT NOT NULL,
  tecnico_id INT NULL,
  estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cancelado') NOT NULL DEFAULT 'pendiente',
  prioridad ENUM('baja', 'media', 'alta', 'critica') NOT NULL DEFAULT 'media',
  comentario_resolucion TEXT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_asignacion TIMESTAMP NULL,
  fecha_resolucion TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_cliente (cliente_id),
  INDEX idx_tecnico (tecnico_id),
  INDEX idx_estado (estado),
  INDEX idx_prioridad (prioridad),
  INDEX idx_categoria (categoria_id),
  INDEX idx_fecha_creacion (fecha_creacion),
  INDEX idx_estado_tecnico (estado, tecnico_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: historial_estados
-- ============================================
CREATE TABLE IF NOT EXISTS historial_estados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL,
  estado_anterior ENUM('pendiente', 'en_proceso', 'resuelto', 'cancelado') NULL,
  estado_nuevo ENUM('pendiente', 'en_proceso', 'resuelto', 'cancelado') NOT NULL,
  usuario_id INT NOT NULL,
  comentario TEXT NULL,
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_solicitud (solicitud_id),
  INDEX idx_fecha (fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES (Seed Data)
-- ============================================

-- Usuario Administrador por defecto
-- Contraseña: admin123 (bcrypt hash factor 10)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador Principal', 'admin@soporte.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf6pO2M5F0TqOJpFbHrBRBvtJZOa', 'administrador'),
('Técnico Demo', 'tecnico@soporte.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf6pO2M5F0TqOJpFbHrBRBvtJZOa', 'tecnico'),
('Supervisor Demo', 'supervisor@soporte.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf6pO2M5F0TqOJpFbHrBRBvtJZOa', 'supervisor'),
('Cliente Demo', 'cliente@demo.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf6pO2M5F0TqOJpFbHrBRBvtJZOa', 'cliente');

-- Categorías predefinidas
INSERT INTO categorias (nombre, descripcion, activo) VALUES
('Red', 'Problemas de conectividad, internet, VPN', TRUE),
('Hardware', 'Fallas en equipos físicos, componentes', TRUE),
('Software', 'Errores en aplicaciones, instalaciones', TRUE),
('Impresoras', 'Problemas con impresoras y escáneres', TRUE),
('Acceso a Sistemas', 'Permisos, credenciales, accesos', TRUE),
('Correo Electrónico', 'Problemas con email, Outlook, webmail', TRUE);

-- Cliente de ejemplo
INSERT INTO clientes (nombre, empresa, email, telefono, direccion) VALUES
('María González', 'Tech Solutions SA', 'maria@techsolutions.com', '+573001234567', 'Calle 123 #45-67, Bogotá'),
('Carlos Rodríguez', 'InnovaSoft Ltda', 'carlos@innovasoft.com', '+573002345678', 'Carrera 89 #12-34, Medellín'),
('Ana Martínez', 'DataCorp SAS', 'ana@datacorp.com', '+573003456789', 'Avenida 56 #78-90, Cali');
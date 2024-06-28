-- Tabla para clientes
CREATE TABLE IF NOT EXISTS Clientes (
    id_cliente SERIAL PRIMARY KEY,
    cc VARCHAR(15),
    nombre VARCHAR(100),
    telefono VARCHAR(15),
    direccion VARCHAR(200),
    fechaCumple timestamp,
    fechaEliminacion timestamp default null
);

-- Crear la tabla de tokenski revocados
CREATE TABLE revoked_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(1000) NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para productos tipo
CREATE TABLE IF NOT EXISTS Productos_tipo (
    id_producto_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    fechaEliminacion timestamp default null   
);
-- Tabla para productos
CREATE TABLE IF NOT EXISTS Productos (
    id_producto SERIAL PRIMARY KEY,
    id_tipo INT,
    nombre VARCHAR(100),
    precio DECIMAL(10, 2),
    FOREIGN KEY (id_tipo) REFERENCES Productos_tipo(id_producto_tipo),
    fechaEliminacion timestamp default null
);

-- Tabla para mesas
CREATE TABLE IF NOT EXISTS Mesas (
    id_mesa SERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

-- Tabla para pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT,
    id_usuario INT,
    id_mesa INT,
    fecha_pedido TIMESTAMP,
    tipo_pedido VARCHAR(20),
    estado INT default null,
    total_pedido DECIMAL(10, 2),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_mesa) REFERENCES Mesas(id_mesa),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    fechaEliminacion timestamp default null
);

-- Tabla para detalles de pedidos
CREATE TABLE IF NOT EXISTS Detalles_Pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    nota VARCHAR(250),
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    fechaEliminacion timestamp default null
);

-- Tabla para usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    tipo VARCHAR(20) CHECK (tipo IN ('Gerente', 'Empleado')),
    contrasena VARCHAR(255),
    usuario VARCHAR(255),
    fechaEliminacion timestamp default null
);

-- Tabla para facturas
CREATE TABLE IF NOT EXISTS Facturas (
    id_factura SERIAL PRIMARY KEY,
    id_pedido INT,
    fecha_factura TIMESTAMP,
    id_empleado INT,
    nequi INT,
    bancolombia INT,
    efectivo INT,
	descuento_por DECIMAL(5, 2),
    Adescuento_val DECIMAL(10, 2),
	total_factura DECIMAL(10, 2),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_empleado) REFERENCES Usuarios(id_usuario),
    fechaEliminacion timestamp default null
);

-- Eliminar todos los elementos de la tabla Productos_tipo
TRUNCATE TABLE Productos,Productos_tipo CASCADE;

-- Reiniciar el contador del ID para Productos tipo
ALTER SEQUENCE Productos_tipo_id_producto_tipo_seq RESTART WITH 1;

-- Reiniciar el contador del ID para Productos
ALTER SEQUENCE Productos_id_producto_seq RESTART WITH 1;

-- Insertar datos en la tabla Productos_tipo
INSERT INTO Productos_tipo (nombre) VALUES 
('PICADAS TRADICIONALES AL BARRIL'),
('CERVEZAS'),
('PERROS + PAPAS A LA FRANCESA'),
('BEBIDAS'),
('HAMBURGUESAS'),
('CHICHARRÓN'),
('PICADAS'),
('COSTILLAS'),
('MENÚ INFANTIL'),
('DORILOCOS AL BARRIL'),
('DESGRANADO'),
('ADICIONES'),
('ASADOS TRADICIONALES'),
('CORTES ESPECIALES CERDO'),
('CORTES ESPECIALES RES');

INSERT INTO Productos (id_tipo, nombre, precio)
VALUES 
    (1, 'CHICHARRON MEDIO', 14000.00),
    (1, 'CHICHARRON ENTERA', 20000.00),
    (1, 'BONDIOLA DE CERDO MEDIO', 14000.00),
    (1, 'BONDIOLA DE CERDO ENTERA', 20000.00),
    (1, 'POLLO MEDIO', 14000.00),
    (1, 'POLLO ENTERA', 19000.00),
    (1, 'RES MEDIO', 14000.00),
    (1, 'RES ENTERA', 20000.00),
    (1, 'SUIZO MEDIO', 14000.00),
    (1, 'SUIZO ENTERA', 20000.00),
    (1, '3 CARNES (SUIZO + 2 CARNES A ESCOGER) MEDIO', 16000.00),
    (1, '3 CARNES (SUIZO + 2 CARNES A ESCOGER) ENTERA', 23000.00),
	(1,'PICADA PARA 3',40000.00),
	(1,'PICADA PARA 5',55000.00),
	(2, 'AGUILA LIGHT', 3500.00),
    (2, 'AGUILA ORIGINAL', 3500.00),
    (2, 'CLUB COLOMBIA', 4000.00),
    (2, 'COSTEÑITA', 3500.00),
    (2, 'CORONITA', 4000.00),
    (2, 'MICHELADAS (CERVEZA O SODA)', 8000.00),
	(3, 'BONDIOLA DE CERDO', 11000.00),
    (3, 'CHICHARRON', 11000.00),
    (3, 'POLLO', 11000.00),
    (3, 'SUIZO', 11000.00),
    (3, '2 CARNES', 13000.00),
    (3, '3 CARNES', 14000.00),
	(4, 'HATSU', 4500.00),
    (4, 'COCACOLA 400ML', 4500.00),
    (4, 'JUGO HIT', 3500.00),
    (4, 'COCACOLA 1.5L', 8000.00),
    (4, 'BOTELLA DE AGUA 300ML', 1000.00),
    (4, 'BOTELLA DE AGUA 600ML', 2000.00),
    (4, 'AGUA SABORIZADA', 2000.00),
    (4, 'AGUA SABORIZADA GRANDE', 3500.00),
    (4, 'POSTOBÓN', 3000.00),
    (4, 'SODA', 3500.00),
    (4, 'SODA GINGER', 4000.00),
    (4, 'JUGOS NATURALES', 3000.00),
    (4, 'COLA ROMAN', 3000.00),
	(5, 'CHICHARRON', 14000.00),
    (5, 'PUNTA DE ANCA', 14000.00),
    (5, 'CHURRASCO DE POLLO', 13000.00),
    (5, 'ESPECIAL DE LA CASA', 20000.00),
	(6, '1/2 CHICHARRÓN AHUMADO', 16000.00),
    (6, 'X1 CHICHARRÓN AHUMADO', 23000.00),
    (6, 'X2 CHICHARRÓN AHUMADO', 45000.00),
	(7, 'AHUMADA X1', 22000.00),
    (7, 'AHUMADA X2', 33000.00),
    (7, 'AHUMADA X3', 45000.00),
    (7, 'PICADA FAMILIAR', 100000.00),
	(8, 'COSTILLAS AHUMADAS', 26000.00),
	(9, 'NUGGETS DE POLLO + PAPAS', 10000.00),
    (9, 'SALCHIPAPAS', 10000.00),
    (9, 'MINI PERRO (CARNE A ESCOGER)', 6000.00),
	(10, 'SENCILLO', 10000.00),
    (10, 'MIXTO', 12000.00),
    (10, 'ESPECIAL', 15000.00),
    (10, 'FAMILIAR SENCILLO', 20000.00),
    (10, 'FAMILIAR ESPECIAL', 25000.00),
	(11, 'DESGRANADO AL BARRIL SENCILLO', 12000.00),
    (11, 'DESGRANADO AL BARRIL ESPECIAL', 16000.00),
	(12, 'CHICHARRÓN', 2000.00),
    (12, 'POLLO', 2000.00),
    (12, 'RES', 2000.00),
    (12, 'QUESO COSTEÑO', 2000.00),
        (13, 'CERDO MEDIO', 13000.00),
	    (13, 'CERDO ENTERO', 24000.00),
	    (13, 'RES MEDIO', 14000.00),
		(13, 'RES ENTERO', 26000.00),
		(13, 'PECHUGA MEDIO', 13000.00),
		(13, 'PECHUGA ENTERO', 24000.00),
		(14, 'PUNTA DE ANCA', 22000.00),
		(14, 'CHULETA DE CERDO', 16000.00),
		(14, 'PLATO MIXTO', 15000.00),
		(14, 'PINCHO MIXTO X 2', 16000.00),
		(15, 'TOMAHAWK MEDIA', 38000.00),
		(15, 'TOMAHAWK ENTERA', 50000.00),
		(15, 'RIBEYE', 32000.00),
		(15, 'NEW YORK', 30000.00),
		(15, 'PUNTA DE ANCA', 30000.00),
		(15, 'CHURRASCO', 30000.00);


INSERT INTO Clientes (cc,nombre, telefono, direccion,fechaCumple)
VALUES 
    (123456,'Oscar Alfonso',123456,'123',now()),
    (123456,'Jesus Rivas',123456,'12345',now());

INSERT INTO usuarios (nombre, usuario, tipo, contrasena, estado) 
VALUES ('Juan', 'juan4541','Gerente','$2a$10$c4wVA0esIwKD.KT9jKLgeuLqHdwxw6Rc4l5JcybdlWpKFQetUroSK','1'),
('Pablo','pablo123','Empleado','$2a$10$2bEw5VnmTe95BAD5cVUk7uFdI4f9YkFcdHbhqm.UyK72/ppVngBD6','1');

INSERT INTO Mesas (nombre)
VALUES 
    ('mesa 1'),
    ('mesa 2'),
    ('mesa 3'),
    ('mesa 4'),
    ('mesa 5'),
    ('mesa 6'),
    ('mesa 7'),
    ('mesa 8'),
    ('mesa 9');

    INSERT INTO pedidos(id_cliente, id_mesa, fecha_pedido, tipo_pedido, total_pedido) VALUES
(1,3,'12/12/2021','domicilio',6000);

INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, nota, subtotal) VALUES 
(1,33,2,'Vivo por la calle bla bla bla y cerca de bla bla bla',
4000);

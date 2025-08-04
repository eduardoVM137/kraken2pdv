import pyodbc
import psycopg2
from decimal import Decimal, InvalidOperation
from datetime import datetime

# 🔹 Helper para convertir valores numéricos
def safe_numeric(value, default=Decimal("0.00")):
    try:
        val = Decimal(str(value).replace(",", ""))
        return val if abs(val) < Decimal("100000000") else default
    except (InvalidOperation, TypeError, ValueError):
        return default

# 🔹 Conexión a SQL Server (Windows Auth)
sql_conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=PDVKraken;"
    "Trusted_Connection=yes;"
)
sql_cursor = sql_conn.cursor()

# 🔹 Conexión a PostgreSQL
pg_conn = psycopg2.connect(
    dbname="kraken",
    user="postgres",
    password="admin1234",
    host="192.168.1.64",
    port="5432"
)
pg_cursor = pg_conn.cursor()

# Leer desde vista CrearProducto
sql_cursor.execute("SELECT * FROM CrearProducto")

for row in sql_cursor.fetchall():
    cod_producto = str(row.CodigoProducto).strip() if row.CodigoProducto else None
    cod_barras = str(row.CodigoDeBarras).strip() if row.CodigoDeBarras else None
    descripcion = row.Descripcion or "SIN DESCRIPCIÓN"
    categoria = row.Categoria or 1

    precio_venta = safe_numeric(row.PVenta)
    precio_costo = safe_numeric(row.PCosto)
    stock = safe_numeric(row.stock_actual)
    stock_minimo = safe_numeric(row.stock_minimo)

    # 1. Insertar en producto
    pg_cursor.execute("""
        INSERT INTO producto (nombre, descripcion, activo, categoria_id, state_id)
        VALUES (%s, %s, true, %s, 1)
        RETURNING id
    """, (descripcion, descripcion, categoria))
    producto_id = pg_cursor.fetchone()[0]

    # 2. Insertar en detalle_producto
    pg_cursor.execute("""
        INSERT INTO detalle_producto (producto_id, descripcion, nombre_calculado, activo, state_id)
        VALUES (%s, %s, %s, true, 1)
        RETURNING id
    """, (producto_id, descripcion, descripcion))
    detalle_producto_id = pg_cursor.fetchone()[0]

    # 3. Insertar inventario
    pg_cursor.execute("""
        INSERT INTO inventario (detalle_producto_id, stock_actual, stock_minimo, precio_costo, actualizado_en, state_id)
        VALUES (%s, %s, %s, %s, %s, 1)
        RETURNING id
    """, (detalle_producto_id, stock, stock_minimo, precio_costo, datetime.now()))
    inventario_id = pg_cursor.fetchone()[0]

    # 4. Insertar precio
    pg_cursor.execute("""
        INSERT INTO precio (detalle_producto_id, precio_venta, vigente, fecha_inicio, prioridad, descripcion)
        VALUES (%s, %s, true, %s, 1, %s)
        RETURNING id
    """, (detalle_producto_id, precio_venta, datetime.now(), "Precio base"))
    precio_id = pg_cursor.fetchone()[0]

    # 5. Insertar producto_ubicacion
    pg_cursor.execute("""
        INSERT INTO producto_ubicacion (
            detalle_producto_id,
            inventario_id,
            negocio_id,
            ubicacion_fisica_id,
            precio_id,
            compartir
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        detalle_producto_id,
        inventario_id,
        1,  # negocio_id por defecto
        1,  # ubicacion_fisica_id por defecto
        precio_id,
        True
    ))

    # 6. Insertar alias
    alias_insertados = set()
    for alias in [cod_producto, cod_barras]:
        if alias and alias not in alias_insertados:
            pg_cursor.execute("""
                INSERT INTO etiqueta_producto (detalle_producto_id, tipo, alias, visible, state_id)
                VALUES (%s, %s, %s, true, '1')
            """, (detalle_producto_id, "alias", alias))
            alias_insertados.add(alias)

# Guardar todo
pg_conn.commit()
sql_cursor.close()
pg_cursor.close()
sql_conn.close()
pg_conn.close()

print("✅ Migración finalizada correctamente.")

# Logos Data Strategy (LDS)
### "Restaurando la Identidad de la Palabra"

## Objective (Objetivo)
Restaurar la identidad de la Palabra desde su fuente **atómica** (la raíz más pequeña y pura) y **arqueológica** (basada en evidencia física y hechos), eliminando **sesgos** (preferencias o errores de traducción) para revelar el mensaje puro de Dios y Jesús. 

## Methodology (Metodología)
* **Fuentes Crudas:** Investigación de tablas de arcilla, manuscritos originales y el mercado de la época.
* **Análisis Atómico:** Descripción de cada línea de la pictografía (dibujos de las letras) y su función gramatical.
* **Verdad Absoluta:** Solo las palabras de Dios y Jesús se toman como parámetros de verdad.

* ## 🖥️ Infraestructura Técnica (LDS-Matrix)
Para ejecutar el análisis atómico sin sesgos, utilizamos una base de datos de grafos (**Neo4j**). Esto permite que cada átomo sea un nodo independiente y las palabras sean "vectores de fuerza".

### Átomos y Funciones (Génesis 1:1)
Actualmente, el sistema cuenta con **11 átomos funcionales** mapeados, incluyendo:
* **Aleph (א):** Potencia / Fuerza motriz.
* **Lamed (ל):** Dirección / Control de trayectoria.
* **He (ה):** Revelación / Aliento.
* **Tsadi (ץ):** Objetivo / Captura final.

## 🖥️ Operaciones de la Matrix (Guía Técnica)

Para recrear o modificar el sistema, utiliza estos comandos en la consola de Neo4j:

### 1. Crear un Átomo (Propiedades Pictográficas)
MERGE (n:Atomo {letra: 'א'})
ON CREATE SET 
  n.nombre = 'Aleph',
  n.funcion = 'Fuerza / Potencia',
  n.id_logos = '001'
RETURN n

### 2. Agregar relaciónes
MATCH (a:Atomo {letra: 'א'}), (l:Atomo {letra: 'ל'})
MERGE (a)-[:PASO {n: 1, palabra: 'Elohim'}]->(l)
RETURN a, l

### 2. Para ver todo el versículo conectado:
MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m

### 3. Mantenimineto y corrección
// Borrar SOLO las flechas si el cableado es incorrecto:
MATCH ()-[r]->() DELETE r

// Borrar un Átomo y sus conexiones:
MATCH (n:Atomo {letra: 'א'}) DETACH DELETE n

## 💾 Infraestructura de Datos Relacional (SQL Server)

Para la persistencia de datos masivos y el inventario maestro de definiciones, utilizamos **SQL Server 2022**. Esta base de datos actúa como la "Fuente de Verdad" que alimenta a la Matrix en Neo4j.

### 1. Configuración del Entorno
* **Base de Datos:** `CREATE DATABASE logos_data_strategy;`
* **Codificación:** Se utiliza `NVARCHAR` y el prefijo `N` para garantizar la integridad de los caracteres hebreos (Unicode).

### 2. Estructura de la Tabla Maestra
```sql
CREATE TABLE inventario_atomos (
    id_atomico INT PRIMARY KEY,
    letra_hebrea NVARCHAR(10) NOT NULL,
    nombre_oficial VARCHAR(50),
    funcion_fisica TEXT,
    contexto_arqueologico TEXT,
    fecha_registro DATETIME DEFAULT GETDATE()
);
```
### 3. Inyección de átomos
INSERT INTO inventario_atomos (id_atomico, letra_hebrea, nombre_oficial, funcion_fisica, contexto_arqueologico)
VALUES 
(1, N'ב', 'Bet', 'Contenedor / Espacio', 'Representación de una carpa; define el límite entre dentro y fuera.'),
(2, N'ר', 'Resh', 'Inicio / Cabeza', 'Perfil de cabeza humana; indica prioridad u origen.'),
(3, N'א', 'Aleph', 'Fuerza / Potencia', 'Cabeza de buey; representa la energía motriz o el líder.'),
(4, N'ש', 'Shin', 'Transformación / Presión', 'Dientes; capacidad de consumir o cambiar el estado de algo.'),
(5, N'י', 'Yod', 'Trabajo Manual / Mano', 'Brazo y mano; intervención directa y creación.'),
(6, N'ת', 'Tav', 'Sello / Destino / Marca', 'Dos palos cruzados; el punto final o la marca.'),
(7, N'ל', 'Lamed', 'Dirección / Control', 'Aguijón de pastor; control de la trayectoria de la fuerza.'),
(8, N'ה', 'He', 'Revelación / Aliento', 'Hombre con brazos alzados; apertura o asombro.'),
(9, N'ם', 'Mem', 'Flujo / Caos / Agua', 'Ondas de agua; movimiento fluido masivo.'),
(10, N'ו', 'Vav', 'Conector / Estaca', 'Clavo o estaca; función de unir dos elementos.'),
(11, N'ץ', 'Tsadi', 'Objetivo / Anzuelo', 'Anzuelo o persona de rodillas; la meta u objetivo.');

### 4. Consultas de validación
SELECT * FROM inventario_atomos ORDER BY id_atomico ASC;

### 🛠️ Entorno de Gestión: DBeaver
Para la administración unificada de bases de datos (SQL Server + Neo4j), se utiliza **DBeaver Community Edition**.

* **Conexión:** Configurada mediante el protocolo **TCP/IP** en el puerto `1433`.
* **Autenticación:** Integración con **Windows Authentication** y habilitación de `trustServerCertificate` para compatibilidad con SQL Server 2022.
* **Codificación de Interfaz:** Configurado en **UTF-8** para la correcta visualización del alfabeto hebreo pictográfico.


## Social Impact (Impacto Social)
Utilizaremos esta Verdad para intervenir en zonas de **muerte social** (lugares con alto índice de crimen y suicidio). 
* **Hipótesis:** Al reestructurar el **input cognitivo** (la información que procesa el cerebro) con el lenguaje edificador de la Biblia original, reduciremos la entropía (caos) y devolveremos la paz a la población.
* **Estrategia:** Ubicar a los más necesitados mediante estadísticas y elegir el canal (TikTok u otros) más efectivo para ellos.

---
*LDS: Cumpliendo el mandato de Jesús bajo Sus estándares de fidelidad.*

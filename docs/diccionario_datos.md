# Diccionario de Datos - Gestor de Rol (Hito 2)

Este documento especifica la estructura relacional de la base de datos del proyecto **Gestor de Rol**, detallando las tablas, tipos SQL, restricciones de integridad y reglas funcionales asociadas.


---


## Justificación del Cumplimiento de la Tercera Forma Normal (3FN)

El diseño relacional de la base de datos ha sido estructurado garantizando el cumplimiento estricto de las reglas formales de normalización (1FN, 2FN y 3FN):

### 1. Primera Forma Normal (1FN) - Atomicidad de Atributos
* **Atomicidad:** Todos los atributos de las entidades almacenan valores atómicos. No existen listas, arreglos ni objetos complejos metidos dentro de ninguna columna.
* **Sin tablas multivaluadas:** Las relaciones de tipo N:M, como los personajes que asisten a una sesión de juego o los PNJs involucrados en una partida, han sido desglosadas en entidades intermedias dedicadas (`ASISTENCIA_SESION` y `SESION_PNJ`), evitando campos multivaluados.

### 2. Segunda Forma Normal (2FN) - Dependencia Funcional Completa
* **Claves Simples:** En las entidades principales (`CAMPANA`, `PERSONAJE`, `SESION`, `PNJ`, `LOCALIZACION`, `OBJETO_TRAMA`, `SECRETO_MASTER`), la clave primaria es un único campo autoincremental (`id`), lo que garantiza que no existan dependencias parciales de la clave.
* **Claves Compuestas:** En las tablas intermedias M:N (`ASISTENCIA_SESION` y `SESION_PNJ`), la clave primaria está formada por los dos IDs. Los campos que acompañan (como el booleano `presente`) dependen de la combinación entera de ambos y no solo de uno por separado.

### 3. Tercera Forma Normal (3FN) - Ausencia de Dependencias Transitivas
* **Dependencia Directa de la PK:** Ningún atributo no clave depende de otro atributo no clave. Todas las columnas descriptivas de cada entidad (como `nombre` o `descripcion` en `LOCALIZACION`) aportan información exclusiva respecto al identificador primario de la fila (`id`).
* **Desacoplamiento de Entidades Relacionadas:** Atributos como el contexto de una campaña o la ubicación de un PNJ se gestionan a través de relaciones de clave foránea (`campana_id`, `localizacion_id`) con su propia tabla independiente, impidiendo la duplicidad y redundancia de datos.


---


## 1. Tabla: `CAMPANA`
Almacena la información global de las campañas o mesas de rol dirigidas en el sistema.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción funcional|
|:---|:---|:---|:---|:---|:---|:---|
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único de la campaña |
| `nombre` | `VARCHAR(100)` | NO | - | - | `UNIQUE` | Nombre identificativo de la campaña |
| `sistema_juego` | `VARCHAR(50)` | NO | - | - | - | Sistema de juego empleado en la campaña |
| `descripcion` | `TEXT` | SI | - | NULL | - | Sinopsis o ambientación general |
| `fecha_inicio`| `DATE`| NO | - | CURRENT_DATE | - | Fecha de inicio de la partida o campaña |
| `es_publico` | `BOOLEAN` | NO | - | FALSE | - | Indica si la campaña es visible publicamente |

---

## 2. Tabla: `PERSONAJE`
Registra las fichas de los personajes (PJs) que participan en las distintas campañas.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único del PJ |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña a la que está vinculado el PJ |
| `nombre_jugador` | `VARCHAR(80)` | NO | - | - | - | Nombre de la persona que interpreta al PJ |
| `nombre_pj` | `VARCHAR(80)` | NO | - | - | - | Nombre del PJ |
| `clase` | `VARCHAR(50)` | NO | - | - | - | Clase, arquetipo o profesión del PJ |
| `nivel` | `SMALLINT UNSIGNED` | NO | - | 1 | `CHECK (nivel >= 1)` | Nivel actual de progresión del PJ |

---

## 3. Tabla: `SESION`
Controla el calendario y el registro histórico de las sesiones jugadas dentro de una campaña.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único de la sesión |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña a la que pertenece la sesión |
| `numero_sesion` | `INT UNSIGNED` | NO | - | - | `CHECK (numero_sesion > 0)` | Número ordinal de la sesión en la campaña |
| `fecha` | `DATE` | NO | - | - | - | Fecha de la sesión |
| `resumen` | `TEXT` | YES | - | NULL | - | Resumen narrativo de los eventos |
| `eventos_principales`| `TEXT` | YES | - | NULL | - | Hitos clave o consecuencias de la sesión |

---

## 4. Tabla: `PNJ`
Catálogo de Personajes No Jugadores (PNJs) controlados por el Director de Juego, vinculados a lugares del mundo.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único del PNJ |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña en la que aparece el PNJ |
| `localizacion_id` | `INT UNSIGNED` | YES | FK | NULL | `References LOCALIZACION(id) ON DELETE SET NULL` | Ubicación principal, habitual o actual del PNJ |
| `nombre` | `VARCHAR(100)` | NO | - | - | - | Nombre del PNJ |
| `relacion_pjs` | `TEXT` | YES | - | NULL | - | Notas sobre su actitud o vínculos con los PJs |
| `descripcion` | `TEXT` | YES | - | NULL | - | Apariencia, secretos o rol argumental |

---

## 5. Tabla: `LOCALIZACION`
Lugares, ciudades, mazmorras o regiones que componen el mapa y el mundo de la campaña.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único de la localización |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña a la que pertenece el lugar |
| `nombre` | `VARCHAR(100)` | NO | - | - | - | Nombre del lugar o emplazamiento |
| `descripcion` | `TEXT` | YES | - | NULL | - | Descripción ambiental, peligros o habitantes |

---

## 6. Tabla: `OBJETO_TRAMA`
Ítems clave, artefactos mágicos o pistas argumentales importantes para el desarrollo de la historia.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único del objeto de trama |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña a la que pertenece el objeto |
| `nombre` | `VARCHAR(100)` | NO | - | - | - | Nombre del artefacto, objeto o pista |
| `descripcion` | `TEXT` | YES | - | NULL | - | Propiedades mecánicas, lore del objeto o significación de la pista |
| `propietario_actual` | `VARCHAR(100)`| YES | - | NULL | - | Referencia textual de quién lo posee actualmente |

---

## 7. Tabla: `SECRETO_MASTER`
Información confidencial, tramas ocultas o revelaciones reservadas exclusivamente para el Director de Juego.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único del secreto |
| `campana_id` | `INT UNSIGNED` | NO | FK | - | `References CAMPANA(id) ON DELETE CASCADE` | Campaña asociada al secreto |
| `titulo` | `VARCHAR(150)` | NO | - | - | - | Título descriptivo del secreto |
| `contenido_oculto` | `TEXT` | NO | - | - | - | Explicación detallada de la verdad oculta tras el secreto |
| `revelado` | `BOOLEAN` | NO | - | FALSE | - | Bandera para saber si los PJs ya lo han descubierto |

---

## 8. Tabla: `USUARIO`
Tabla de autenticación y control de acceso.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | NO | PK | Auto_increment | - | Identificador único del usuario |
| `email` | `VARCHAR(100)` | NO | - | - | `UNIQUE` | Correo electrónico de acceso |
| `password` | `VARCHAR(255)` | NO | - | - | - | Contraseña hasheada con bcrypt |
| `rol` | `VARCHAR(20)` | NO | - | `'user'` | `CHECK (rol IN ('admin', 'user'))` | Rol de autorización (admin/user) |

---

## 9. Tabla Intermedia M:N: `ASISTENCIA_SESION`
Resuelve la relación muchos a muchos entre personajes y sesiones, controlando la asistencia individual.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `personaje_id` | `INT UNSIGNED` | NO | PK, FK | - | `References PERSONAJE(id) ON DELETE CASCADE` | PJ evaluado en la sesión |
| `sesion_id` | `INT UNSIGNED` | NO | PK, FK | - | `References SESION(id) ON DELETE CASCADE` | Sesión de juego de la asistencia |
| `presente` | `BOOLEAN` | NO | - | TRUE | - | Indica si el PJ asistió a dicha sesión |

---

## 10. Tabla Intermedia M:N: `SESION_PNJ`
Resuelve la relación muchos a muchos entre las sesiones jugadas y los PNJs que intervinieron en ellas.

| Campo | Tipo SQL | Nulo | Clave | Defecto | Restricciones / Reglas | Descripción Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `sesion_id` | `INT UNSIGNED` | NO | PK, FK | - | `References SESION(id) ON DELETE CASCADE` | Sesión en la que se produjo la interacción |
| `pnj_id` | `INT UNSIGNED` | NO | PK, FK | - | `References PNJ(id) ON DELETE CASCADE` | PNJ que apareció o participó en la sesión |
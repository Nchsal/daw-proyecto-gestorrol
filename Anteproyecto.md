# GESTOR DE ROL
**Plataforma web colaborativa para la gestión integral de campañas y sesiones de rol.**

- **Módulo:** Proyecto Intermodular (0379 · PIDW2) — 2º DAW Virtual 
- **Centro:** CIFP Avilés (Curso 2026/2027)
- **Autor:** Ignacio Salván Meana
- **Repositorio Git:** [Gestor de Rol](https://github.com/Nchsal/daw-proyecto-gestorrol)
- **Tablero Kanban:** [Acceso al Tablero en GitHub Projects](https://github.com/users/Nchsal/projects/1)

---

## 1. Justificación y dominio funcional

### 1.1. Elevator pitch
En los juegos de rol, el uso de tableros genéricos como Trello o Notion y de hojas de cálculo fragmentan la información que se quiere guardar de las partidas y campañas, provocando una alta fricción organizativa para Directores de Juego y una desconexión en los jugadores.
Esta plataforma centraliza la gestión de campañas de rol en una interfaz web especializada, intuitiva y robusta. El software permite estructurar ambientaciones de juego mediante la interconexión cruzada de entidades, vinculando fichas de PNJs (Personajes No Jugadores), localizaciones, inventario de objetos o eventos directamente desde los diarios de sesión.
Su valor consiste en reducir drásticamente el tiempo de preparación de las partidas, automatizar el seguimiento de tramas y ofrecer a los jugadores un acceso ágil y persistente tanto al trasfondo como a la evolución de los personajes, mejorando la inmersión y la fluidez narrativa en la mesa de juego.

### 1.2. Público objetivo y contexto de uso
La plataforma está dirigida a dos perfiles principales:
- **Directores de juego (Masters):** Usuarios avanzados que diseñan, configuran y administran ambientaciones, tramas, PNJs, mapas y eventos.
- **Jugadores:** Participantes activos que lleven un control del trasfondo, gestionen la evolución del mundo alrededor de sus propios personajes y administren un registro de las sesiones jugadas.

Además, de manera natural, se extiende a otros perfiles como:
- **Comunidades y Grupos de Juego:** Mesas de rol habituales que busquen un espacio compartido de colaboración para sincronizar fichas, notas y diarios entre sesiones.
- **Editoriales y Creadores de Contenido:** Creadores y editoriales que busquen publicar, estructurar y promocionar sus campañas, módulos o aventuras dentro del catálogo público de la plataforma, conectando directamente con la comunidad de jugadores.

Está diseñado para utilizarse tanto de forma asíncrona, durante la fase de planificación, diseño de campañas y actualización de diarios entre partidas; como de forma síncrona, en tiempo real durante las propias sesiones de juego, como panel de consulta rápida.

---

## 2. Roles del sistema y casos de uso

| Caso de uso | Público / Invitado | Usuario Registrado | Administrador |
| :--- | :---: | :---: | :---: |
| **CU-01:** Registro e inicio de sesión seguro (JWT) | ✓ | ✓ | ✓ |
| **CU-02:** Administración técnica global y moderación | | | ✓ |
| **CU-03:** Creación de Cuadernos de Campaña personales | | ✓ | |
| **CU-04:** Creación y dirección de campañas colaborativas | | ✓ | |
| **CU-05:** Gestión y evolución de fichas de personaje | | ✓ | |
| **CU-06:** Registro en líneas temporales y diarios | | ✓ | |
| **CU-07:** Control de visibilidad y secretos de grupo | | ✓ | |
| **CU-08:** Referencias cruzadas e hipervinculación | | ✓ | |
| |  |  | |

### 2.1. Matriz de roles (RBAC)
- **Administrador:** Gestión global de la plataforma, control de usuarios registrados, moderación de contenidos y mantenimiento de los catálogos maestros del sistema.
- **Usuario registrado:** Creación y participación en campañas de rol, gestión completa de personajes, aportación de notas de sesión, consulta interctiva de mapas y cronología y publicación comunitaria de contenido.
- **Público / invitado:** Visualización de la página de presentación informativa de la plataforma, consulta del catálogo público de campañas abiertas o de muestra distribuidas por creadores y editoriales, y formulario de registtro o inicio de sesión.

> **Nota de Diseño:** El sistema emplea un modelo de roles contextuales. Todos los usuarios de la plataforma comparten el rol base de “Usuario Registrado”. La distinción entre ‘Director de Juego’ y ‘Jugador’ no recae sobre el perfil global de la cuenta, sino que se define de forma dinámica en la relación de membresía de cada Mesa de Campaña específica, permitiendo que un mismo usuario ejerza como Director en sus propias aventuras y como Jugador en las de otros.

### 2.2. Casos de uso principales
* **CU-01:** Registro e inicio de sesión seguro con tokens JWT y control de acceso basado en roles (RBAC) (Rol: Todos los usuarios registrados).
* **CU-02:** Administración técnica global de la plataforma, control de cuentas de usuarios y moderación del catálogo público de contenidos (Rol: Administrador).
* **CU-03:** Creación y configuración de los Cuadernos de Campaña modulares de uso personal, activando opcionalmente el registro de mapas, diarios, inventarios, líneas de tiempo o fichas de PNJs (Rol: Usuario Registrado).
* **CU-04:** Creación, gestión y dirección de campañas colaborativas (Mesas de Juego), manejando solicitudes y permisos de los jugadores asociados (Rol: Usuario Registrado ejercitando como Director de Juego).
* **CU-05:** Creación, edición y evolución de fichas de personaje vinculados tanto aos Cuadernos de Campaña personales como a las Mesas de Juego colaborativas (Rol: Usuario Registrado).
* **CU-06:** Registro de eventos en líneas temporales, diarios de sesiones y vinculación de localizaciones en mapas interactivos (Rol: Usuario Registrado).
* **CU-07:** Permite administrar la información compartida en la Mesa de Juego. Mecanismo de seguridad en servidor: El backend intercepta las peticiones sobre notas de sesión y recursos asociados, ejecutando una consulta filtrada que excluye automáticamente los registros con la bandera `es_secreto_master = true` cuando el token JWT del usuario pertenezca a un perfil con rol contextual de Jugador en esa mesa. Solo las peticiones autenticadas con el rol contextual de Director de Juego retornarán la entidad completa con los secretos incluidos. (Rol: Usuario Registrado ejercitando como Director de Juego).
* **CU-08:** Sistema de referencias cruzadas e hipervinculación dinámica, permitiendo enlazar PNJs, localizaciones y objetos directamente desde los textos de los diarios de sesión para su consulta rápida (Rol: Usuario Registrado).

---

## 3. Alcance del MVP
Antes de detallar el desglose de entidades y el flujo transaccional, es importante destacar que la arquitectura funcional de la plataforma se divide en dos ámbitos operativos complementarios:
* **Ámbito Personal (Cuadernos de Campaña):** Cada usuario registrado dispone de un espacio privado e independiente para gestionar de forma autónoma sus campañas, notas, diarios, mapas y fichas de personajes. Este uso individual permite utilizar la herramienta como un gestor personal de partidas sin necesidad de interactuar con terceros.
* **Ámbito colaborativo (Mesas de Campaña):** Representa la capa social y multijugador del sistema. Se articula mediante la creación de mesas por parte de un usuario registrado en el papel de Director de Juego, la gestión de solicitudes y la sincronización de información seleccionada desde los cuadernos personales de los participantes, aplicando un control de visibilidad diferencial en tiempo real.

A partir de este enfoque, el MVP delimita su alcance técnico al siguiente conjunto de elementos esenciales:

### 3.1. Modelo de datos
- **Diagrama Entidad-Relación en 3FN:** [docs/der.md](docs/der.md)
- **Relación 1:N:** `CAMPANA` (1) ───< (N) `SESION` (Una campaña almacena múltiples sesiones de juego ordenadas cronológicamente).
- **Relación M:N con atributos:** `PERSONAJE` y `SESION` vinculadas mediante la tabla intermedia `ASISTENCIA_SESION` (la cual incluye el atributo propio booleano `presente` para registrar la asistencia individual de cada personaje por sesión).

### 3.2. Entidades de negocio tentativas
* **CAMPANA:** Almacena la información general, el sistema de juego y la configuración principal de cada mesa o aventura.
* **PERSONAJE:** Recoge las fichas y datos de evolución de los personajes jugadores asociados a los Cuadernos de Campaña y Mesas de Juego.
* **SESION:** Registra los diarios, fecha y resúmenes de cada partida jugada de forma cronológica.
* **PNJ:** Almacena los personajes no jugadores diseñados por el Director de Juego y sus relaciones con el entorno.
* **LOCALIZACION:** Define los lugares, mapas y entornos geográficos que componen el mundo de la campaña.
* **OBJETO_TRAMA:** Guarda el inventario de objetos clave de la historia y su ubicación o propietario actual.
* **SECRETO_MASTER:** Gestiona la información oculta y notas reservadas exclusivamente para el Director de Juego en las Mesas de Juego.
* **ASISTENCIA_SESION:** Tabla intermedia que registra la participación de los personajes en cada sesión de juego y almacena los datos específicos de su asistencia.

### 3.3. Relación transaccional principal prevista
La operativa principal del sistema conecta el trabajo previo de preparación en los Cuadernos de Campaña (donde jugadores y Directores de Juego crean y organizan sus fichas, notas y diarios) con su uso en directo en la Mesa de juego. Durante cada partida (`SESION`), estas entidades se relacionan para registrar la asistencia de los personajes (`PERSONAJE`) mediante `ASISTENCIA_SESION`, mientras el Director de Juego va desvelando en tiempo real la información y los elementos preparados en su Cuaderno.

### 3.4. Incluido en el MVP
* **Sistema de autenticación con JWT y roles RBAC** para los perfiles Administrador, Director de Juego y Jugador.
* **CRUD completo** de campañas, personajes, inventario, diario de sesiones y cronología histórica de eventos.
* **Sistema de visibilidad** en las Mesas de Juego (secretos Director de Juego / vista Jugador).
* **Catálogo público** para la consulta e incorporación a la biblioteca personal de módulos comunitarios (mediante clonación interna de registros).

### 3.5. Fuera del MVP (reservado para la fase de add-ons y líneas futuras)
* Red Social de usuarios (lista de amigos, solicitudes y grupos de juego independientes de campañas).
* Importador/exportador automatizado de campañas mediante archivos externos de datos (ficheros JSON o paquetes comprimidos locales).
* Pasarela de pago con Stripe para venta de módulos oficiales.

---

## 4. Stack tecnológico previsto
- **Motor de base de datos:** MySQL - Justificación: Sólido soporte relacional, gran rendimiento en entornos de desarrollo Linux/Windows y total adecuación con las directices institucionales de normalización en 3FN.
- **Backend API:** Node.js con Express - Justificación: Desarrollo ágil de API REST asíncrona, amplio ecosistema de librerías para autenticación JWT y estructura modular.
- **Frontend:** React - Justificación: Arquitectura basada en componentes reactivos ideal para construir paneles de control dinámicos, fluidos e interactivos para el seguimiento de las campañas.
- **Alojamiento cloud previsto:** Render - Justificación: Plataforma PaaS con despliegue continuo automatizado desde repositorios de GitHub muy sencilla de integrar en entregas académicas.

---

## 5. Selección tentativa de Add-ons (mínimo 2)
- [x] **Dockerización multicontenedor con Docker Compose (+1.0)**
- [ ] Pipeline CI/CD automatizado con GitHub Actions (+1.0)
- [ ] Almacenamiento desacoplado en AWS S3 / Cloudinary (+0.5)
- [x] **Pasarela de pagos Stripe en entorno Sandbox con Webhooks (+1.0)**
- [ ] Generación de informes en PDF/Excel en backend (+0.5)
- [ ] WebSockets / Comunicación en tiempo real (+1.0)
- [ ] Batería de pruebas automatizadas (>40 % de endpoints) (+1.0)
- [x] **Documentación OpenAPI / Swagger interactiva (+0.5)**
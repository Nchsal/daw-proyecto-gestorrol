# Anteproyecto: [Nombre del Proyecto]

**Módulo:** Proyecto Intermodular (0379 · PIDW2) — 2º DAW Virtual 

**Centro:** CIFP Avilés (Curso 2026/2027)

**Autor/a:** Ignacio Salván Meana

**Repositorio GitHub:** [\[\Nchsal\daw-proyecto-gestorrol\]](https://github.com/Nchsal/daw-proyecto-gestorrol)

**Tablero GitHub Projects:** [URL del tablero Kanban]


---
## 1. Justificación y dominio funcional

### 1.1. Elevator pitch (100–150 palabras)
En los juegos de rol, el uso de tableros genéricos como Trello o Notion y de hojas de cálculo fragmentan la información que se quiere guardar de las partidas y campañas, provocando una alta fricción organizativa para Directores de Juego y una desconexión en los jugadores.
Esta plataforma centraliza la gestión de campañas de rol en una interfaz web especializada, intuitiva y robusta. El software permite estructurar ambientaciones de juego mediante la interconexión cruzada de entidades, vinculando fichas de PNJs (Personajes No Jugadores), localizaciones, inventario de objetos o eventos directamente desde los diarios de sesión.
Su valor consiste en reducir drásticamente el tiempo de preparación de las partidas, automatizar el seguimiento de tramas y ofrecer a los jugadores un acceso ágil y persistente tanto al trasfondo como a la evolución de los personajes, mejorando la inmersión y la fluidez narrativa en la mesa de juego.

### 1.2. Público objetivo y contexto de uso
La plataforma está dirigida a dos perfiles principales:
- **Directores de juego (Masters):** Usuarios avanzados que diseñan, configuran y administran ambientaciones, tramas, PNJs, mapas y eventos.
- **Jugadores:** Participantes activos que lleven un control del trasfondo, gestionen la evolución del mundo alrededor de sus propios personajes y administren un registro de las sesiones jugadas.
- **Comunidades y Grupos de Juego:** Mesas de rol habituales que busquen un espacion compartido de colaboración para sincronizar fichas, notas y diarios entre sesiones.
- **Editoriales y Creadores de Contenido:** Creadores y editoriales que busquen publicar, estructurar y promocionar sus campañas, módulos o aventuras dentro del catálogo público de la plataforma, conectando directamente con la comunidad de jugadores.

Se utiliza tanto de forma asíncrona (durante la fase de planificación, diseño de campañas y actualización de diarios entre partidas) como de forma síncrona, en tiempo real durante las propias sesiones de juego, como panel de consulta rápida.

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
- **Público / invitado:** Visualización de la página de presentación informativa de la plataforma, consulta del catálogo público de camapñas abiertas o de muestra distribuidas por creadores y editoriales, y formulario de registtro o inicio de sesión.

### 2.2. Casos de uso principales (mínimo 6)

1. **CU-01:** Registro e inicio de sesión seguro con tokens JWT y control de acceso basado en roles (RBAC).
2. **CU-02:** Administración técnica global de la plataforma, control de cuentas de usuarios y moderación del catálogo público de contenidos (Rol: Administrador).
3. **CU-03:** Creación y configuración de Cuadernos de Campaña (o Bitácoras) modulares de uso personal o individual, activando opcionalmente el registro de mapas, diarios, inventarios, lineas de tiempo o fichas de PNJs (Rol: Usuario Registrado).
4. **CU-04:** Creación, gestión y dirección de campañas colaborativas (mesas de juego), gestionando solicitudes y permisos de los jugadores asociados (Rol: Usuario registrado / Director de Juego).
5. **CU-05:** Creación, edición y evolución de fichas de personaje vinculados tanto a los Cuadernos de Campaña personales como a campañas grupales (Rol: Usuario Registrado / Jugador).
6. **CU-06:** Registro de eventos en líneas temporales, diarios de sesiones y vinculación de localizaciones en mapas interactivos (Rol: Usuario registrado)
7. **CU-07:** Gestión de Cuadernos de Campaña comunitarios o de grupo y control granular de visibilidad y privacidad de la información, permitiendo al Director de Juego compartir información de la sesión y manternerla oculta hasta el momento deseado frente a la vista pública de los jugadores (Rol: Usuario Registrado / Director de Juego).
8. **CU-08:** Sistema de referencias cruzadas e hipervinculaciñon dinámica, permitiendo enlazar PNJs, localizaciones u objetos directamente desde los textos de los diarios de sesión para consulta rápida (Rol: Usuario Registrado)

### 2.3. Alcance del MVP (Hito 3, diciembre)
- **Incluido:** sistema de autenticación con JWT y roles RBAC, CRUD completo de campañas y personajes, diario de sesiones, cronolodía histórica de eventos, sistema de visibilidad (secretos Director / vista Jugador) y catálogo público para la consulta e importación gratutita de módulos comunitarios.
- **Fuera del MVP:** Red social de usuarios (lista de amigos, solicitudes y grupos de juego independientes de campañas), importador/exportador automatizado de campañas mediante archivos de datos (`JSON`o paquetes comprimidos) y pasarela de pago para la venta de módulos oficiales (reservados par ala fase de Add-ons y líneas futuras).

---
## 3. Modelo de datos
- **Diagrama Entidad-Relación en 3FN:** 
- **Relación 1:N:** 
- **Relación M:N con atributos:** 

---
## 4. Stack tecnológico previsto
- **Motor de base de datos:** [MariaDB / MySQL] - Jutificación: Sólido soporte relacional, gran rendimiento en entornos de desarrollo Linux/Windows y total adecuación con las directices institucionales de normalización en 3FN.
- **Backend API:** [Node.js con Express] - Justificación: Desarrollo ágil de API REST asíncrona, amplio ecosistema de librerías para autenticación JWT y estructura modular.
- **Frontend:** [React / Vue.js] - Justificación: Arquitectura basada en componentes reactivos ideal para construir paneles de control dinámicos, fluidos e interactivos para el seguimiento de las campañas.
- **Alojamiento cloud previsto:** [Render / Railway] - Justificación: Plataforma PaaS condespliegue continuo automatizado desde repositorios de GitHub muy sencilla de integrar en entregas académicas.

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
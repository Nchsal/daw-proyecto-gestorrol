# daw-proyecto-gestorrol

Plataforma web especializada en la gestión centralizada de campañas de rol, diseñada para optimizar el trabajo de los Directores de Juego y mejorar la inmersión y organización de los jugadores.

## 📋 Información del Proyecto
- **Módulo:** Proyecto Intermodular (0379 · PIDW2) — 2º DAW Virtual
- **Centro:** CIFP Avilés (Curso 2026/2027)
- **Autor/a:** Ignacio Salván Meana
- **Tablero Kanban:** [Acceso al Tablero en GitHub Projects](https://github.com/users/Nchsal/projects/1)

---

## 🚀 Stack Tecnológico 
- **Base de Datos:** MySQL (Normalizada en 3FN)
- **Backend:** Node.js con Express (API REST asíncrona con autenticación JWT)
- **Frontend:** React (Interfaces modulares e interactivas)
- **Despliegue / Cloud:** Render 

---

## 🛠️ Puesta en Marcha y Regeneración de la Base de Datos

Para reconstruir la persistencia y la base de datos desde cero aplicando las migraciones de Prisma y los seeders robustos (incluyendo usuarios demo y datos masivos):

```bash
cd backend
npm run db:reset
```

---

## 📂 Documentación del Hito 1
- **Anteproyecto Funcional:** Consulta el documento completo en [Anteproyecto.md](Anteproyecto.md).

## 📂 Documentación del Hito 2
- **Modelo de Datos (DER):** Diagrama técnico disponible en [docs/der.md](docs/der.md).
- **Diccionario de Datos y 3FN:** Especificación relacional detallada y justificación de normalización en [docs/diccionario_datos.md](docs/diccionario_datos.md).
- **Colección de Pruebas API (Thunder Client):** Exportación de peticiones y aserciones en [docs/api/gestor-rol-api.json](docs/api/gestor-rol-api.json).
- **Entorno Local de Thunder Client:** Variables de entorno configuradas en [docs/api/env-gestor-rol-local.json](docs/api/env-gestor-rol-local.json).

### Pruebas de API en local
1. Asegúrate de tener MySQL activo y el backend arrancado (`cd backend && npm run dev`).
2. En Thunder Client, selecciona el entorno **GestorRol - Local** (o importa [docs/api/env-gestor-rol-local.json](docs/api/env-gestor-rol-local.json) y [docs/api/gestor-rol-api.json](docs/api/gestor-rol-api.json)) y ejecuta primero el login para guardar los tokens en las variables del entorno.

---

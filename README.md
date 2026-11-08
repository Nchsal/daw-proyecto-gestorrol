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

---

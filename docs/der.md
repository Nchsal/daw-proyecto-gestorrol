# Diagrama Entidad-Relación (DER)

```mermaid
erDiagram
    CAMPANA ||--o{ PERSONAJE : "contiene"
    CAMPANA ||--o{ LOCALIZACION : "incluye"
    CAMPANA ||--o{ SESION : "registra"
    CAMPANA ||--o{ PNJ : "pobla"
    CAMPANA ||--o{ OBJETO_TRAMA : "posee"
    CAMPANA ||--o{ SECRETO_MASTER : "oculta"
    
    SESION ||--o{ ASISTENCIA_PJ : "participa"
    PERSONAJE ||--o{ ASISTENCIA_PJ : "asiste"
    
    LOCALIZACION ||--o{ PNJ : "ubica"
    SESION ||--o{ SESION_PNJ : "involucra"
    PNJ ||--o{ SESION_PNJ : "aparece"

    CAMPANA {
        int id PK
        string nombre
        string sistema_juego
        text descripcion
        date fecha_inicio
        boolean es_publico
    }

    PERSONAJE {
        int id PK
        int campana_id FK
        string nombre_jugador
        string nombre_pj
        string clase
        int nivel
    }

    SESION {
        int id PK
        int campana_id FK
        int numero_sesion
        date fecha
        text resumen
        text eventos_principales
    }

    PNJ {
        int id PK
        int campana_id FK
        int localizacion_id FK
        string nombre
        text relacion_pjs
        text descripcion
    }

    LOCALIZACION {
        int id PK
        int campana_id FK
        string nombre
        text descripcion
    }

    OBJETO_TRAMA {
        int id PK
        int campana_id FK
        string nombre
        text descripcion
        string propietario_actual
    }

    SECRETO_MASTER {
        int id PK
        int campana_id FK
        string titulo
        text contenido_oculto
        boolean revelado
    }

    ASISTENCIA_SESION {
        int personaje_id PK, FK
        int sesion_id PK, FK
        boolean presente
    }

    SESION_PNJ {
        int sesion_id PK, FK
        int pnj_id PK, FK
    }```
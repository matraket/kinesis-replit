# API

Backend único del monolito, diseñado para ser extraíble a microservicio. Sigue arquitectura hexagonal/DDD con capas: domain (entidades, VOs, agregados), application (casos de uso), infrastructure (repos DB, APIs externas) e interfaces (HTTP, jobs, subscribers). NO debe ser llamado directamente por otros módulos; toda comunicación es vía HTTP o eventos.

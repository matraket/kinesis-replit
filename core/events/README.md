# Core / Events

Definiciones de eventos de dominio que cruzan módulos (ej: `LeadCreated`, `UserRegistered`). Estos eventos se publican a través del bus y permiten desacoplar módulos. NO debe contener la implementación del bus (va en `core/bus`).

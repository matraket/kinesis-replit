# API / Application

Casos de uso y servicios de aplicación que orquestan el dominio. Define puertos (interfaces) para repositorios y servicios externos. Publica eventos en el bus de `core`. Paradigma funcional/imperativo ligero. NO debe contener lógica de UI, acceso directo a DB o implementaciones de infraestructura.

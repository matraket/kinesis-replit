# CMS

Frontend de backoffice/administración de Kinesis (React + Vite + Tailwind). Sigue arquitectura por capas (domain, application, infrastructure, presentation). Se comunica con el backend exclusivamente vía HTTP hacia `/api`. NO debe compartir código directamente con `web` (usar `shared` si es necesario).

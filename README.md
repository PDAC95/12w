# Wallai - Financial Management System

Sistema de gestión financiera compartida.

## Stack Tecnológico

- **Backend:** FastAPI 0.115+
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Python:** 3.13+

## Setup Rápido

### Prerequisitos
- Python 3.11+
- Docker Desktop
- Git

### Instalación

1. Clonar repositorio:
```bash
git clone https://github.com/PDAC95/12w
cd 12w
```

2. Levantar Docker containers:
```bash
docker-compose up -d
```

3. Setup virtual environment:
```bash
cd apps/api
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

5. Configurar variables de entorno:
```bash
cp .env.example .env
```

6. Arrancar aplicación:
```bash
uvicorn src.main:app --reload
```

## URLs Importantes

- API Root: http://localhost:8000/
- Health Check: http://localhost:8000/health
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
pytest
pytest --cov=src
```

## Estructura del Proyecto

```
12w/
├── apps/api/
│   ├── src/
│   │   ├── core/       # Configuración
│   │   ├── api/        # Endpoints
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── services/   # Business logic
│   ├── tests/
│   └── requirements.txt
└── docker-compose.yml
```

## Notas

- Usuario de desarrollo: dev@jappi.ca / Password123

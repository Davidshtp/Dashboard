from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth, users, categories, items

# Crear la aplicación FastAPI
app = FastAPI(
    title="Dashboard API",
    description="""
    API REST completa para sistema de Dashboard empresarial
    
    Funcionalidades principales
    
    Autenticación JWT**: Sistema completo de login, registro y recuperación de contraseña
    Gestión de Usuarios**: CRUD completo con perfiles, roles y permisos
    Categorías**: Organización y clasificación de productos/servicios
    Inventario**: Control de stock, precios, productos y movimientos
    
    Desarrollado para facilitar la gestión integral de tu negocio
    """,
    version="1.0.0",
)

# Configurar CORS para permitir conexiones desde el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(items.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Dashboard API - FastAPI",
        "version": "1.0.0",
        "status": "active",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc"
        },
        "endpoints": {
            "auth": "/auth",
            "users": "/users", 
            "categories": "/categories",
            "items": "/items"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "message": "API funcionando correctamente"
    }

# Manejador de errores global
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "message": "Recurso no encontrado",
            "status": "error",
            "path": str(request.url)
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "Error interno del servidor",
            "status": "error"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
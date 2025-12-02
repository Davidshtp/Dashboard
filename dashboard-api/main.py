from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, categories, items, profile

# Crear la aplicación FastAPI
app = FastAPI(
    title="Dashboard API",
    description="API REST para sistema de Dashboard empresarial con autenticación JWT, gestión de categorías e inventario",
    version="1.0.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(categories.router)
app.include_router(items.router)

@app.get("/")
async def root():
    return {
        "message": "Dashboard API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
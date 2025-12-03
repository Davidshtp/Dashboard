from fastapi import APIRouter, status
from typing import List
from models.category import CategoryCreate, CategoryUpdate, CategoryResponse
from models.user import StandardResponse
from storage.firebase_storage import storage
from utils.helpers import validate_resource_exists

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[CategoryResponse])
async def get_all_categories():
    """Obtener todas las categorías"""
    categories = storage.get_all_categories()
    return [CategoryResponse(id=cat.id, name=cat.name) for cat in categories]

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    """Obtener una categoría específica por ID"""
    category = storage.get_category_by_id(category_id)
    validate_resource_exists(category, "Categoría")
    return CategoryResponse(id=category.id, name=category.name)

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category_data: CategoryCreate):
    """Crear una nueva categoría"""
    category = storage.create_category(category_data.dict())
    return CategoryResponse(id=category.id, name=category.name)

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, update_data: CategoryUpdate):
    """Actualizar una categoría existente"""
    category = storage.get_category_by_id(category_id)
    validate_resource_exists(category, "Categoría")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if not update_dict:
        return CategoryResponse(id=category.id, name=category.name)
    
    updated_category = storage.update_category(category_id, update_dict)
    return CategoryResponse(id=updated_category.id, name=updated_category.name)

@router.delete("/{category_id}", response_model=StandardResponse)
async def delete_category(category_id: str):
    """Eliminar una categoría"""
    category = storage.get_category_by_id(category_id)
    validate_resource_exists(category, "Categoría")
    
    storage.delete_category(category_id)
    return StandardResponse(
        message="Categoría eliminada exitosamente",
        status="success"
    )
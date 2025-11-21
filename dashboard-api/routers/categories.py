from fastapi import APIRouter, HTTPException, status
from typing import List
from models.category import CategoryCreate, CategoryUpdate, CategoryResponse
from models.user import StandardResponse
from storage.memory_storage import storage

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[CategoryResponse])
async def get_all_categories():
    """
    Obtener todas las categorías
    
    Retorna una lista de todas las categorías disponibles en el sistema.
    """
    categories = storage.get_all_categories()
    return [CategoryResponse(id=cat.id, name=cat.name) for cat in categories]

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    """
    Obtener una categoría específica por ID
    
    - **category_id**: ID único de la categoría
    """
    category = storage.get_category_by_id(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
    return CategoryResponse(id=category.id, name=category.name)

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(category_data: CategoryCreate):
    """
    Crear una nueva categoría
    
    - **name**: Nombre de la categoría (1-100 caracteres)
    """
    try:
        category = storage.create_category(category_data.dict())
        return CategoryResponse(id=category.id, name=category.name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, update_data: CategoryUpdate):
    """
    Actualizar una categoría existente
    
    - **category_id**: ID único de la categoría
    - **name**: Nuevo nombre de la categoría (opcional)
    """
    category = storage.get_category_by_id(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
    # Filtrar campos no nulos
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if update_dict:
        updated_category = storage.update_category(category_id, update_dict)
        return CategoryResponse(id=updated_category.id, name=updated_category.name)
    else:
        return CategoryResponse(id=category.id, name=category.name)

@router.delete("/{category_id}", response_model=StandardResponse)
async def delete_category(category_id: str):
    """
    Eliminar una categoría
    
    - **category_id**: ID único de la categoría
    
    Nota: No se puede eliminar una categoría que tiene productos asociados.
    """
    category = storage.get_category_by_id(category_id)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
    try:
        success = storage.delete_category(category_id)
        
        if success:
            return StandardResponse(
                message="Categoría eliminada exitosamente",
                status="success"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar la categoría"
            )
            
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
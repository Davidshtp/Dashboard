from fastapi import HTTPException, status
from models.item import ItemWithCategory
from models.category import CategoryResponse
from storage.firebase_storage import storage

def get_item_with_category(item) -> ItemWithCategory:
    """Obtiene un item con información de su categoría"""
    category = storage.get_category_by_id(item.categoryId)
    category_name = category.name if category else "Categoría no encontrada"
    
    return ItemWithCategory(
        id=item.id,
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        price=item.price,
        categoryId=item.categoryId,
        categoryName=category_name
    )


def validate_category_exists(category_id: str):
    """Valida que una categoría existe, lanza excepción si no"""
    if not storage.category_exists(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La categoría especificada no existe"
        )


def validate_resource_exists(resource, resource_type: str):
    """Valida que un recurso existe, lanza excepción si no"""
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource_type} no encontrado"
        )

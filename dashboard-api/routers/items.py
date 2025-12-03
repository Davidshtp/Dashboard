from fastapi import APIRouter, HTTPException, status
from typing import List
from models.item import ItemCreate, ItemUpdate, ItemResponse, ItemWithCategory
from models.user import StandardResponse
from storage.firebase_storage import storage
from utils.helpers import get_item_with_category, validate_category_exists, validate_resource_exists

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/", response_model=List[ItemWithCategory])
async def get_all_items():
    """Obtener todos los productos del inventario"""
    items = storage.get_all_items()
    return [get_item_with_category(item) for item in items]

@router.get("/{item_id}", response_model=ItemWithCategory)
async def get_item(item_id: str):
    """Obtener un producto específico por ID"""
    item = storage.get_item_by_id(item_id)
    validate_resource_exists(item, "Producto")
    return get_item_with_category(item)

@router.get("/by-category/{category_id}", response_model=List[ItemResponse])
async def get_items_by_category(category_id: str):
    """Obtener productos por categoría"""
    validate_category_exists(category_id)
    items = storage.get_items_by_category(category_id)
    return [ItemResponse(
        id=item.id,
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        price=item.price,
        categoryId=item.categoryId
    ) for item in items]

@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item_data: ItemCreate):
    """Crear un nuevo producto"""
    validate_category_exists(item_data.categoryId)
    item = storage.create_item(item_data.dict())
    return ItemResponse(
        id=item.id,
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        price=item.price,
        categoryId=item.categoryId
    )

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: str, update_data: ItemUpdate):
    """Actualizar un producto existente"""
    item = storage.get_item_by_id(item_id)
    validate_resource_exists(item, "Producto")
    
    if update_data.categoryId:
        validate_category_exists(update_data.categoryId)
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if not update_dict:
        return ItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            quantity=item.quantity,
            price=item.price,
            categoryId=item.categoryId
        )
    
    updated_item = storage.update_item(item_id, update_dict)
    return ItemResponse(
        id=updated_item.id,
        name=updated_item.name,
        description=updated_item.description,
        quantity=updated_item.quantity,
        price=updated_item.price,
        categoryId=updated_item.categoryId
    )

@router.delete("/{item_id}", response_model=StandardResponse)
async def delete_item(item_id: str):
    """Eliminar un producto"""
    item = storage.get_item_by_id(item_id)
    validate_resource_exists(item, "Producto")
    
    storage.delete_item(item_id)
    return StandardResponse(
        message="Producto eliminado exitosamente",
        status="success"
    )
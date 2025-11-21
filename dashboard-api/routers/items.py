from fastapi import APIRouter, HTTPException, status
from typing import List
from models.item import ItemCreate, ItemUpdate, ItemResponse, ItemWithCategory
from models.user import StandardResponse
from storage.memory_storage import storage

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/", response_model=List[ItemWithCategory])
async def get_all_items():
    """
    Obtener todos los productos del inventario
    
    Retorna una lista de todos los productos con información de categoría incluida.
    """
    items = storage.get_all_items()
    result = []
    
    for item in items:
        category = storage.get_category_by_id(item.categoryId)
        category_name = category.name if category else "Categoría no encontrada"
        
        result.append(ItemWithCategory(
            id=item.id,
            name=item.name,
            description=item.description,
            quantity=item.quantity,
            price=item.price,
            categoryId=item.categoryId,
            categoryName=category_name
        ))
    
    return result

@router.get("/{item_id}", response_model=ItemWithCategory)
async def get_item(item_id: str):
    """
    Obtener un producto específico por ID
    
    - **item_id**: ID único del producto
    """
    item = storage.get_item_by_id(item_id)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
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

@router.get("/by-category/{category_id}", response_model=List[ItemResponse])
async def get_items_by_category(category_id: str):
    """
    Obtener productos por categoría
    
    - **category_id**: ID único de la categoría
    """
    # Verificar que la categoría existe
    category = storage.get_category_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
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
    """
    Crear un nuevo producto
    
    - **name**: Nombre del producto (1-100 caracteres)
    - **description**: Descripción del producto (opcional, máx. 500 caracteres)
    - **quantity**: Cantidad en inventario (debe ser >= 0)
    - **price**: Precio del producto (debe ser > 0)
    - **categoryId**: ID de la categoría a la que pertenece
    """
    # Verificar que la categoría existe
    if not storage.category_exists(item_data.categoryId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La categoría especificada no existe"
        )
    
    try:
        item = storage.create_item(item_data.dict())
        return ItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            quantity=item.quantity,
            price=item.price,
            categoryId=item.categoryId
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: str, update_data: ItemUpdate):
    """
    Actualizar un producto existente
    
    - **item_id**: ID único del producto
    - **name**: Nuevo nombre del producto (opcional)
    - **description**: Nueva descripción del producto (opcional)
    - **quantity**: Nueva cantidad en inventario (opcional)
    - **price**: Nuevo precio del producto (opcional)
    - **categoryId**: Nuevo ID de categoría (opcional)
    """
    item = storage.get_item_by_id(item_id)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Verificar que la nueva categoría existe (si se proporciona)
    if update_data.categoryId and not storage.category_exists(update_data.categoryId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La categoría especificada no existe"
        )
    
    # Filtrar campos no nulos
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if update_dict:
        updated_item = storage.update_item(item_id, update_dict)
        return ItemResponse(
            id=updated_item.id,
            name=updated_item.name,
            description=updated_item.description,
            quantity=updated_item.quantity,
            price=updated_item.price,
            categoryId=updated_item.categoryId
        )
    else:
        return ItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            quantity=item.quantity,
            price=item.price,
            categoryId=item.categoryId
        )

@router.delete("/{item_id}", response_model=StandardResponse)
async def delete_item(item_id: str):
    """
    Eliminar un producto
    
    - **item_id**: ID único del producto
    """
    item = storage.get_item_by_id(item_id)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    success = storage.delete_item(item_id)
    
    if success:
        return StandardResponse(
            message="Producto eliminado exitosamente",
            status="success"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el producto"
        )
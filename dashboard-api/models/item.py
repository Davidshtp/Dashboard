from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nombre del producto")
    description: str = Field(default="", max_length=500, description="Descripción del producto")
    quantity: int = Field(..., ge=0, description="Cantidad en inventario (debe ser >= 0)")
    price: float = Field(..., gt=0, description="Precio del producto (debe ser > 0)")
    categoryId: str = Field(..., description="ID de la categoría a la que pertenece")

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    quantity: Optional[int] = Field(None, ge=0)
    price: Optional[float] = Field(None, gt=0)
    categoryId: Optional[str] = None

class ItemResponse(ItemBase):
    id: str = Field(..., description="ID único del producto")
    
    class Config:
        from_attributes = True

class Item(ItemResponse):
    pass

# Modelo con información de categoría incluida
class ItemWithCategory(ItemResponse):
    categoryName: str = Field(..., description="Nombre de la categoría")
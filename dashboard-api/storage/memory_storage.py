from typing import Dict, List, Optional
from models.user import User
from models.category import Category  
from models.item import Item
import uuid
import random
import string

class MemoryStorage:
    def __init__(self):
        # Almacenamiento en memoria usando diccionarios
        self.users: Dict[str, User] = {}
        self.categories: Dict[str, Category] = {}
        self.items: Dict[str, Item] = {}
        
        # Índices para búsquedas rápidas
        self.user_email_index: Dict[str, str] = {}  # email -> user_id
        
    def generate_id(self) -> str:
        """Genera un ID único"""
        return str(uuid.uuid4())
    
    def generate_reset_code(self) -> str:
        """Genera un código de 6 dígitos para reset de contraseña"""
        return ''.join(random.choices(string.digits, k=6))
    
    # =================== USER OPERATIONS ===================
    
    def create_user(self, user_data: dict) -> User:
        """Crea un nuevo usuario"""
        user_id = self.generate_id()
        user = User(
            id=user_id,
            name=user_data["name"],
            lastName=user_data["lastName"],
            email=user_data["email"],
            password=user_data["password"],  # En producción debería estar hasheada
            resetCode=None
        )
        
        self.users[user_id] = user
        self.user_email_index[user.email] = user_id
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Obtiene un usuario por ID"""
        return self.users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Obtiene un usuario por email"""
        user_id = self.user_email_index.get(email)
        if user_id:
            return self.users.get(user_id)
        return None
    
    def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Actualiza un usuario"""
        if user_id not in self.users:
            return None
        
        user = self.users[user_id]
        
        # Si se está actualizando el email, verificar que no exista
        if "email" in update_data and update_data["email"] != user.email:
            if update_data["email"] in self.user_email_index:
                raise ValueError("Email ya existe")
            
            # Actualizar índice de email
            del self.user_email_index[user.email]
            self.user_email_index[update_data["email"]] = user_id
        
        # Actualizar campos
        for field, value in update_data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        
        return user
    
    def set_reset_code(self, email: str) -> Optional[str]:
        """Establece un código de reset para un usuario"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        reset_code = self.generate_reset_code()
        user.resetCode = reset_code
        return reset_code
    
    def verify_reset_code(self, email: str, code: str) -> bool:
        """Verifica un código de reset"""
        user = self.get_user_by_email(email)
        if not user or not user.resetCode:
            return False
        return user.resetCode == code
    
    def reset_password(self, email: str, new_password: str) -> bool:
        """Resetea la contraseña de un usuario"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        
        user.password = new_password
        user.resetCode = None
        return True
    
    # =================== CATEGORY OPERATIONS ===================
    
    def create_category(self, category_data: dict) -> Category:
        """Crea una nueva categoría"""
        category_id = self.generate_id()
        category = Category(
            id=category_id,
            name=category_data["name"]
        )
        
        self.categories[category_id] = category
        return category
    
    def get_category_by_id(self, category_id: str) -> Optional[Category]:
        """Obtiene una categoría por ID"""
        return self.categories.get(category_id)
    
    def get_all_categories(self) -> List[Category]:
        """Obtiene todas las categorías"""
        return list(self.categories.values())
    
    def update_category(self, category_id: str, update_data: dict) -> Optional[Category]:
        """Actualiza una categoría"""
        if category_id not in self.categories:
            return None
        
        category = self.categories[category_id]
        
        for field, value in update_data.items():
            if hasattr(category, field):
                setattr(category, field, value)
        
        return category
    
    def delete_category(self, category_id: str) -> bool:
        """Elimina una categoría"""
        if category_id not in self.categories:
            return False
        
        # Verificar si hay items que usan esta categoría
        items_with_category = [item for item in self.items.values() 
                              if item.categoryId == category_id]
        
        if items_with_category:
            raise ValueError("No se puede eliminar la categoría porque tiene productos asociados")
        
        del self.categories[category_id]
        return True
    
    # =================== ITEM OPERATIONS ===================
    
    def create_item(self, item_data: dict) -> Item:
        """Crea un nuevo item"""
        item_id = self.generate_id()
        item = Item(
            id=item_id,
            name=item_data["name"],
            description=item_data.get("description", ""),
            quantity=item_data["quantity"],
            price=item_data["price"],
            categoryId=item_data["categoryId"]
        )
        
        self.items[item_id] = item
        return item
    
    def get_item_by_id(self, item_id: str) -> Optional[Item]:
        """Obtiene un item por ID"""
        return self.items.get(item_id)
    
    def get_all_items(self) -> List[Item]:
        """Obtiene todos los items"""
        return list(self.items.values())
    
    def get_items_by_category(self, category_id: str) -> List[Item]:
        """Obtiene items por categoría"""
        return [item for item in self.items.values() 
                if item.categoryId == category_id]
    
    def update_item(self, item_id: str, update_data: dict) -> Optional[Item]:
        """Actualiza un item"""
        if item_id not in self.items:
            return None
        
        item = self.items[item_id]
        
        for field, value in update_data.items():
            if hasattr(item, field) and value is not None:
                setattr(item, field, value)
        
        return item
    
    def delete_item(self, item_id: str) -> bool:
        """Elimina un item"""
        if item_id not in self.items:
            return False
        
        del self.items[item_id]
        return True
    
    def category_exists(self, category_id: str) -> bool:
        """Verifica si existe una categoría"""
        return category_id in self.categories

# Instancia global del almacenamiento
storage = MemoryStorage()

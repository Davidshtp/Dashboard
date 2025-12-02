from typing import Dict, List, Optional
from models.user import User
from models.category import Category  
from models.item import Item
from config.firebase_config import db
import uuid
import random
import string
from datetime import datetime

class FirebaseStorage:
    def __init__(self):
        # Referencias a colecciones en Firestore
        self.users_ref = db.collection("users")
        self.categories_ref = db.collection("categories")
        self.items_ref = db.collection("items")
        
    def generate_id(self) -> str:
        """Genera un ID único"""
        return str(uuid.uuid4())
    
    def generate_reset_code(self) -> str:
        """Genera un código de 6 dígitos para reset de contraseña"""
        return ''.join(random.choices(string.digits, k=6))
    
    # =================== USER OPERATIONS ===================
    
    def create_user(self, user_data: dict) -> User:
        """Crea un nuevo usuario en Firestore"""
        user_id = self.generate_id()
        user = User(
            id=user_id,
            name=user_data["name"],
            lastName=user_data["lastName"],
            email=user_data["email"],
            password=user_data["password"],
            avatar=user_data.get("avatar"),
            resetCode=None
        )
        
        # Guardar en Firestore
        self.users_ref.document(user_id).set({
            "id": user.id,
            "name": user.name,
            "lastName": user.lastName,
            "email": user.email,
            "password": user.password,
            "avatar": user.avatar,
            "resetCode": user.resetCode,
            "createdAt": datetime.now().isoformat()
        })
        
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Obtiene un usuario por ID desde Firestore"""
        doc = self.users_ref.document(user_id).get()
        if doc.exists:
            data = doc.to_dict()
            return User(
                id=data["id"],
                name=data["name"],
                lastName=data["lastName"],
                email=data["email"],
                password=data["password"],
                avatar=data.get("avatar"),
                resetCode=data.get("resetCode")
            )
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Obtiene un usuario por email desde Firestore"""
        docs = self.users_ref.where("email", "==", email).stream()
        for doc in docs:
            data = doc.to_dict()
            return User(
                id=data["id"],
                name=data["name"],
                lastName=data["lastName"],
                email=data["email"],
                password=data["password"],
                avatar=data.get("avatar"),
                resetCode=data.get("resetCode")
            )
        return None
    
    def update_user(self, user_id: str, user_data: dict) -> Optional[User]:
        """Actualiza un usuario en Firestore"""
        user_data["updatedAt"] = datetime.now().isoformat()
        self.users_ref.document(user_id).update(user_data)
        return self.get_user_by_id(user_id)
    
    def delete_user(self, user_id: str) -> bool:
        """Elimina un usuario de Firestore"""
        self.users_ref.document(user_id).delete()
        return True
    
    # =================== CATEGORY OPERATIONS ===================
    
    def create_category(self, category_data: dict) -> Category:
        """Crea una nueva categoría en Firestore"""
        category_id = self.generate_id()
        category = Category(
            id=category_id,
            name=category_data["name"]
        )
        
        # Guardar en Firestore - solo nombre
        self.categories_ref.document(category_id).set({
            "id": category.id,
            "name": category.name,
            "createdAt": datetime.now().isoformat()
        })
        
        return category
    
    def get_category_by_id(self, category_id: str) -> Optional[Category]:
        """Obtiene una categoría por ID desde Firestore"""
        doc = self.categories_ref.document(category_id).get()
        if doc.exists:
            data = doc.to_dict()
            return Category(
                id=data["id"],
                name=data["name"]
            )
        return None
    
    def get_all_categories(self) -> List[Category]:
        """Obtiene todas las categorías desde Firestore"""
        categories = []
        for doc in self.categories_ref.stream():
            data = doc.to_dict()
            categories.append(Category(
                id=data["id"],
                name=data["name"]
            ))
        return categories
    
    def update_category(self, category_id: str, category_data: dict) -> Optional[Category]:
        """Actualiza una categoría en Firestore"""
        category_data["updatedAt"] = datetime.now().isoformat()
        self.categories_ref.document(category_id).update(category_data)
        return self.get_category_by_id(category_id)
    
    def delete_category(self, category_id: str) -> bool:
        """Elimina una categoría de Firestore"""
        self.categories_ref.document(category_id).delete()
        return True
    
    def category_has_items(self, category_id: str) -> bool:
        """Verifica si una categoría tiene items"""
        docs = self.items_ref.where("categoryId", "==", category_id).limit(1).stream()
        for _ in docs:
            return True
        return False
    
    # =================== ITEM OPERATIONS ===================
    
    def create_item(self, item_data: dict) -> Item:
        """Crea un nuevo item en Firestore"""
        item_id = self.generate_id()
        item = Item(
            id=item_id,
            name=item_data["name"],
            quantity=item_data["quantity"],
            price=item_data["price"],
            categoryId=item_data["categoryId"],
            description=item_data.get("description", "")
        )
        
        # Guardar en Firestore
        self.items_ref.document(item_id).set({
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "price": item.price,
            "categoryId": item.categoryId,
            "description": item.description,
            "createdAt": datetime.now().isoformat()
        })
        
        return item
    
    def get_item_by_id(self, item_id: str) -> Optional[Item]:
        """Obtiene un item por ID desde Firestore"""
        doc = self.items_ref.document(item_id).get()
        if doc.exists:
            data = doc.to_dict()
            return Item(
                id=data["id"],
                name=data["name"],
                quantity=data["quantity"],
                price=data["price"],
                categoryId=data["categoryId"],
                description=data.get("description", "")
            )
        return None
    
    def get_all_items(self) -> List[Item]:
        """Obtiene todos los items desde Firestore"""
        items = []
        for doc in self.items_ref.stream():
            data = doc.to_dict()
            items.append(Item(
                id=data["id"],
                name=data["name"],
                quantity=data["quantity"],
                price=data["price"],
                categoryId=data["categoryId"],
                description=data.get("description", "")
            ))
        return items
    
    def get_items_by_category(self, category_id: str) -> List[Item]:
        """Obtiene items por categoría desde Firestore"""
        items = []
        for doc in self.items_ref.where("categoryId", "==", category_id).stream():
            data = doc.to_dict()
            items.append(Item(
                id=data["id"],
                name=data["name"],
                quantity=data["quantity"],
                price=data["price"],
                categoryId=data["categoryId"],
                description=data.get("description", "")
            ))
        return items
    
    def update_item(self, item_id: str, item_data: dict) -> Optional[Item]:
        """Actualiza un item en Firestore"""
        item_data["updatedAt"] = datetime.now().isoformat()
        self.items_ref.document(item_id).update(item_data)
        return self.get_item_by_id(item_id)
    
    def delete_item(self, item_id: str) -> bool:
        """Elimina un item de Firestore"""
        self.items_ref.document(item_id).delete()
        return True
    
    def category_exists(self, category_id: str) -> bool:
        """Verifica si una categoría existe"""
        doc = self.categories_ref.document(category_id).get()
        return doc.exists
    
    def set_reset_code(self, email: str) -> Optional[str]:
        """Genera y guarda un código de reset para un usuario"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        reset_code = self.generate_reset_code()
        self.update_user(user.id, {"resetCode": reset_code})
        return reset_code
    
    def verify_reset_code(self, email: str, reset_code: str) -> bool:
        """Verifica si el código de reset es válido"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        
        return user.resetCode == reset_code
    
    def reset_password(self, email: str, new_password: str) -> bool:
        """Reestablece la contraseña de un usuario"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        
        self.update_user(user.id, {
            "password": new_password,
            "resetCode": None
        })
        return True

# Instancia global de FirebaseStorage
storage = FirebaseStorage()

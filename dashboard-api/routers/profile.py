from fastapi import APIRouter, HTTPException, status
from models.user import UserResponse, UserUpdate, ChangePasswordRequest, UpdateEmailRequest, StandardResponse
from storage.firebase_storage import storage
from utils.password_handler import hash_password, verify_password
from utils.helpers import validate_resource_exists

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_profile(user_id: str):
    """Obtener perfil del usuario"""
    user = storage.get_user_by_id(user_id)
    validate_resource_exists(user, "Usuario")
    
    return UserResponse(
        id=user.id,
        name=user.name,
        lastName=user.lastName,
        email=user.email,
        avatar=user.avatar if hasattr(user, 'avatar') else None,
        resetCode=user.resetCode
    )

@router.put("/{user_id}", response_model=UserResponse)
async def update_profile(user_id: str, update_data: UserUpdate):
    """Actualizar perfil (nombre, apellido, avatar)"""
    user = storage.get_user_by_id(user_id)
    validate_resource_exists(user, "Usuario")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if not update_dict:
        return UserResponse(
            id=user.id,
            name=user.name,
            lastName=user.lastName,
            email=user.email,
            avatar=user.avatar if hasattr(user, 'avatar') else None,
            resetCode=user.resetCode
        )
    
    updated_user = storage.update_user(user_id, update_dict)
    
    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        lastName=updated_user.lastName,
        email=updated_user.email,
        avatar=updated_user.avatar if hasattr(updated_user, 'avatar') else None,
        resetCode=updated_user.resetCode
    )

@router.put("/{user_id}/email", response_model=UserResponse)
async def update_email(user_id: str, request: UpdateEmailRequest):
    """Cambiar email del usuario"""
    user = storage.get_user_by_id(user_id)
    validate_resource_exists(user, "Usuario")
    
    # Verificar que el nuevo email no esté en uso
    existing_user = storage.get_user_by_email(request.newEmail)
    if existing_user and existing_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está en uso"
        )
    
    updated_user = storage.update_user(user_id, {"email": request.newEmail})
    
    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        lastName=updated_user.lastName,
        email=updated_user.email,
        avatar=updated_user.avatar if hasattr(updated_user, 'avatar') else None,
        resetCode=updated_user.resetCode
    )

@router.put("/{user_id}/password", response_model=UserResponse)
async def change_password(user_id: str, request: ChangePasswordRequest):
    """Cambiar contraseña del usuario"""
    user = storage.get_user_by_id(user_id)
    validate_resource_exists(user, "Usuario")
    
    # Verificar contraseña actual
    if not verify_password(request.currentPassword, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña actual incorrecta"
        )
    
    # Encriptar y guardar nueva contraseña
    hashed_password = hash_password(request.newPassword)
    updated_user = storage.update_user(user_id, {"password": hashed_password})
    
    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        lastName=updated_user.lastName,
        email=updated_user.email,
        avatar=updated_user.avatar if hasattr(updated_user, 'avatar') else None,
        resetCode=updated_user.resetCode
    )

from fastapi import APIRouter, HTTPException, status
from models.user import (
    UserResponse, UserUpdate, ChangePasswordRequest, 
    UpdateEmailRequest, StandardResponse
)
from storage.memory_storage import storage

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile/{user_id}", response_model=UserResponse)
async def get_user_profile(user_id: str):
    """
    Obtener perfil de usuario por ID
    
    - **user_id**: ID único del usuario
    """
    user = storage.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(
        id=user.id,
        name=user.name,
        lastName=user.lastName,
        email=user.email,
        resetCode=user.resetCode
    )

@router.put("/profile/{user_id}", response_model=UserResponse)
async def update_user_profile(user_id: str, update_data: UserUpdate):
    """
    Actualizar perfil de usuario
    
    - **user_id**: ID único del usuario
    - **name**: Nuevo nombre (opcional)
    - **lastName**: Nuevo apellido (opcional)  
    - **email**: Nuevo email (opcional)
    """
    user = storage.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    try:
        # Filtrar campos no nulos
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if update_dict:
            updated_user = storage.update_user(user_id, update_dict)
            
            return UserResponse(
                id=updated_user.id,
                name=updated_user.name,
                lastName=updated_user.lastName,
                email=updated_user.email,
                resetCode=updated_user.resetCode
            )
        else:
            return UserResponse(
                id=user.id,
                name=user.name,
                lastName=user.lastName,
                email=user.email,
                resetCode=user.resetCode
            )
            
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/email/{user_id}", response_model=StandardResponse)
async def update_email(user_id: str, request: UpdateEmailRequest):
    """
    Cambiar email de usuario
    
    - **user_id**: ID único del usuario
    - **newEmail**: Nuevo email único
    """
    user = storage.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    try:
        storage.update_user(user_id, {"email": request.newEmail})
        return StandardResponse(
            message="Email actualizado exitosamente",
            status="success"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está en uso"
        )

@router.put("/password/{user_id}", response_model=StandardResponse)
async def change_password(user_id: str, request: ChangePasswordRequest):
    """
    Cambiar contraseña de usuario
    
    - **user_id**: ID único del usuario
    - **currentPassword**: Contraseña actual
    - **newPassword**: Nueva contraseña (mínimo 6 caracteres)
    """
    user = storage.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.password != request.currentPassword:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña actual incorrecta"
        )
    
    storage.update_user(user_id, {"password": request.newPassword})
    
    return StandardResponse(
        message="Contraseña actualizada exitosamente",
        status="success"
    )
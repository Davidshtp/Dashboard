from fastapi import APIRouter, HTTPException, status
from models.user import (
    LoginRequest, LoginResponse, ForgotPasswordRequest, 
    ResetPasswordRequest, UserCreate, UserResponse, StandardResponse
)
from storage.memory_storage import storage

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Registrar un nuevo usuario
    
    - **name**: Nombre del usuario
    - **lastName**: Apellido del usuario  
    - **email**: Email único del usuario
    - **password**: Contraseña (mínimo 6 caracteres)
    """
    # Verificar si el email ya existe
    existing_user = storage.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    try:
        user = storage.create_user(user_data.dict())
        return UserResponse(
            id=user.id,
            name=user.name,
            lastName=user.lastName,
            email=user.email,
            resetCode=user.resetCode
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Iniciar sesión
    
    - **email**: Email del usuario registrado
    - **password**: Contraseña del usuario
    """
    user = storage.get_user_by_email(credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.password != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    return LoginResponse(
        message="Login exitoso",
        status="success",
        user=UserResponse(
            id=user.id,
            name=user.name,
            lastName=user.lastName,
            email=user.email,
            resetCode=user.resetCode
        )
    )

@router.post("/forgot-password", response_model=StandardResponse)
async def forgot_password(request: ForgotPasswordRequest):
    """
    Solicitar código para restablecer contraseña
    
    - **email**: Email del usuario registrado
    """
    reset_code = storage.set_reset_code(request.email)
    
    if not reset_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return StandardResponse(
        message=f"Código de recuperación generado: {reset_code}",
        status="success"
    )

@router.post("/reset-password", response_model=StandardResponse)
async def reset_password(request: ResetPasswordRequest):
    """
    Restablecer contraseña usando código de verificación
    
    - **email**: Email del usuario
    - **resetCode**: Código de verificación recibido
    - **newPassword**: Nueva contraseña (mínimo 6 caracteres)
    """
    # Verificar código de reset
    if not storage.verify_reset_code(request.email, request.resetCode):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código de verificación inválido o expirado"
        )
    
    # Resetear contraseña
    success = storage.reset_password(request.email, request.newPassword)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return StandardResponse(
        message="Contraseña restablecida exitosamente",
        status="success"
    )
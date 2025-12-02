from fastapi import APIRouter, HTTPException, status, Header
from models.user import (
    LoginRequest, LoginResponse, ForgotPasswordRequest, 
    ResetPasswordRequest, UserCreate, UserResponse, StandardResponse
)
from storage.firebase_storage import storage
from utils.jwt_handler import create_access_token, verify_access_token
from utils.password_handler import hash_password, verify_password
from typing import Optional

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
        # Encriptar la contraseña antes de guardarla
        user_dict = user_data.dict()
        user_dict['password'] = hash_password(user_dict['password'])
        
        user = storage.create_user(user_dict)
        return UserResponse(
            id=user.id,
            name=user.name,
            lastName=user.lastName,
            email=user.email,
            avatar=user.avatar if hasattr(user, 'avatar') else None,
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
    
    Retorna un JWT con los datos del usuario en el payload
    """
    user = storage.get_user_by_email(credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verificar contraseña usando bcrypt
    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta"
        )
    
    # Generar JWT con datos del usuario en el payload
    token = create_access_token({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "lastName": user.lastName
    })
    
    return LoginResponse(
        message="Login exitoso",
        status="success",
        user=UserResponse(
            id=user.id,
            name=user.name,
            lastName=user.lastName,
            email=user.email,
            avatar=user.avatar if hasattr(user, 'avatar') else None,
            resetCode=user.resetCode
        ),
        jwt=token
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
    
    # Encriptar la nueva contraseña
    hashed_password = hash_password(request.newPassword)
    
    # Resetear contraseña
    success = storage.reset_password(request.email, hashed_password)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return StandardResponse(
        message="Contraseña restablecida exitosamente",
        status="success"
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Obtener datos del usuario actual validando el JWT
    
    - **authorization**: Header con el JWT (Bearer {token})
    
    Decodifica el JWT y retorna la información del usuario
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no proporcionado"
        )
    
    try:
        # Extraer token del header "Bearer {token}"
        token = authorization.replace("Bearer ", "").strip()
        
        # Verificar y decodificar JWT
        payload = verify_access_token(token)
        
        # Obtener usuario de Firestore con el ID del payload
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido - ID no encontrado"
            )
        
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
            avatar=user.avatar if hasattr(user, 'avatar') else None,
            resetCode=user.resetCode
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en /auth/me: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
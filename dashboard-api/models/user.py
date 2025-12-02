from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="Nombre del usuario")
    lastName: str = Field(..., min_length=1, max_length=50, description="Apellido del usuario")
    email: EmailStr = Field(..., description="Email único del usuario")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Contraseña del usuario (mínimo 6 caracteres)")

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    lastName: Optional[str] = Field(None, min_length=1, max_length=50)
    avatar: Optional[str] = Field(None, description="URL del avatar del usuario")

class UserResponse(UserBase):
    id: str = Field(..., description="ID único del usuario")
    avatar: Optional[str] = Field(None, description="URL del avatar del usuario")
    resetCode: Optional[str] = Field(None, description="Código temporal para reset de contraseña")
    
    class Config:
        from_attributes = True

class User(UserResponse):
    password: str = Field(..., description="Contraseña hasheada")

# Modelos para autenticación
class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=1, description="Contraseña del usuario")

class LoginResponse(BaseModel):
    message: str
    status: str
    user: UserResponse
    jwt: str = Field(..., description="JWT token para autenticación")

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")
    resetCode: str = Field(..., min_length=1, description="Código de verificación")
    newPassword: str = Field(..., min_length=6, description="Nueva contraseña")

class ChangePasswordRequest(BaseModel):
    currentPassword: str = Field(..., min_length=1, description="Contraseña actual")
    newPassword: str = Field(..., min_length=6, description="Nueva contraseña")

class UpdateEmailRequest(BaseModel):
    newEmail: EmailStr = Field(..., description="Nuevo email")

# Respuestas estándar
class StandardResponse(BaseModel):
    message: str
    status: str
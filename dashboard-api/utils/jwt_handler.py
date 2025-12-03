import jwt
from datetime import datetime, timedelta
from typing import Dict, Any
import os

# Clave secreta para firmar JWT (en producción usar variable de entorno)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-12345")
ALGORITHM = "HS256"
EXPIRATION_HOURS = 24

def create_access_token(data: Dict[str, Any]) -> str:
    """
    Crea un JWT con los datos del usuario
    
    Args:
        data: Diccionario con información del usuario (id, email, name, lastName)
    
    Returns:
        Token JWT firmado
    """
    to_encode = data.copy()
    
    # Agregar tiempo de expiración como timestamp Unix
    expire = datetime.utcnow() + timedelta(hours=EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    
    # Codificar y firmar el JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_access_token(token: str) -> Dict[str, Any]:
    """
    Verifica y decodifica un JWT
    
    Args:
        token: Token JWT a verificar
    
    Returns:
        Datos del payload del JWT
    
    Raises:
        jwt.InvalidTokenError: Si el token es inválido o expirado
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expirado")
    except jwt.InvalidTokenError:
        raise Exception("Token inválido")

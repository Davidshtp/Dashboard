import bcrypt
from typing import Tuple

def hash_password(password: str) -> str:
    """
    Encripta una contraseña usando bcrypt
    
    Args:
        password: Contraseña en texto plano
    
    Returns:
        Contraseña encriptada (hash)
    """
    # Generar salt y hashear la contraseña
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Convertir a string para almacenar en Firestore
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña en texto plano coincide con su hash
    
    Args:
        plain_password: Contraseña en texto plano (la que el usuario ingresa)
        hashed_password: Hash almacenado en la base de datos
    
    Returns:
        True si coincide, False si no
    """
    try:
        # Convertir strings a bytes y comparar
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception as e:
        print(f"Error verificando contraseña: {str(e)}")
        return False

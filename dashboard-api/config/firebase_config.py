import firebase_admin
from firebase_admin import credentials, firestore
import os

# Obtener la ruta del archivo de credenciales
service_account_path = os.path.join(
    os.path.dirname(__file__), 
    "serviceAccountKey.json"
)

# Inicializar Firebase con las credenciales
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)

# Obtener cliente de Firestore
db = firestore.client()

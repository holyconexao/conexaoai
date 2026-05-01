from celery import shared_task
from .models import ErrorLog
import logging

logger = logging.getLogger(__name__)

@shared_task
def save_error_log_task(error_data):
    """
    Task executada em background pelo Celery (através do Redis) para não 
    travar o tempo de resposta da requisição original.
    """
    try:
        ErrorLog.objects.create(**error_data)
    except Exception as e:
        logger.error(f"Falha ao salvar ErrorLog via Celery: {e}")

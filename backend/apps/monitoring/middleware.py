import traceback
import logging
from django.utils.deprecation import MiddlewareMixin
from .tasks import save_error_log_task

logger = logging.getLogger(__name__)

class ErrorTrackingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        try:
            tb = traceback.format_exc()
            
            user_info = ""
            if hasattr(request, "user") and request.user.is_authenticated:
                user_info = f"{request.user.email} (ID: {request.user.id})"
            else:
                user_info = "Anônimo"

            error_data = {
                "path": request.path[:255],
                "method": request.method[:10],
                "user": user_info[:255],
                "exception_type": exception.__class__.__name__[:255],
                "exception_message": str(exception),
                "traceback": tb
            }

            # Envia para a fila do Redis (Celery) para salvar no banco em background
            # Isso garante que a requisição não sofra atraso extra no momento do erro.
            save_error_log_task.delay(error_data)

        except Exception as e:
            logger.error(f"Falha ao enviar ErrorLog para o Redis/Celery: {e}")
            
        return None


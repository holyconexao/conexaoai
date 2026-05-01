from django.db import models

class ErrorLog(models.Model):
    path = models.CharField(max_length=255, verbose_name="Caminho (URL)")
    method = models.CharField(max_length=10, verbose_name="Método HTTP")
    user = models.CharField(max_length=255, blank=True, null=True, verbose_name="Usuário")
    exception_type = models.CharField(max_length=255, verbose_name="Tipo de Exceção")
    exception_message = models.TextField(verbose_name="Mensagem de Erro")
    traceback = models.TextField(verbose_name="Traceback", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data/Hora")

    class Meta:
        verbose_name = "Log de Erro"
        verbose_name_plural = "Logs de Erro"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.exception_type} em {self.path} ({self.created_at.strftime('%d/%m/%Y %H:%M:%S')})"
